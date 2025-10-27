namespace Oglasnik.Contracts.Records.Auth.Register;

public record RegisterRequestRecord(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string ConfirmPassword
);
