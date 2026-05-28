# api

An Azure static web application can have [managed Azure functions](https://learn.microsoft.com/en-us/azure/static-web-apps/apis-functions) deployed with it. Managed functions have some limitations a significant one being that only the consumption hosting plan is supported. This means cold starts when an API call is made after a sustained period of inactivity resulting in a delay of approximately 5 seconds before the first response is received.

## Bootstrap

Bootstrap using [instructions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#create-your-local-project). Specifically `func init api --worker-runtime dotnet-isolated`.

## Cosmos configuration

Set these values in `local.settings.json` or your environment:

- `COSMOS_CONNECTION_STRING`
- `COSMOS_DATABASE_NAME`
- `COSMOS_GAMES_CONTAINER_NAME`

## SignalR configuration

Set this value in `local.settings.json` or your environment:

- `AZURE_SIGNALR_CONNECTION_STRING`

The API uses `Microsoft.Azure.SignalR.Management` (`IServiceManager`) in serverless mode. There is no local emulator — local dev requires a real Azure SignalR Service connection string (see [`infra/README.md`](../infra/README.md#signalr-no-local-emulator)).

### Hub and groups

All real-time messaging uses the `games` hub. Players are organised into groups named `game-{gameId}`.

### Endpoints

| Function | Method | Path | Description |
|----------|--------|------|-------------|
| `SignalRNegotiate` | POST | `/api/signalr/negotiate` | Returns the SignalR endpoint URL and a JWT access token for the caller. Accepts an optional `gameId` query param — if provided, adds the player to the `game-{gameId}` group before responding. |

Negotiate response body:

```json
{ "url": "<SignalR endpoint>", "accessToken": "<JWT>" }
```

### Sending messages

`ISignalRSender` is registered as a singleton and injected into endpoints that need to push messages to clients:

| Method | Target |
|--------|--------|
| `SendToGameAsync(gameId, method, payload)` | All players in the `game-{gameId}` group |
| `SendToPlayerAsync(playerId, method, payload)` | A single player by their player ID (SignalR user ID) |

## Local Run

To run locally see the [local run instructions](/LOCALRUN.md).