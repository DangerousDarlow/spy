namespace api;

public record Game(
    Guid Id,
    string Name,
    GameState State,
    DateTime CreatedAt,
    Guid CreatedBy,
    string[] Products,
    Guid[] Players
);