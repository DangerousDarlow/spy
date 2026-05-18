namespace api;

public interface ISignalRSender
{
    Task SendToGameAsync(string gameId, string method, object payload, CancellationToken ct = default);
    Task SendToPlayerAsync(string playerId, string method, object payload, CancellationToken ct = default);
}
