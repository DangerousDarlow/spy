namespace api;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class RequirePlayerIdHeaderAttribute : Attribute;