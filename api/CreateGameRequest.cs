namespace api;

public record CreateGameRequest(Guid Id, string Name, Player CreatedBy, string[] Products);