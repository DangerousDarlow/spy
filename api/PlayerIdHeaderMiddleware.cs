using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;

namespace api;

// ReSharper disable once ClassNeverInstantiated.Global
public sealed class PlayerIdHeaderMiddleware : IFunctionsWorkerMiddleware
{
    private static readonly ConcurrentDictionary<string, bool> RequiresPlayerIdCache = new();

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        if (!RequiresPlayerId(context))
        {
            await next(context);
            return;
        }

        var httpContext = context.GetHttpContext();
        if (httpContext is null)
        {
            await next(context);
            return;
        }

        if (!httpContext.Request.Headers.TryGetValue(PlayerIdHttpRequestExtensions.PlayerIdHeaderName,
                out var headerValues))
        {
            context.GetInvocationResult().Value =
                BuildBadRequest($"Missing required header '{PlayerIdHttpRequestExtensions.PlayerIdHeaderName}'.");

            return;
        }

        if (!Guid.TryParse(headerValues.ToString(), out var playerId))
        {
            context.GetInvocationResult().Value =
                BuildBadRequest($"Header '{PlayerIdHttpRequestExtensions.PlayerIdHeaderName}' must be a valid UUID.");

            return;
        }

        httpContext.Items[PlayerIdHttpRequestExtensions.PlayerIdItemKey] = playerId;
        await next(context);
    }

    private static bool RequiresPlayerId(FunctionContext context)
    {
        var entryPoint = context.FunctionDefinition.EntryPoint;
        if (string.IsNullOrWhiteSpace(entryPoint)) return false;

        return RequiresPlayerIdCache.GetOrAdd(entryPoint, ResolveRequirementFromEntryPoint);
    }

    private static bool ResolveRequirementFromEntryPoint(string entryPoint)
    {
        var lastDotIndex = entryPoint.LastIndexOf('.');
        if (lastDotIndex <= 0 || lastDotIndex == entryPoint.Length - 1) return false;

        var typeName = entryPoint[..lastDotIndex];
        var methodName = entryPoint[(lastDotIndex + 1)..];
        var endpointType = Assembly.GetExecutingAssembly().GetType(typeName);
        if (endpointType is null) return false;

        if (endpointType.IsDefined(typeof(RequirePlayerIdHeaderAttribute), true)) return true;

        var method = endpointType.GetMethod(
            methodName,
            BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic);

        return method?.IsDefined(typeof(RequirePlayerIdHeaderAttribute), true) == true;
    }

    private static BadRequestObjectResult BuildBadRequest(string message)
    {
        return new BadRequestObjectResult(new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = message
        });
    }
}