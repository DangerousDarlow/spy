import { CosmosClient, PartitionKeyKind } from "@azure/cosmos";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { logInfo, logSuccess } from "./utility.ts";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EMULATOR_ENDPOINT = process.env.COSMOS_ENDPOINT ?? "http://localhost:8081";

// Well-known fixed key used by the Azure Cosmos DB emulator
const EMULATOR_KEY =
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b5UrFnENHWWBCDB8RLjkNHFqkFjrqw==";

function readLocalSettings(): { databaseName: string; containerName: string } {
  const settingsPath = join(__dirname, "../api/local.settings.json");
  const settings = JSON.parse(readFileSync(settingsPath, "utf-8"));

  return {
    databaseName: settings.Values.COSMOS_DATABASE_NAME,
    containerName: settings.Values.COSMOS_GAMES_CONTAINER_NAME,
  };
}

const client = new CosmosClient({
  endpoint: EMULATOR_ENDPOINT,
  key: EMULATOR_KEY,
  connectionPolicy: { enableEndpointDiscovery: false },
});

async function waitForService(): Promise<void> {
  logInfo(`Waiting for Cosmos DB at ${EMULATOR_ENDPOINT}`);

  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.getDatabaseAccount();
      return;
    } catch {
      if (attempt === maxAttempts) {
        throw new Error(`Cosmos DB not ready after ${maxAttempts} attempts`);
      }

      logInfo(`Waiting for Cosmos DB (attempt ${attempt}/${maxAttempts})...`);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function init(): Promise<void> {
  const { databaseName, containerName } = readLocalSettings();

  logInfo(`Creating database '${databaseName}' if it does not exist`);

  const { database } = await client.databases.createIfNotExists({
    id: databaseName,
  });

  logSuccess(`Database '${database.id}' ready`);

  logInfo(`Creating container '${containerName}' if it does not exist`);

  const { container } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: { paths: ["/id"], kind: PartitionKeyKind.Hash },
    defaultTtl: 86400,
  });

  logSuccess(`Container '${container.id}' ready`);

  logSuccess("Cosmos DB local initialisation complete");
}

async function run(): Promise<void> {
  await waitForService();
  await init();
}

run();
