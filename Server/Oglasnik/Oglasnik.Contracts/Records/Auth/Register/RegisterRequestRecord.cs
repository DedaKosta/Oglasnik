namespace Oglasnik.Contracts.Records.Auth.Register;

public record RegisterRequestRecord(
    string Username,
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string ConfirmPassword
);
