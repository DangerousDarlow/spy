@description('Name of the Static Web App')
param name string

@description('Environment name (e.g., dev, test, prod)')
param environment string

@description('Azure region (e.g., westeurope)')
param location string

// Tags to apply to all resources
var tags object = {
  Environment: environment
  Project: 'spy'
  ManagedBy: 'bicep'
}

var baseName = '${name}-${environment}'
var staticWebAppName = '${baseName}-swa'

// Static Web App
// https://learn.microsoft.com/en-us/azure/templates/microsoft.web/2024-11-01/staticsites?pivots=deployment-language-bicep
resource staticWebApp 'Microsoft.Web/staticSites@2024-11-01' = {
  name: staticWebAppName
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppId string = staticWebApp.id
