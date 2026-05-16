import { logInfo, logSuccess } from "./utility.ts";
import { Toxiproxy, type Latency } from "toxiproxy-node-client";

const TOXIPROXY_URL = process.env.TOXIPROXY_URL ?? "http://localhost:8474";

const client = new Toxiproxy(TOXIPROXY_URL);

async function waitForService(): Promise<void> {
  logInfo(`Waiting for Toxiproxy at ${TOXIPROXY_URL}`);

  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.getVersion();
      return;
    } catch {
      if (attempt === maxAttempts) {
        throw new Error(`Toxiproxy not ready after ${maxAttempts} attempts`);
      }

      logInfo(`Waiting for Toxiproxy (attempt ${attempt}/${maxAttempts})...`);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function init(): Promise<void> {
  let proxy;
  try {
    proxy = await client.get("api");
    logInfo("Proxy 'api' already exists");
  } catch {
    logInfo("Creating proxy 'api'");
    proxy = await client.createProxy({
      name: "api",
      listen: "[::]:7246",
      upstream: "host.docker.internal:7245",
      enabled: true,
    });
  }

  try {
    await proxy.getToxic("latency");
    logInfo("Toxic 'latency' already exists");
  } catch {
    logInfo("Adding latency toxic");
    await proxy.addToxic<Latency>({
      name: "latency",
      type: "latency",
      stream: "downstream",
      toxicity: 1,
      attributes: { latency: 5000, jitter: 500 },
    });
  }

  logSuccess("Toxiproxy initialisation complete");
}

async function run(): Promise<void> {
  await waitForService();
  await init();
}

run();
