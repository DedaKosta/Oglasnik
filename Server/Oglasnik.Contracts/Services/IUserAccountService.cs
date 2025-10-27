using Oglasnik.Contracts.Records.UserAccount;

namespace Oglasnik.Contracts.Services;

public interface IUserAccountService
{
    Task<UserAccountRecord?> GetByEmailAsync(string email);
    Task<UserAccountRecord?> GetByKeycloakUserIdAsync(string keycloakUserId);
    Task<UserAccountRecord> CreateAsync(string keycloakUserId, string email, string firstName, string lastName);
    Task<UserAccountRecord> UpdateAsync(object userAccount);
}
