import {
  createAzureContext,
  logAzureContext,
  logInfo,
  logSuccess,
} from "./utility.ts";

const environment = process.argv[2] ?? "dev";
const context = createAzureContext(environment);

logInfo("Deploying static web application");
logAzureContext(context);

logSuccess("Deployment completed successfully");
