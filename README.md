# Spy

An asymmetric social deduction game

## Deployment

Use `deploy.ps1` to build and deploy the UI and API. The two must be deployed together even if there has been no change to one of them. This is because the api is managed by the static web app and is not provisioned independently.

```powershell
pwsh ./deploy.ps1 -Environment dev
```