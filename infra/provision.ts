import { execSync } from "child_process";
import { readFileSync } from "fs";
import { logError, logInfo, logSuccess } from "./log.ts";

const environment = process.argv[2] ?? "dev";

const fileContent = readFileSync("main.parameters.json", "utf-8");
const parameters = JSON.parse(fileContent);

const name = parameters.parameters.name.value;
const location = parameters.parameters.location.value;
const baseName = `${name}-${environment}`;
const staticWebAppName = `${baseName}-swa`;
const resourceGroupName = `${baseName}-rg`;

function runCommand(command: string, failureMessage: string): string {
  try {
    return execSync(command, { encoding: "utf-8" });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    logError(failureMessage);
    logError(`Details: ${details}`);
    process.exit(1);
  }
}

function getSubscriptionId(): string {
  const output = runCommand(
    "az account show --query id -o tsv --only-show-errors",
    "Failed to get Azure subscription ID. Ensure the Azure CLI is installed and you are logged in.",
  );

  const subscriptionId = output.trim();
  if (!subscriptionId) {
    logError(
      "Azure CLI returned an empty subscription ID. Ensure you are logged in and a default subscription is selected.",
    );
    process.exit(1);
  }

  return subscriptionId;
}

const subscriptionId = getSubscriptionId();

logInfo("Provisioning static web application");
logInfo(`  Environment: ${environment}`);
logInfo(`  Base name: ${baseName}`);
logInfo(`  Static Web App name: ${staticWebAppName}`);
logInfo(`  Resource Group name: ${resourceGroupName}`);
logInfo(`  Location: ${location}`);
logInfo(`  Subscription ID: ${subscriptionId}`);

function checkIfResourceGroupExists(): boolean {
  const output = runCommand(
    `az group exists --name ${resourceGroupName} --only-show-errors`,
    "Failed to check if the resource group exists.",
  );

  return output.trim() === "true";
}

function createResourceGroup(): void {
  runCommand(
    `az group create --name ${resourceGroupName} --location ${location} --only-show-errors`,
    `Failed to create resource group "${resourceGroupName}".`,
  );
}

logInfo("Checking if resource group exists");
const resourceGroupExists = checkIfResourceGroupExists();
if (!resourceGroupExists) {
  logInfo("Resource group does not exist. Creating resource group.");
  createResourceGroup();
}

function validateResources(): void {
  runCommand(
    `az deployment group validate --resource-group ${resourceGroupName} --template-file ./main.bicep --parameters ./main.parameters.json --parameters environment=${environment} --only-show-errors`,
    "Failed to validate resources. Ensure the Bicep files are correct and all parameters are provided.",
  );
}

logInfo("Validating resources");
validateResources();

function createDeploymentName(): string {
  const now = new Date();

  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `deployment-${staticWebAppName}-${yyyy}${MM}${dd}-${HH}${mm}${ss}`;
}

function deployResources(): string {
  const output = runCommand(
    `az deployment group create --name ${deploymentName} --resource-group ${resourceGroupName} --template-file ./main.bicep --parameters ./main.parameters.json --parameters environment=${environment} --only-show-errors`,
    "Failed to deploy resources. Ensure the Bicep files are correct and all parameters are provided.",
  );

  const json = JSON.parse(output);
  return json.properties.outputs.staticWebAppUrl.value;
}

const deploymentName = createDeploymentName();

logInfo(`Deploying resources: ${deploymentName}`);
const staticWebAppUrl = deployResources();

logSuccess("Deployment completed successfully");
logSuccess(`  Static Web App URL: ${staticWebAppUrl}`);
