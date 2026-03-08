import { execSync } from "child_process";
import { readFileSync } from "fs";

const RED = "\x1b[31m";
const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

export function logInfo(message: unknown): void {
  console.log(`${BLUE}INFO: ${String(message)}${RESET}`);
}

export function logError(message: unknown): void {
  console.error(`${RED}ERROR: ${String(message)}${RESET}`);
}

export function logSuccess(message: unknown): void {
  console.log(`${GREEN}SUCCESS: ${String(message)}${RESET}`);
}

export function runCommand(command: string, failureMessage: string): string {
  try {
    return execSync(command, { encoding: "utf-8" });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    logError(failureMessage);
    logError(`Details: ${details}`);
    process.exit(1);
  }
}

export function getAzureSubscriptionId(): string {
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

export function checkIfAzureResourceGroupExists(
  resourceGroupName: string,
): boolean {
  const output = runCommand(
    `az group exists --name ${resourceGroupName} --only-show-errors`,
    "Failed to check if the resource group exists.",
  );

  return output.trim() === "true";
}

export type AzureContext = {
  environment: string;
  baseName: string;
  location: string;
  resourceGroupName: string;
  staticWebAppName: string;
  subscriptionId: string;
};

export function createAzureContext(
  environment: string,
  parametersPath = "main.parameters.json",
): AzureContext {
  const fileContent = readFileSync(parametersPath, "utf-8");
  const parameters = JSON.parse(fileContent);
  const baseName = `${parameters.parameters.name.value}-${environment}`;

  return {
    environment,
    baseName,
    location: parameters.parameters.location.value,
    staticWebAppName: `${baseName}-swa`,
    resourceGroupName: `${baseName}-rg`,
    subscriptionId: getAzureSubscriptionId(),
  };
}

export function logAzureContext(context: AzureContext): void {
  logInfo(`Environment: ${context.environment}`);
  logInfo(`Base name: ${context.baseName}`);
  logInfo(`Location: ${context.location}`);
  logInfo(`Resource Group name: ${context.resourceGroupName}`);
  logInfo(`Static Web App name: ${context.staticWebAppName}`);
  logInfo(`Subscription ID: ${context.subscriptionId}`);
}

export function createAzureResourceGroup(
  resourceGroupName: string,
  location: string,
): void {
  runCommand(
    `az group create --name ${resourceGroupName} --location ${location} --only-show-errors`,
    `Failed to create resource group "${resourceGroupName}".`,
  );
}

export function validateAzureResources(
  resourceGroupName: string,
  environment: string,
): void {
  runCommand(
    `az deployment group validate --resource-group ${resourceGroupName} --template-file ./main.bicep --parameters ./main.parameters.json --parameters environment=${environment} --only-show-errors`,
    "Failed to validate resources. Ensure the Bicep files are correct and all parameters are provided.",
  );
}

export function deployAzureResources(
  deploymentName: string,
  resourceGroupName: string,
  environment: string,
): string {
  const output = runCommand(
    `az deployment group create --name ${deploymentName} --resource-group ${resourceGroupName} --template-file ./main.bicep --parameters ./main.parameters.json --parameters environment=${environment} --only-show-errors`,
    "Failed to deploy resources. Ensure the Bicep files are correct and all parameters are provided.",
  );

  const json = JSON.parse(output);
  return json.properties.outputs.staticWebAppUrl.value;
}

export function createDeploymentName(deploymentTarget: string): string {
  const now = new Date();

  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `deployment-${deploymentTarget}-${yyyy}${MM}${dd}-${HH}${mm}${ss}`;
}

export function getStaticWebAppDeploymentToken(
  staticWebAppName: string,
  resourceGroupName: string,
): string {
  const output = runCommand(
    `az staticwebapp secrets list --name ${staticWebAppName} --resource-group ${resourceGroupName} --query properties.apiKey -o tsv --only-show-errors`,
    "Failed to get deployment token. Ensure the Static Web App exists and you have access to it.",
  );

  const deploymentToken = output.trim();
  if (!deploymentToken) {
    logError(
      "Azure CLI returned an empty deployment token. Ensure the Static Web App exists and you have access to it.",
    );
    process.exit(1);
  }

  return deploymentToken;
}

export function deployAzureStaticWebAppAndFunctions(
  uiBuildPath: string,
  apiBuildPath: string,
  deploymentToken: string,
): void {
  const command = `pnpm exec swa deploy ${uiBuildPath} --api-location ${apiBuildPath} --api-language dotnetisolated --api-version 9.0 --deployment-token ${deploymentToken} --env production`;
  runCommand(command, "Failed to deploy static web app and functions.");
}
