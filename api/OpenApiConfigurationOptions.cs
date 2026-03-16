using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Configurations;
using Microsoft.OpenApi.Models;

namespace api;

public class OpenApiConfigurationOptions : DefaultOpenApiConfigurationOptions
{
    public override List<OpenApiServer> Servers { get; set; } =
    [
        new()
        {
            Url = "/api"
        }
    ];

    public override bool IncludeRequestingHostName { get; set; } = false;
}