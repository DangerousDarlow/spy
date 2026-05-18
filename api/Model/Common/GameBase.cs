using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace api.Model.Common;

public record GameBase(
    // Both JsonProperty and JsonPropertyName are needed because Microsoft.Azure.Cosmos uses Newtonsoft.Json not System.Text.Json
    [property: JsonProperty("id")]
    [property: JsonPropertyName("id")]
    Guid Id,
    [property: JsonProperty("name")]
    [property: JsonPropertyName("name")]
    string Name,
    [property: JsonProperty("state")]
    [property: JsonPropertyName("state")]
    GameState State,
    [property: JsonProperty("createdAt")]
    [property: JsonPropertyName("createdAt")]
    DateTime CreatedAt,
    [property: JsonProperty("products")]
    [property: JsonPropertyName("products")]
    string[] Products
);