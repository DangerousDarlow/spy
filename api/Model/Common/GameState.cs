using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace api.Model.Common;

[JsonConverter(typeof(JsonStringEnumConverter))]
[Newtonsoft.Json.JsonConverter(typeof(StringEnumConverter))]
public enum GameState
{
    PlayerRegistration,
    GameStarted,
    GameOver
}