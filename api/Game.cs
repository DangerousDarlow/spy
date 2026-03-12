namespace api;

public record Game(
    Guid Guid,
    string Name,
    GameState State,
    DateTime CreatedAt,
    Guid CreatedBy,
    string[] Products,
    Guid[] Players
);