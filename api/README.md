# api

An Azure static web application can have [managed Azure functions](https://learn.microsoft.com/en-us/azure/static-web-apps/apis-functions) deployed with it. Managed functions have some limitations a significant one being that only the consumption hosting plan is supported. This means cold starts when an API call is made after a sustained period of inactivity resulting in a delay of approximately 5 seconds before the first response is received.

## Bootstrap

Bootstrap using [instructions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#create-your-local-project). Specifically `func init api --worker-runtime dotnet-isolated`.

## Cosmos configuration

Set these values in `local.settings.json` or your environment:

- `COSMOS_CONNECTION_STRING`
- `COSMOS_DATABASE_NAME`
- `COSMOS_GAMES_CONTAINER_NAME`

## Local Run

To run locally see the [local run instructions](/LOCALRUN.md).