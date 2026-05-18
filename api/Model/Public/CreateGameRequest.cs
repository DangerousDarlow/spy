using api.Model.Common;

namespace api.Model.Public;

public record CreateGameRequest(Guid Id, string Name, Player CreatedBy, string[] Products);