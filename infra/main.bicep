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
var cosmosApiVersion = '2025-10-15'
var cosmosAccountName = '${baseName}-cosmos'
var cosmosDatabaseName = '${baseName}-db'
var cosmosGamesContainerName = 'games'

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

// Cosmos DB for NoSQL account for the managed Static Web App functions
// https://learn.microsoft.com/en-us/azure/templates/microsoft.documentdb/2025-10-15/databaseaccounts?pivots=deployment-language-bicep
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2025-10-15' = {
  name: cosmosAccountName
  location: location
  kind: 'GlobalDocumentDB'
  tags: tags
  properties: {
    backupPolicy: {
      type: 'Periodic'
      periodicModeProperties: {
        backupIntervalInMinutes: 240
        backupRetentionIntervalInHours: 8
        backupStorageRedundancy: 'Local'
      }
    }
    capabilities: []
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    databaseAccountOfferType: 'Standard'
    disableKeyBasedMetadataWriteAccess: false
    disableLocalAuth: false
    enableAnalyticalStorage: false
    enableAutomaticFailover: false
    enableFreeTier: true
    enableMultipleWriteLocations: false
    isVirtualNetworkFilterEnabled: false
    locations: [
      {
        failoverPriority: 0
        isZoneRedundant: false
        locationName: location
      }
    ]
    minimalTlsVersion: 'Tls12'
    networkAclBypass: 'None'
    networkAclBypassResourceIds: []
    publicNetworkAccess: 'Enabled'
    virtualNetworkRules: []
  }
}

resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2025-10-15' = {
  name: cosmosDatabaseName
  parent: cosmosAccount
  properties: {
    resource: {
      id: cosmosDatabaseName
    }
  }
}

resource cosmosGamesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2025-10-15' = {
  name: cosmosGamesContainerName
  parent: cosmosDatabase
  properties: {
    resource: {
      id: cosmosGamesContainerName
      defaultTtl: 172800
      partitionKey: {
        kind: 'Hash'
        paths: [
          '/id'
        ]
      }
      uniqueKeyPolicy: {
        uniqueKeys: [
          {
            paths: [
              '/name'
            ]
          }
        ]
      }
    }
  }
}

resource staticWebAppFunctionAppSettings 'Microsoft.Web/staticSites/config@2024-11-01' = {
  name: 'functionappsettings'
  parent: staticWebApp
  properties: {
    COSMOS_ACCOUNT_ENDPOINT: cosmosAccount.properties.documentEndpoint
    COSMOS_CONNECTION_STRING: listConnectionStrings(cosmosAccount.id, cosmosApiVersion).connectionStrings[0].connectionString
  }
}

output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppId string = staticWebApp.id
output cosmosAccountName string = cosmosAccount.name
output cosmosDatabaseName string = cosmosDatabase.name
output cosmosGamesContainerName string = cosmosGamesContainer.name
output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint
