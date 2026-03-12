using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace api;

[RequirePlayerIdHeader]
public class GameEndpoints(ILogger<GameEndpoints> logger)
{
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
    public IActionResult Create([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest request)
    {
        var playerId = request.GetPlayerId();
        logger.LogInformation("Create game requested by player {PlayerId}", playerId);
        return new OkResult();
    }

    public record CreateGameRequest(string Name, string[] Products);
}