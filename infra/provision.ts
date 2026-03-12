import {
  checkIfAzureResourceGroupExists,
  createAzureContext,
  createDeploymentName,
  createAzureResourceGroup,
  deployAzureResources,
  logInfo,
  logAzureContext,
  logSuccess,
  validateAzureResources,
} from "./utility.ts";

const environment = process.argv[2] ?? "dev";
const context = createAzureContext(environment);
const { baseName, resourceGroupName, location } = context;

logInfo("Provisioning static web application");
logAzureContext(context);

logInfo("Checking if resource group exists");
const resourceGroupExists = checkIfAzureResourceGroupExists(resourceGroupName);
if (!resourceGroupExists) {
  logInfo("Resource group does not exist. Creating resource group.");
  createAzureResourceGroup(resourceGroupName, location);
}

logInfo("Validating resources");
validateAzureResources(resourceGroupName, environment);

const deploymentName = createDeploymentName(baseName);

logInfo(`Deploying resources: ${deploymentName}`);
const staticWebAppUrl = deployAzureResources(
  deploymentName,
  resourceGroupName,
  environment,
);

logSuccess("Provisioning completed successfully");
logSuccess(`  Static Web App URL: ${staticWebAppUrl}`);
