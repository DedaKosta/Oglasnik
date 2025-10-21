using FastEndpoints;
using Oglasnik.Contracts.Records.Auth.Register;
using Oglasnik.Contracts.Services;

namespace OglasnikApi.Endpoints.Auth;

public class Register : Endpoint<RegisterRequestRecord, RegisterResponseRecord>
{
	private readonly IKeycloakService _keycloakService;
	private readonly ILogger<Register> _logger;

	public Register(IKeycloakService keycloakService, ILogger<Register> logger)
	{
		_keycloakService = keycloakService;
		_logger = logger;
	}

	public override void Configure()
	{
		Post("/api/register");
		AllowAnonymous();
	}

	public override async Task HandleAsync(RegisterRequestRecord request, CancellationToken cancellationToken)
	{
		// Validate password confirmation
		if (request.Password != request.ConfirmPassword)
		{
			ThrowError("Passwords do not match");
		}

		// Check if user already exists in Keycloak
		var existingUserByEmail = await _keycloakService.GetUserByEmailAsync(request.Email);
		if (existingUserByEmail != null)
		{
			ThrowError("User with this email already exists");
		}

		var existingUserByUsername = await _keycloakService.GetUserByUsernameAsync(request.Username);
		if (existingUserByUsername != null)
		{
			ThrowError("User with this username already exists");
		}

		// Create user in Keycloak
		var result = await _keycloakService.CreateUserAsync(
			request.Username,
			request.Email,
			request.FirstName,
			request.LastName,
			request.Password
		);

		if (result?.Success != true)
		{
			_logger.LogError("Failed to create user in Keycloak: {Error}", result?.Error);
			ThrowError(result?.Error ?? "Failed to create user");
		}

		_logger.LogInformation("User {Username} successfully registered with Keycloak ID: {KeycloakId}", request.Username, result.UserId);

		// Return success response
		await Send.OkAsync(new RegisterResponseRecord(
			0, // ID is managed by Keycloak, not needed here
			request.Username,
			request.Email,
			request.FirstName,
			request.LastName
		), cancellationToken);
	}
}
