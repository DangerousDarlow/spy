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
var signalRName = '${baseName}-signalr'

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

// https://learn.microsoft.com/en-us/azure/templates/microsoft.documentdb/2025-10-15/databaseaccounts/sqldatabases?pivots=deployment-language-bicep
resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2025-10-15' = {
  name: cosmosDatabaseName
  parent: cosmosAccount
  properties: {
    resource: {
      id: cosmosDatabaseName
    }
  }
}

// https://learn.microsoft.com/en-us/azure/templates/microsoft.documentdb/2025-10-15/databaseaccounts/sqldatabases/containers?pivots=deployment-language-bicep
resource cosmosGamesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2025-10-15' = {
  name: cosmosGamesContainerName
  parent: cosmosDatabase
  properties: {
    resource: {
      id: cosmosGamesContainerName
      defaultTtl: 86400
      partitionKey: {
        kind: 'Hash'
        paths: [
          '/id'
        ]
      }
    }
  }
}

// Azure SignalR Service (free tier, serverless mode for Azure Functions integration)
// https://learn.microsoft.com/en-us/azure/templates/microsoft.signalrservice/2025-01-01-preview/signalr?pivots=deployment-language-bicep
resource signalR 'Microsoft.SignalRService/signalR@2025-01-01-preview' = {
  name: signalRName
  location: location
  tags: tags
  sku: {
    name: 'Free_F1'
    tier: 'Free'
    capacity: 1
  }
  properties: {
    features: [
      {
        flag: 'ServiceMode'
        value: 'Serverless'
      }
    ]
    cors: {
      allowedOrigins: ['*']
    }
  }
}

// https://learn.microsoft.com/en-us/azure/templates/microsoft.web/2024-11-01/staticsites/config?pivots=deployment-language-bicep
resource staticWebAppFunctionAppSettings 'Microsoft.Web/staticSites/config@2024-11-01' = {
  name: 'functionappsettings'
  parent: staticWebApp
  properties: {
    AZURE_SIGNALR_CONNECTION_STRING: signalR.listKeys().primaryConnectionString
    COSMOS_ACCOUNT_ENDPOINT: cosmosAccount.properties.documentEndpoint
    COSMOS_CONNECTION_STRING: listConnectionStrings(cosmosAccount.id, cosmosApiVersion).connectionStrings[0].connectionString
    COSMOS_DATABASE_NAME: cosmosDatabase.name
    COSMOS_GAMES_CONTAINER_NAME: cosmosGamesContainer.name
  }
}

output cosmosAccountName string = cosmosAccount.name
output cosmosDatabaseName string = cosmosDatabase.name
output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint
output cosmosGamesContainerName string = cosmosGamesContainer.name
output signalRHostName string = signalR.properties.hostName
output signalRName string = signalR.name
output staticWebAppId string = staticWebApp.id
output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
