<#
.SYNOPSIS
Builds the UI and deploys it to an Azure Static Web App.

.DESCRIPTION
PowerShell 7+ compatible script intended to run on Windows, Linux, and macOS.
Uses Azure CLI to retrieve the deployment token and the SWA CLI for upload.
Supports -WhatIf/-Confirm using ShouldProcess for operations that change Azure state.
#>

[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Medium', PositionalBinding = $false)]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Environment,

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$ParametersFile = '../infra/main.parameters.json',

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = 'build'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Resolve-InputPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$BasePath
    )

    $candidate = $Path
    if (-not [System.IO.Path]::IsPathRooted($candidate)) {
        $candidate = Join-Path -Path $BasePath -ChildPath $candidate
    }

    $resolved = Resolve-Path -Path $candidate -ErrorAction Stop
    return $resolved.Path
}

function Resolve-PathAllowMissing {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$BasePath
    )

    $candidate = $Path
    if (-not [System.IO.Path]::IsPathRooted($candidate)) {
        $candidate = Join-Path -Path $BasePath -ChildPath $candidate
    }

    return [System.IO.Path]::GetFullPath($candidate)
}

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
    Write-Host 'Starting Azure Static Web App deployment' -ForegroundColor Green

    if (-not (Test-CommandAvailable -Name 'pnpm')) {
        throw "pnpm is not installed or not on PATH."
    }

    if (-not (Test-CommandAvailable -Name 'npx')) {
        throw "npx is not installed or not on PATH."
    }

    if (-not (Test-CommandAvailable -Name 'az')) {
        throw "Azure CLI ('az') is not installed or not on PATH."
    }

    $scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
    $parametersFilePath = Resolve-InputPath -Path $ParametersFile -BasePath $scriptRoot
    $outputPathResolved = Resolve-PathAllowMissing -Path $OutputPath -BasePath $scriptRoot

    Write-Host "Reading parameters from file: $parametersFilePath" -ForegroundColor Blue
    $parametersContent = Get-Content -Path $parametersFilePath -Raw -ErrorAction Stop | ConvertFrom-Json
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

    Write-Host "Environment: $Environment" -ForegroundColor Blue
    Write-Host "Static Web App Name (expected): $staticWebAppName" -ForegroundColor Blue
    Write-Host "Resource Group Name: $resourceGroupName" -ForegroundColor Blue
    Write-Host "Resource Group Location: $location" -ForegroundColor Blue

    # Confirm login (read-only)
    try {
        $null = Invoke-AzCli -Arguments @('account', 'show', '--query', 'id', '-o', 'tsv', '--only-show-errors')
    } catch {
        throw "Not logged in to Azure. Run 'az login' and try again. Details: $($_.Exception.Message)"
    }

    Write-Host 'Building UI...' -ForegroundColor Blue
    Push-Location -Path $scriptRoot
    try {
        Invoke-ExternalCommand -Name 'pnpm' -Arguments @('build')
    } finally {
        Pop-Location
    }

    if (-not (Test-Path -Path $outputPathResolved)) {
        throw "Build output path not found: $outputPathResolved"
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

    if ($PSCmdlet.ShouldProcess("Static Web App '$staticWebAppName'", "Deploy '$outputPathResolved'")) {
        Write-Host 'Deploying build output to Azure Static Web App...' -ForegroundColor Blue

        $deployArgs = @(
            '--yes',
            '@azure/static-web-apps-cli',
            'deploy',
            $outputPathResolved,
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
        Write-Host "WhatIf: Would deploy '$outputPathResolved' to '$staticWebAppName'." -ForegroundColor Yellow
    }

    Write-Host 'Azure Static Web App deployment completed' -ForegroundColor Green
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
