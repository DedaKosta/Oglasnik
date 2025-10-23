namespace Oglasnik.Contracts.Records.UserAccount;

public record UserAccountRecord(
    long Id,
    string FirstName,
    string LastName,
    string Email,
    string KeycloakUserId,
    long RoleId,
    string RoleName,
    DateTime CreatedOnUtc,
    DateTime? LastUpdatedOnUtc
);
