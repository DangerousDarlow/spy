# API

## Bootstrap

Bootstrap using [instructions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#create-your-local-project).

Specifically `func init api --worker-runtime dotnet-isolated`.

## Cosmos configuration

Set these values in `local.settings.json` or your environment:

- `COSMOS_CONNECTION_STRING`
- `COSMOS_DATABASE_NAME`
- `COSMOS_GAMES_CONTAINER_NAME`
