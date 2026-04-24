import { CosmosClient, PartitionKeyKind } from "@azure/cosmos";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { logInfo, logSuccess } from "./utility.ts";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EMULATOR_ENDPOINT = "http://localhost:8081";

// Well-known fixed key used by the Azure Cosmos DB emulator
const EMULATOR_KEY =
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b5UrFnENHWWBCDB8RLjkNHFqkFjrqw==";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  return String(error);
}

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
});

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

init();
