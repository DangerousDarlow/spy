# infra

Provisions and deploys Azure resources for Spy.

## Resources

Azure resources are defined in `main.bicep` and provisioned via the Azure CLI. Resources created:

- **Static Web App** — hosts the UI and managed Azure Functions (free tier)
- **Cosmos DB account** — NoSQL database for game persistence (free tier)
- **Cosmos DB database and container** — database named `{name}-{environment}-db` with a `games` container

Resources are tagged with environment and project, and follow the naming convention `{name}-{environment}-{suffix}` (e.g. `spy-dev-swa`, `spy-dev-cosmos`).

## Scripts

Scripts accept an optional environment argument (defaults to `dev`).

### `provision.ts`

Provisions Azure resources.

1. Check if the resource group exists — create it if not
2. Validate Bicep files
3. Deploy resources via ARM

```bash
node provision.ts [environment]
```

### `deploy.ts`

Builds and deploys the application. The UI and API are coupled and must be deployed together via the Azure Static Web Apps CLI.

1. Build the UI (`pnpm build`)
2. Build the API (`dotnet publish`)
3. Retrieve the SWA deployment token
4. Deploy using the SWA CLI

```bash
node deploy.ts [environment]
```

## Local dev

`docker-compose.yml` runs the following services:

- **Azurite** — Azure Storage emulator (blob, queue, table)
- **Cosmos DB** — Azure Cosmos DB emulator (`vnext-preview` image on port 8081)
- **Toxiproxy** — network fault injection proxy
- **dev-init** — one-shot Node.js container that initialises Cosmos DB and Toxiproxy once the emulators are up

The Cosmos container has persistence disabled (`AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE=false`), so all data is lost when the container stops.

`dev-init` creates the Cosmos database and `games` container (reading names from `../api/local.settings.json`) and sets up the Toxiproxy proxy and latency toxic. The scripts can also be run directly against local services:

```bash
node cosmos-init-dev.ts
node toxiproxy-init-dev.ts
```

### Toxiproxy

`docker-compose.yml` also runs [Toxiproxy](https://github.com/Shopify/toxiproxy) to simulate network conditions. The management API is on port `8474` and port `7246` proxies to the API at `localhost:7245`.

The `dev-init` service configures the proxy and a 5 second latency toxic automatically on startup. Point the UI at `http://localhost:7246` instead of `http://localhost:7245` to route traffic through the proxy.

List proxies

```zsh
curl http://localhost:8474/proxies
```

Remove the latency toxic:

```zsh
curl -X DELETE http://localhost:8474/proxies/api/toxics/latency
```

Re-add it:

```zsh
curl -X POST http://localhost:8474/proxies/api/toxics \
  -H 'Content-Type: application/json' \
  -d '{"name":"latency","type":"latency","stream":"downstream","toxicity":1,"attributes":{"latency":5000,"jitter":500}}'
```
