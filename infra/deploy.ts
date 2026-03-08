import {
  createAzureContext,
  deployAzureStaticWebAppAndFunctions,
  getStaticWebAppDeploymentToken,
  logAzureContext,
  logInfo,
  logSuccess,
  runCommand,
} from "./utility.ts";

const environment = process.argv[2] ?? "dev";
const context = createAzureContext(environment);

logInfo("Deploying static web application");
logAzureContext(context);

logInfo("Building UI");

// The default build output directory is `build`. This can be changed by specifying adapter options in `svelte.config.js`.
const uiBuildPath = "../ui/build";

runCommand(`rm -rf ${uiBuildPath}`, "Failed to clean UI build directory.");

runCommand("pnpm --dir ../ui build", "Failed to build UI");

logInfo("Building API");

const apiBuildPath = "../api/publish";

runCommand(`rm -rf ${apiBuildPath}`, "Failed to clean API build directory.");

runCommand(
  `dotnet publish ../api/api.csproj -c Release -o ${apiBuildPath}`,
  "Failed to build API",
);

logInfo("Getting deployment token");

const deploymentToken = getStaticWebAppDeploymentToken(
  context.staticWebAppName,
  context.resourceGroupName,
);

logInfo("Deploying static web app and functions");

deployAzureStaticWebAppAndFunctions(uiBuildPath, apiBuildPath, deploymentToken);

logSuccess("Deployment completed successfully");
