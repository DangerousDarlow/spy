# Local Run

To run locally

1. Run dependency containers
2. Run api
3. Run ui

## Run dependency containers

Run dependency docker containers using docker compose. The `dev-init` container automatically initialises the local environment — no manual script step required.
```sh
cd infra
docker compose up
```

## Run api

Copy `api/local.settings.json.example` to `api/local.settings.json`.

> [!IMPORTANT]
> Local SignalR development requires a **real Azure SignalR Service** connection string. Containerised local Azure SignalR emulator [`klabbet/signalr-emulator`](https://hub.docker.com/r/klabbet/signalr-emulator) is incompatible with the current SDK (see [`infra/README.md`](infra/README.md#signalr-no-local-emulator)).

Set `AZURE_SIGNALR_CONNECTION_STRING` in `api/local.settings.json` to the connection string from the `Settings > Keys` section of your SignalR Service in the Azure portal.

Run Azure functions application.
```sh
cd api
func start
```

## Troubleshooting

If there's a problem starting the application the error may well be swallowed. Run the application directly to see any swallowed errors.
```sh
dotnet /bin/output/api.dll
```

> [!TIP]
> To run the api against an actual Cosmos DB cloud service change the `COSMOS_CONNECTION_STRING` in `api/local.settings.json` to the value in the `Settings > Keys` section of your Cosmos DB account in the Azure portal.

### Troubleshooting: OpenSSL "wrong version number"

If you get an SSL/TLS error like `wrong version number` or `EPROTO`, check the endpoint protocol in `api/local.settings.json`.

For this Docker-based emulator setup, use:

`AccountEndpoint=http://localhost:8081/`

Using `https://localhost:8081/` will fail because the local emulator endpoint is exposed as HTTP in this environment.

## Run ui

Run SvelteKit application.
```sh
cd ui
pnpm dev -- --open
```

If api calls fail it might be that the api application port does not match the value in `ui/vite.config.ts`.