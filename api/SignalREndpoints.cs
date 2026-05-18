using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Extensions.Logging;

namespace api;

[RequirePlayerIdHeader]
public class SignalREndpoints(IServiceManager serviceManager, ILoggerFactory loggerFactory)
{
    private const string HubName = "games";

    [Function("SignalRNegotiate")]
    public async Task<IActionResult> Negotiate(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "signalr/negotiate")] HttpRequest req,
        CancellationToken ct)
    {
        var playerId = req.GetPlayerId().ToString();
        var gameId = req.Query["gameId"].ToString();

        var url = serviceManager.GetClientEndpoint(HubName);
        var accessToken = serviceManager.GenerateClientAccessToken(HubName, playerId);

        if (!string.IsNullOrEmpty(gameId))
        {
            await using var hubContext = await serviceManager.CreateHubContextAsync(HubName, loggerFactory, ct);
            await hubContext.UserGroups.AddToGroupAsync(playerId, $"game-{gameId}", ct);
        }

        return new OkObjectResult(new { url, accessToken });
    }
}
