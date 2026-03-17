using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;

namespace api;

[RequirePlayerIdHeader]
public class GameEndpoints(
    IOptions<JsonSerializerOptions> jsonSerializerOptions,
    Container gamesContainer,
    ILogger<GameEndpoints> logger)
{
    private readonly JsonSerializerOptions _jsonSerializerOptions = jsonSerializerOptions.Value;

    [Function("Create")]
    [OpenApiOperation("Create")]
    [OpenApiParameter(
        PlayerIdHttpRequestExtensions.PlayerIdHeaderName,
        In = ParameterLocation.Header, Required = true,
        Type = typeof(string),
        Description = "Player UUID"
    )]
    [OpenApiRequestBody("application/json", typeof(CreateGameRequest), Required = true)]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseWithBody(HttpStatusCode.BadRequest, "application/json", typeof(ProblemDetails))]
    [OpenApiResponseWithBody(HttpStatusCode.Conflict, "application/json", typeof(ProblemDetails))]
    public async Task<IActionResult> Create([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest request)
    {
        var requestBodyString = await new StreamReader(request.Body).ReadToEndAsync();
        var requestBody = JsonSerializer.Deserialize<CreateGameRequest>(requestBodyString, _jsonSerializerOptions);
        if (requestBody is null) return new BadRequestResult();

        var playerId = request.GetPlayerId();
        var game = new Game(
            requestBody.Id,
            requestBody.Name,
            GameState.PlayerRegistration,
            DateTime.UtcNow,
            playerId,
            requestBody.Products,
            [playerId]
        );

        try
        {
            await gamesContainer.CreateItemAsync(game);

            var gameString = JsonSerializer.Serialize(game, _jsonSerializerOptions);
            logger.LogInformation("Create {Game}", gameString);
            return new OkResult();
        }
        catch (CosmosException e) when (e.StatusCode == HttpStatusCode.Conflict)
        {
            return new ConflictObjectResult(new ProblemDetails
            {
                Status = (int)HttpStatusCode.Conflict,
                Title = "Game already exists.",
                Detail = $"A game with id '{requestBody.Id}' already exists."
            });
        }
    }

    public record CreateGameRequest(Guid Id, string Name, string[] Products);
}