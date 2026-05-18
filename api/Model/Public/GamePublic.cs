using System.Text.Json.Serialization;
using api.Model.Common;
using Newtonsoft.Json;

namespace api.Model.Public;

public record GamePublic(
    Guid Id,
    string Name,
    GameState State,
    DateTime CreatedAt,
    [property: JsonProperty("createdBy")]
    [property: JsonPropertyName("createdBy")]
    string CreatedBy,
    string[] Products,
    [property: JsonProperty("players")]
    [property: JsonPropertyName("players")]
    string[] Players
) : GameBase(Id, Name, State, CreatedAt, Products);