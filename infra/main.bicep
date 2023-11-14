targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

param resourceGroupName string = ''
param containerAppsEnvironmentName string = ''
param containerRegistryName string = ''
param webAppName string = 'client'
param serverApiName string = 'server'
param serverApiImageName string = ''

param logAnalyticsName string = ''
param applicationInsightsName string = ''

param openAiServiceName string = ''
param openAiResourceGroupName string = ''
@description('Location for the OpenAI resource group')
@allowed(['australiaeast', 'canadaeast', 'eastus', 'eastus2', 'francecentral', 'japaneast', 'northcentralus', 'swedencentral', 'switzerlandnorth', 'uksouth', 'westeurope'])
@metadata({
  azd: {
    type: 'location'
  }
})
param openAiResourceGroupLocation string
param openAiSkuName string = 'S0'

@description('Location for the Static Web App')
@allowed(['westus2', 'centralus', 'eastus2', 'westeurope', 'eastasia', 'eastasiastage'])
@metadata({
  azd: {
    type: 'location'
  }
})
param webAppLocation string

param chatGptDeploymentName string // Set in main.parameters.json
param chatGptDeploymentCapacity int = 30
param chatGptModelName string // Set in main.parameters.json
param chatGptModelVersion string // Set in main.parameters.json

@description('Id of the user or app to assign application roles')
param principalId string = ''

@description('Use Application Insights for monitoring and performance tracing')
param useApplicationInsights bool = false

param cosmosAccountName string = ''
param cosmosDatabaseName string = ''

param allowedOrigin string

// Differentiates between automated and manual deployments
param isContinuousDeployment bool = false

var abbrs = loadJsonContent('abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }
var allowedOrigins = empty(allowedOrigin) ? [webApp.outputs.uri] : [webApp.outputs.uri, allowedOrigin]

// Organize resources in a resource group
resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: tags
}

resource openAiResourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' existing = if (!empty(openAiResourceGroupName)) {
  name: !empty(openAiResourceGroupName) ? openAiResourceGroupName : resourceGroup.name
}

// Monitor application with Azure Monitor
module monitoring './core/monitor/monitoring.bicep' = {
  name: 'monitoring'
  scope: resourceGroup
  params: {
    location: location
    tags: tags
    logAnalyticsName: !empty(logAnalyticsName) ? logAnalyticsName : '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    applicationInsightsName: useApplicationInsights ? (!empty(applicationInsightsName) ? applicationInsightsName : '${abbrs.insightsComponents}${resourceToken}') : ''
  }
}

// Container apps host (including container registry)
module containerApps './core/host/container-apps.bicep' = {
  name: 'container-apps'
  scope: resourceGroup
  params: {
    name: 'containerapps'
    containerAppsEnvironmentName: !empty(containerAppsEnvironmentName) ? containerAppsEnvironmentName : '${abbrs.appManagedEnvironments}${resourceToken}'
    containerRegistryName: !empty(containerRegistryName) ? containerRegistryName : '${abbrs.containerRegistryRegistries}${resourceToken}'
    location: location
    tags: tags
    logAnalyticsWorkspaceName: monitoring.outputs.logAnalyticsWorkspaceName
  }
}

// The application frontend
module webApp './core/host/staticwebapp.bicep' = {
  name: 'client'
  scope: resourceGroup
  params: {
    name: !empty(webAppName) ? webAppName : '${abbrs.webStaticSites}client-${resourceToken}'
    location: webAppLocation
    tags: union(tags, { 'azd-service-name': webAppName })
  }
}

// The server API
module serverApi './core/host/container-app.bicep' = {
  name: 'server'
  scope: resourceGroup
  params: {
    name: !empty(serverApiName) ? serverApiName : '${abbrs.appContainerApps}server-${resourceToken}'
    location: location
    tags: union(tags, { 'azd-service-name': serverApiName })
    containerAppsEnvironmentName: containerApps.outputs.environmentName
    containerRegistryName: containerApps.outputs.registryName
    managedIdentity: true
    allowedOrigins: allowedOrigins
    containerCpuCoreCount: '1.0'
    containerMemory: '2.0Gi'
    secrets: useApplicationInsights ? [
      {
        name: 'appinsights-cs'
        value: monitoring.outputs.applicationInsightsConnectionString
      }
    ] : []
    env: concat([
      {
        name: 'AZURE_OPENAI_CHATGPT_DEPLOYMENT'
        value: chatGptDeploymentName
      }
      {
        name: 'AZURE_OPENAI_CHATGPT_MODEL'
        value: chatGptModelName
      }
      {
        name: 'AZURE_OPENAI_SERVICE'
        value: openAi.outputs.name
      }
    ], useApplicationInsights ? [{
      name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
      secretRef: 'appinsights-cs'
    }] : [])
    imageName: !empty(serverApiImageName) ? serverApiImageName : 'nginx:latest'
    targetPort: 3000
  }
}

module openAi 'core/ai/cognitiveservices.bicep' = {
  name: 'openai'
  scope: openAiResourceGroup
  params: {
    name: !empty(openAiServiceName) ? openAiServiceName : '${abbrs.cognitiveServicesAccounts}${resourceToken}'
    location: openAiResourceGroupLocation
    tags: tags
    sku: {
      name: openAiSkuName
    }
    deployments: [
      {
        name: chatGptDeploymentName
        model: {
          format: 'OpenAI'
          name: chatGptModelName
          version: chatGptModelVersion
        }
        sku: {
          name: 'Standard'
          capacity: chatGptDeploymentCapacity
        }
      }
    ]
  }
}

param containers array = [
  {
    name: 'tasks'
    id: 'tasks'
    partitionKey: '/_partitionKey'
  }
]

// Because databaseName is optional in main.bicep, we make sure the database name is set here.
var defaultDatabaseName = 'todo'
var actualDatabaseName = !empty(cosmosDatabaseName) ? cosmosDatabaseName : defaultDatabaseName

module cosmos './core/database/cosmos-sql-db.bicep' = {
  scope: resourceGroup
  name: 'cosmos-sql'
  params: {
    accountName: !empty(cosmosAccountName) ? cosmosAccountName : '${abbrs.documentDBDatabaseAccounts}todo-${resourceToken}'
    location: location
    tags: tags
    containers: containers
    databaseName: actualDatabaseName
    principalIds: [principalId, serverApi.outputs.identityPrincipalId]
  }
}

// USER ROLES
module openAiRoleUser 'core/security/role.bicep' = if (!isContinuousDeployment) {
  scope: openAiResourceGroup
  name: 'openai-role-user'
  params: {
    principalId: principalId
    // Cognitive Services OpenAI User
    roleDefinitionId: '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd'
    principalType: 'User'
  }
}

// SYSTEM IDENTITIES
module openAiRoleServerApi 'core/security/role.bicep' = {
  scope: openAiResourceGroup
  name: 'openai-role-serverapi'
  params: {
    principalId: serverApi.outputs.identityPrincipalId
    // Cognitive Services OpenAI User
    roleDefinitionId: '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd'
    principalType: 'ServicePrincipal'
  }
}

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = resourceGroup.name

output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerApps.outputs.registryLoginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerApps.outputs.registryName

output AZURE_OPENAI_SERVICE string = openAi.outputs.name
output AZURE_OPENAI_RESOURCE_GROUP string = openAiResourceGroup.name
output AZURE_OPENAI_CHATGPT_DEPLOYMENT string = chatGptDeploymentName
output AZURE_OPENAI_CHATGPT_MODEL string = chatGptModelName
output AZURE_OPENAI_ENDPOINT string = '${openAi.outputs.endpoint}openai/deployments/chat/${chatGptDeploymentName}/completions?api-version=2023-05-15'

output AZURE_COSMOS_ACCOUNT_NAME string = cosmos.outputs.accountName
output AZURE_COSMOS_DB_NAME string = cosmos.outputs.databaseName
output AZURE_COSMOS_DB_ENDPOINT string = cosmos.outputs.endpoint

output CLIENT_URI string = webApp.outputs.uri
output SERVER_API_URI string = serverApi.outputs.uri

output ALLOWED_ORIGINS string = join(allowedOrigins, ',')
