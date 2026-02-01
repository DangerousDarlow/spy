# Infrastructure Provisioning

## Prerequisites

- PowerShell
- Azure CLI
    - Log in using `az login`
    - Set subscription id using `az account set --subscription <SUBSCRIPTION_ID>`

### Ubuntu

Install PowerShell using snap.
```sh
snap install powershell --classic
```

The [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/scripting/install/install-ubuntu?view=powershell-7.5) suggests using the Microsoft Linux package repository with apt but support for the latest (non-LTS) version of Ubuntu might be missing.

Azure CLI installation is part of the Ubuntu SystemSetup scripts; https://github.com/DangerousDarlow/SystemSetup.

## Run

Provision an environment using PowerShell.
```powershell
pwsh ./provision.ps1 -Environment dev
```