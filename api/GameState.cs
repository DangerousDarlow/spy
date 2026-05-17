using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace api;

[JsonConverter(typeof(JsonStringEnumConverter))]
[Newtonsoft.Json.JsonConverter(typeof(StringEnumConverter))]
public enum GameState
{
    PlayerRegistration,
    GameStarted,
    GameOver
}