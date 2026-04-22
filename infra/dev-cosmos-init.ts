import { Agent } from "https";
import { CosmosClient, PartitionKeyKind } from "@azure/cosmos";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { logError, logInfo, logSuccess } from "./utility.ts";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EMULATOR_ENDPOINT = "https://localhost:8081";

// Well-known fixed key used by the Azure Cosmos DB emulator
const EMULATOR_KEY =
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b5UrFnENHWWBCDB8RLjkNHFqkFjrqw==";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 30;

function readLocalSettings(): { databaseName: string; containerName: string } {
  const settingsPath = join(__dirname, "../api/local.settings.json");
  const settings = JSON.parse(readFileSync(settingsPath, "utf-8"));

  return {
    databaseName: settings.Values.COSMOS_DATABASE_NAME,
    containerName: settings.Values.COSMOS_GAMES_CONTAINER_NAME,
  };
}

// The emulator uses a self-signed certificate
const client = new CosmosClient({
  endpoint: EMULATOR_ENDPOINT,
  key: EMULATOR_KEY,
  agent: new Agent({ rejectUnauthorized: false }),
});

async function waitForEmulator(): Promise<void> {
  logInfo("Waiting for Cosmos DB emulator to be ready...");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await client.getDatabaseAccount();

      logInfo("Emulator is ready");
      return;
    } catch {
      logInfo(
        `Attempt ${attempt}/${MAX_ATTEMPTS} — not ready, retrying in ${POLL_INTERVAL_MS / 1000}s`,
      );

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
  }

  logError("Emulator did not become ready in time");
  process.exit(1);
}

async function init(): Promise<void> {
  const { databaseName, containerName } = readLocalSettings();

  await waitForEmulator();

  logInfo(`Creating database '${databaseName}' if not exists`);

  const { database } = await client.databases.createIfNotExists({
    id: databaseName,
  });

  logSuccess(`Database '${database.id}' ready`);

  logInfo(`Creating container '${containerName}' if not exists`);

  const { container } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: { paths: ["/id"], kind: PartitionKeyKind.Hash },
    defaultTtl: 86400,
  });

  logSuccess(`Container '${container.id}' ready`);

  logSuccess("Cosmos DB local initialisation complete");
}

init();
