using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using api.Model.Common;
using api.Model.Public;

namespace api.IntegrationTests;

[TestFixture]
[Category("Integration")]
public class GameEndpointsTests : IntegrationTest
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    [Test]
    public async Task CreateThenGet_ReturnsGame()
    {
        var gameId = Guid.NewGuid();

        var createRequest = new HttpRequestMessage(HttpMethod.Post, "api/Create")
        {
            Content = JsonContent.Create(new
            {
                id = gameId,
                name = "Test Game",
                products = new[] { "Widget", "Gadget" },
                createdBy = new { id = PlayerId, name = "Alice" }
            }, options: JsonOptions)
        };

        var createResponse = await Client.SendAsync(createRequest);
        Assert.That(createResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var getRequest = new HttpRequestMessage(HttpMethod.Get, $"api/games/{gameId}");

        var getResponse = await Client.SendAsync(getRequest);
        Assert.That(getResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var game = await getResponse.Content.ReadFromJsonAsync<GamePublic>(JsonOptions);
        Assert.Multiple(() =>
        {
            Assert.That(game, Is.Not.Null);
            Assert.That(game!.Id, Is.EqualTo(gameId));
            Assert.That(game.Name, Is.EqualTo("Test Game"));
            Assert.That(game.State, Is.EqualTo(GameState.PlayerRegistration));
            Assert.That(game.CreatedBy, Is.EqualTo("Alice"));
            Assert.That(game.Players, Is.EqualTo(new[] { "Alice" }));
            Assert.That(game.Products, Is.EqualTo(new[] { "Widget", "Gadget" }));
        });
    }

    [Test]
    public async Task Get_NonExistentId_ReturnsNotFound()
    {
        var getRequest = new HttpRequestMessage(HttpMethod.Get, $"api/games/{Guid.NewGuid()}");
        var response = await Client.SendAsync(getRequest);
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
    }
}