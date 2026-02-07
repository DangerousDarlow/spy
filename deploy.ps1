[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Medium', PositionalBinding = $false)]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Environment,

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$ParametersFile = './infra/main.parameters.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Test-CommandAvailable {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    return $null -ne (Get-Command -Name $Name -ErrorAction SilentlyContinue)
}

function Invoke-AzCli {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments,

        [Parameter(Mandatory = $false)]
        [ValidateSet('text', 'json')]
        [string]$OutputKind = 'text'
    )

    Write-Verbose ("az {0}" -f ($Arguments -join ' '))

    $output = & az @Arguments 2>&1
    $exitCode = $LASTEXITCODE
    $text = ($output | Out-String).Trim()

    if ($exitCode -ne 0) {
        $message = if ([string]::IsNullOrWhiteSpace($text)) {
            "Azure CLI failed with exit code $exitCode"
        } else {
            "Azure CLI failed with exit code $exitCode : $text"
        }

        throw $message
    }

    if ($OutputKind -eq 'json') {
        if ([string]::IsNullOrWhiteSpace($text)) {
            return $null
        }
        return $text | ConvertFrom-Json
    }

    return $text
}

function Invoke-ExternalCommand {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    Write-Verbose ("{0} {1}" -f $Name, ($Arguments -join ' '))

    $output = & $Name @Arguments 2>&1
    $exitCode = $LASTEXITCODE
    $text = ($output | Out-String).TrimEnd()

    if (-not [string]::IsNullOrWhiteSpace($text)) {
        Write-Host $text
    }

    if ($exitCode -ne 0) {
        throw "$Name failed with exit code $exitCode"
    }
}

try {
    if (-not (Test-CommandAvailable -Name 'pnpm')) {
        throw "pnpm is not installed or not on PATH."
    }

    if (-not (Test-CommandAvailable -Name 'npx')) {
        throw "npx is not installed or not on PATH."
    }

    if (-not (Test-CommandAvailable -Name 'az')) {
        throw "Azure CLI ('az') is not installed or not on PATH."
    }

    $parametersContent = Get-Content -Path $ParametersFile -Raw -ErrorAction Stop | ConvertFrom-Json
    $name = $parametersContent.parameters.name.value
    $location = $parametersContent.parameters.location.value

    if ([string]::IsNullOrWhiteSpace($name)) {
        throw "Parameters file is missing 'parameters.name.value'."
    }

    if ([string]::IsNullOrWhiteSpace($location)) {
        throw "Parameters file is missing 'parameters.location.value'."
    }

    $baseName = "$name-$Environment"
    $staticWebAppName = "$baseName-swa"
    $resourceGroupName = "rg-$name-$Environment"

    $uiRoot = (Resolve-Path 'ui').Path
    $uiOutputPath = Join-Path $uiRoot 'build'
    $apiRoot = (Resolve-Path 'api').Path
    $apiOutputPath = Join-Path $apiRoot 'publish'

    Write-Host "Environment: $Environment" -ForegroundColor Blue
    Write-Host "Static Web App Name: $staticWebAppName" -ForegroundColor Blue
    Write-Host "Resource Group Name: $resourceGroupName" -ForegroundColor Blue
    Write-Host "Resource Group Location: $location" -ForegroundColor Blue
    Write-Host "UI output path: $uiOutputPath" -ForegroundColor Blue
    Write-Host "API output path: $apiOutputPath" -ForegroundColor Blue

    # Check Azure CLI login by attempting to get the current account ID
    try {
        $null = Invoke-AzCli -Arguments @('account', 'show', '--query', 'id', '-o', 'tsv', '--only-show-errors')
    } catch {
        throw "Not logged in to Azure. Run 'az login' and try again. Details: $($_.Exception.Message)"
    }

    Write-Host 'Building ui...' -ForegroundColor Blue
    Push-Location $uiRoot

    try {
        Remove-Item -Path $uiOutputPath -Recurse -Force

        # The default build output directory is `build`. This can be changed by specifying adapter options in `svelte.config.js`.
        Invoke-ExternalCommand -Name 'pnpm' -Arguments @('build')
    } finally {
        Pop-Location
    }

    if (-not (Test-Path -Path $uiOutputPath)) {
        throw "ui build output path not found: $uiOutputPath"
    }

    Write-Host 'Building api...' -ForegroundColor Blue
    Push-Location $apiRoot
    try {
        Remove-Item -Path $apiOutputPath -Recurse -Force
        Invoke-ExternalCommand -Name 'dotnet' -Arguments @('publish', 'api.csproj', '-c', 'Release', '-o', $apiOutputPath)
    } finally {
        Pop-Location
    }

    if (-not (Test-Path -Path $apiOutputPath)) {
        throw "api build output path not found: $apiOutputPath"
    }

    Write-Host 'Retrieving deployment token...' -ForegroundColor Blue
    $deploymentToken = Invoke-AzCli -Arguments @(
        'staticwebapp', 'secrets', 'list',
        '--name', $staticWebAppName,
        '--resource-group', $resourceGroupName,
        '--query', 'properties.apiKey',
        '--output', 'tsv',
        '--only-show-errors'
    )

    if ([string]::IsNullOrWhiteSpace($deploymentToken)) {
        throw 'Deployment token not returned. Ensure the Static Web App exists and you have access.'
    }

    if ($PSCmdlet.ShouldProcess("Static Web App '$staticWebAppName' ui & api", "Deploy")) {
        Write-Host 'Deploying ui and api...' -ForegroundColor Blue

        $deployArgs = @(
            '--yes',
            '@azure/static-web-apps-cli',
            'deploy',
            $uiOutputPath,
            '--api-location',
            $apiOutputPath,
            '--api-language',
            'dotnetisolated',
            '--api-version',
            '9.0',
            '--deployment-token',
            $deploymentToken,
            '--env',
            'production'
        )

        if ($VerbosePreference -eq 'Continue') {
            $deployArgs += '--verbose'
        }

        Invoke-ExternalCommand -Name 'npx' -Arguments $deployArgs
        Write-Host 'Deployment completed successfully' -ForegroundColor Green
    } else {
        Write-Host "WhatIf: Would deploy ui from '$uiOutputPath' and api from '$apiOutputPath' to '$staticWebAppName'." -ForegroundColor Yellow
    }
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
