using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Oglasnik.Contracts.Enums;
using Oglasnik.Contracts.Records.UserAccount;
using Oglasnik.Contracts.Services;
using Oglasnik.Data;
using Oglasnik.Data.Entities;

namespace Oglasnik.Business.Services;

public class UserAccountService : IUserAccountService
{
    private readonly DatabaseContext _context;
    private readonly ILogger<UserAccountService> _logger;

    public UserAccountService(DatabaseContext context, ILogger<UserAccountService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<UserAccountRecord?> GetByEmailAsync(string email)
    {
        var user = await _context.UserAccounts
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == email);

        return user != null ? MapToRecord(user) : null;
    }

    public async Task<UserAccountRecord?> GetByKeycloakUserIdAsync(string keycloakUserId)
    {
        var user = await _context.UserAccounts
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.KeycloakUserId == keycloakUserId);

        return user != null ? MapToRecord(user) : null;
    }

    public async Task<UserAccountRecord> CreateAsync(string keycloakUserId, string email, string firstName, string lastName)
    {
        // Get the default RegisteredUser role
        var registeredUserRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == AccountTypes.RegisteredUser);

        if (registeredUserRole == null)
        {
            throw new InvalidOperationException("RegisteredUser role not found in database");
        }

        var userAccount = new UserAccount
        {
            KeycloakUserId = keycloakUserId,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            RoleId = registeredUserRole.Id,
            CreatedOnUtc = DateTime.UtcNow
        };

        _context.UserAccounts.Add(userAccount);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created local user account for Keycloak user {KeycloakUserId}, Email: {Email}", keycloakUserId, email);

        // Reload with role
        var result = await GetByKeycloakUserIdAsync(keycloakUserId);
        return result!;
    }

    public async Task<UserAccountRecord> UpdateAsync(object userAccountObj)
    {
        // This is a workaround for the interface - in practice we get UserAccount from our own methods
        if (userAccountObj is not UserAccount userAccount)
        {
            throw new ArgumentException("Invalid user account object", nameof(userAccountObj));
        }

        userAccount.LastUpdatedOnUtc = DateTime.UtcNow;
        _context.UserAccounts.Update(userAccount);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Updated local user account for Keycloak user {KeycloakUserId}", userAccount.KeycloakUserId);

        return MapToRecord(userAccount);
    }

    private static UserAccountRecord MapToRecord(UserAccount user)
    {
        return new UserAccountRecord(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.KeycloakUserId,
            user.RoleId,
            user.Role.Name.ToString(),
            user.CreatedOnUtc,
            user.LastUpdatedOnUtc
        );
    }
}
