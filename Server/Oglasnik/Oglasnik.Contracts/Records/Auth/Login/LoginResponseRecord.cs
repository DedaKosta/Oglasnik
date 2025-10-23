namespace Oglasnik.Contracts.Records.Auth.Login;

public record LoginResponseRecord(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    string AccessToken,
    string RefreshToken,
    int ExpiresIn
);
