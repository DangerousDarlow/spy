<#
.SYNOPSIS
Deploys Azure Static Web App infrastructure using Bicep via Azure CLI.

.DESCRIPTION
PowerShell 7+ compatible script intended to run on Windows, Linux, and macOS.
Supports -WhatIf/-Confirm using ShouldProcess for operations that change Azure state.
#>

[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Medium', PositionalBinding = $false)]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Environment,

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$ParametersFile = 'main.parameters.json',

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$BicepFile = 'main.bicep'
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

function Test-AzureCliAvailable {
    return $null -ne (Get-Command -Name 'az' -ErrorAction SilentlyContinue)
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

try {
    Write-Host 'Starting Azure Static Web App Infrastructure Deployment' -ForegroundColor Green

    if (-not (Test-AzureCliAvailable)) {
        throw "Azure CLI ('az') is not installed or not on PATH."
    }

    $scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
    $parametersFilePath = Resolve-InputPath -Path $ParametersFile -BasePath $scriptRoot
    $bicepFilePath = Resolve-InputPath -Path $BicepFile -BasePath $scriptRoot

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

    $currentSubscription = Invoke-AzCli -Arguments @('account', 'show', '--query', 'name', '-o', 'tsv', '--only-show-errors')
    if ([string]::IsNullOrWhiteSpace($currentSubscription)) {
        throw 'Failed to retrieve current subscription name from Azure CLI.'
    }

    Write-Host "Checking if resource group '$resourceGroupName' exists..." -ForegroundColor Blue
    $rgExistsText = Invoke-AzCli -Arguments @('group', 'exists', '--name', $resourceGroupName, '--only-show-errors')
    $rgExists = $rgExistsText.Trim().ToLowerInvariant() -eq 'true'

    if (-not $rgExists) {
        if ($PSCmdlet.ShouldProcess("resource group '$resourceGroupName'", "Create in '$location'")) {
            Write-Host "Creating resource group '$resourceGroupName' in '$location'..." -ForegroundColor Blue
            $null = Invoke-AzCli -Arguments @('group', 'create', '--name', $resourceGroupName, '--location', $location, '--only-show-errors')
            Write-Host 'Resource group created successfully' -ForegroundColor Green
        } else {
            Write-Host "WhatIf: Would create resource group '$resourceGroupName' in '$location'." -ForegroundColor Yellow
        }
    } else {
        Write-Host 'Resource group already exists' -ForegroundColor Green
    }

    Write-Host 'Validating Bicep template...' -ForegroundColor Blue
    $null = Invoke-AzCli -Arguments @(
        'deployment', 'group', 'validate',
        '--resource-group', $resourceGroupName,
        '--template-file', $bicepFilePath,
        '--parameters', $parametersFilePath,
        '--parameters', "environment=$Environment",
        '--only-show-errors'
    )
    Write-Host 'Template validation successful' -ForegroundColor Green

    $deploymentName = "swa-deployment-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

    if ($PSCmdlet.ShouldProcess("resource group '$resourceGroupName'", "Deploy Bicep template (deployment '$deploymentName')")) {
        Write-Host 'Deploying Azure Static Web App infrastructure...' -ForegroundColor Blue

        $createArgs = @(
            'deployment', 'group', 'create',
            '--resource-group', $resourceGroupName,
            '--name', $deploymentName,
            '--template-file', $bicepFilePath,
            '--parameters', $parametersFilePath,
            '--parameters', "environment=$Environment",
            '--only-show-errors'
        )
        if ($VerbosePreference -eq 'Continue') {
            $createArgs += '--verbose'
        }

        $null = Invoke-AzCli -Arguments $createArgs
        Write-Host 'Deployment completed successfully' -ForegroundColor Green

        Write-Host 'Retrieving deployment outputs...' -ForegroundColor Blue
        $outputs = Invoke-AzCli -Arguments @(
            'deployment', 'group', 'show',
            '--resource-group', $resourceGroupName,
            '--name', $deploymentName,
            '--query', 'properties.outputs',
            '--output', 'json',
            '--only-show-errors'
        ) -OutputKind json

        if ($outputs) {
            Write-Host 'Deployment Outputs:' -ForegroundColor Yellow
            if ($outputs.staticWebAppName) { Write-Host "  Static Web App Name: $($outputs.staticWebAppName.value)" -ForegroundColor White }
            if ($outputs.staticWebAppUrl) { Write-Host "  Static Web App URL: $($outputs.staticWebAppUrl.value)" -ForegroundColor White }
            if ($outputs.staticWebAppId) { Write-Host "  Static Web App Id: $($outputs.staticWebAppId.value)" -ForegroundColor White }
        }
    } else {
        Write-Host "WhatIf: Would deploy to resource group '$resourceGroupName' using '$bicepFilePath'." -ForegroundColor Yellow
    }

    Write-Host 'Azure Static Web App infrastructure deployment completed' -ForegroundColor Green
}
catch {
    Write-Error $_
    exit 1
}