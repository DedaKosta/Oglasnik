namespace Oglasnik.Contracts.Records.Auth.Register;

public record RegisterRequestRecord(string Username, string Password, string FirstName, string LastName, string Email);
