using System.Text.Json.Serialization;
using api.Model.Common;
using Newtonsoft.Json;

namespace api.Model.Internal;

public record GameInternal(
    Guid Id,
    string Name,
    GameState State,
    DateTime CreatedAt,
    [property: JsonProperty("createdBy")]
    [property: JsonPropertyName("createdBy")]
    Player CreatedBy,
    string[] Products,
    [property: JsonProperty("players")]
    [property: JsonPropertyName("players")]
    Player[] Players
) : GameBase(Id, Name, State, CreatedAt, Products);