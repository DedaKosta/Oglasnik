using Oglasnik.Contracts.Records.UserAccount;

namespace Oglasnik.Contracts.Services;

public interface ICurrentUserService
{
    long? GetUserId();
    string? GetKeycloakUserId();
    string? GetEmail();
    Task<UserAccountRecord?> GetCurrentUserAsync();
}
