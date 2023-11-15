param accountName string
param databaseName string

param principalIds array = []

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2022-08-15' existing = {
  name: accountName
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' existing = {
  name: '${accountName}/${databaseName}'
}

module roleDefinition 'cosmos-sql-role-def.bicep' = {
  name: 'cosmos-sql-role-definition'
  params: {
    accountName: accountName
  }
  dependsOn: [
    cosmos
    database
  ]
}

// We need batchSize(1) here because sql role assignments have to be done sequentially
@batchSize(1)
module userRole 'cosmos-sql-role-assign.bicep' = [for principalId in principalIds: if (!empty(principalId)) {
  name: 'cosmos-sql-user-role-${uniqueString(principalId)}'
  params: {
    accountName: accountName
    roleDefinitionId: roleDefinition.outputs.id
    principalId: principalId
  }
  dependsOn: [
    cosmos
    database
  ]
}]

output roleDefinitionId string = roleDefinition.outputs.id
