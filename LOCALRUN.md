# Local Run

To run locally

1. Run dependency containers
2. Initialise local Cosmos DB
3. Run api
4. Run ui

## Run dependency containers

Run dependency docker containers using docker compose.
```sh
cd infra
docker compose up
```

## Initialise local Cosmos DB

Run node script to create database and container.
```sh
cd infra
node dev-cosmos-init.ts
```

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