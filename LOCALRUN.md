# Local Run

To run locally

1. Run dependency containers
2. Run api
3. Run ui

## Run dependency containers

Run dependency docker containers using docker compose. The `dev-init` container automatically initialises the Cosmos DB database and container on startup — no manual script step required.
```sh
cd infra
docker compose up
```

### Troubleshooting: OpenSSL "wrong version number"

If you get an SSL/TLS error like `wrong version number` or `EPROTO`, check the endpoint protocol in `api/local.settings.json`.

For this Docker-based emulator setup, use:

`AccountEndpoint=http://localhost:8081/`

Using `https://localhost:8081/` will fail because the local emulator endpoint is exposed as HTTP in this environment.

## SignalR

There is no local emulator for Azure SignalR Service. Connect to the provisioned Azure SignalR instance instead. Set the `AzureSignalRConnectionString` in `api/local.settings.json` to the connection string from the `Settings > Keys` section of your SignalR Service in the Azure portal.

## Run api

Run Azure functions application.
```sh
cd api
func start
```

If there's a problem starting the application the error may well be swallowed. Run the application directly to see any swallowed errors.
```sh
dotnet /bin/output/api.dll
```

To run the api against an actual Cosmos DB cloud service change the `COSMOS_CONNECTION_STRING` in `api/local.settings.json` to the value in the `Settings > Keys` section of your Cosmos DB account in the Azure portal.

## Run ui

Run SvelteKit application.
```sh
cd ui
pnpm dev -- --open
```

If api calls fail it might be that the api application port does not match the value in `ui/vite.config.ts`.