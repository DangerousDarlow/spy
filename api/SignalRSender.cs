using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Extensions.Logging;

namespace api;

public class SignalRSender(IServiceManager serviceManager, ILoggerFactory loggerFactory) : ISignalRSender
{
    private const string HubName = "games";

    public async Task SendToGameAsync(string gameId, string method, object payload, CancellationToken ct = default)
    {
        await using var context = await serviceManager.CreateHubContextAsync(HubName, loggerFactory, ct);
        await context.Clients.Group($"game-{gameId}").SendAsync(method, payload, ct);
    }

    public async Task SendToPlayerAsync(string playerId, string method, object payload, CancellationToken ct = default)
    {
        await using var context = await serviceManager.CreateHubContextAsync(HubName, loggerFactory, ct);
        await context.Clients.User(playerId).SendAsync(method, payload, ct);
    }
}
