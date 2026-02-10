# Spy

An asymmetric social deduction game

## Deployment

Use `deploy.ps1` to build and deploy the UI and/or the API. The `-Component` parameter controls what to build and deploy.

```powershell
pwsh ./deploy.ps1 -Environment dev
pwsh ./deploy.ps1 -Environment dev -Component Ui
pwsh ./deploy.ps1 -Environment dev -Component Api
pwsh ./deploy.ps1 -Environment dev -Component Both
```

`-Component` defaults to `Both` if omitted.
