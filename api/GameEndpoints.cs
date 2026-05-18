using System.Net;
using System.Text.Json;
using api.Model.Common;
using api.Model.Internal;
using api.Model.Public;
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
        var createGameRequest = JsonSerializer.Deserialize<CreateGameRequest>(requestBodyString, _jsonSerializerOptions);
        if (createGameRequest is null)
        {
            return new BadRequestObjectResult(new ProblemDetails
            {
                Status = (int)HttpStatusCode.BadRequest,
                Title = "Invalid request body.",
                Detail = "The request body could not be deserialized as a create game request."
            });
        }

        var playerId = request.GetPlayerId();
        if (createGameRequest.CreatedBy.Id != playerId)
        {
            return new BadRequestObjectResult(new ProblemDetails
            {
                Status = (int)HttpStatusCode.BadRequest,
                Title = "Player id mismatch.",
                Detail = "The player id in the request body must match the player id from the request header."
            });
        }

        var game = new GameInternal(
            createGameRequest.Id,
            createGameRequest.Name,
            GameState.PlayerRegistration,
            DateTime.UtcNow,
            createGameRequest.CreatedBy,
            createGameRequest.Products,
            [createGameRequest.CreatedBy]
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
                Detail = $"A game with id '{createGameRequest.Id}' already exists."
            });
        }
    }

    [Function("Get")]
    [OpenApiOperation("Get")]
    [OpenApiParameter(
        PlayerIdHttpRequestExtensions.PlayerIdHeaderName,
        In = ParameterLocation.Header, Required = true,
        Type = typeof(string),
        Description = "Player UUID"
    )]
    [OpenApiParameter("id", In = ParameterLocation.Path, Required = true, Type = typeof(Guid), Description = "Game id")]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "application/json", typeof(GamePublic))]
    [OpenApiResponseWithBody(HttpStatusCode.NotFound, "application/json", typeof(ProblemDetails))]
    public async Task<IActionResult> Get([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "games/{id:guid}")] HttpRequest request, Guid id)
    {
        try
        {
            var response = await gamesContainer.ReadItemAsync<GameInternal>(id.ToString(), new PartitionKey(id.ToString()));
            var game = response.Resource;
            var gamePublic = new GamePublic(
                game.Id,
                game.Name,
                game.State,
                game.CreatedAt,
                game.CreatedBy.Name,
                game.Products,
                game.Players.Select(p => p.Name).ToArray()
            );
            return new OkObjectResult(gamePublic);
        }
        catch (CosmosException e) when (e.StatusCode == HttpStatusCode.NotFound)
        {
            return new NotFoundObjectResult(new ProblemDetails
            {
                Status = (int)HttpStatusCode.NotFound,
                Title = "Game not found.",
                Detail = $"A game with id '{id}' was not found."
            });
        }
    }
}