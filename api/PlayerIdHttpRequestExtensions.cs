using Microsoft.AspNetCore.Http;

namespace api;

public static class PlayerIdHttpRequestExtensions
{
    public const string PlayerIdHeaderName = "Player-Id";
    internal const string PlayerIdItemKey = "__player_id";

    public static Guid GetPlayerId(this HttpRequest request)
    {
        if (request.HttpContext.Items.TryGetValue(PlayerIdItemKey, out var value) && value is Guid playerId)
            return playerId;

        throw new InvalidOperationException(
            $"'{PlayerIdHeaderName}' is not available on this request. Ensure [RequirePlayerIdHeader] is applied.");
    }
}