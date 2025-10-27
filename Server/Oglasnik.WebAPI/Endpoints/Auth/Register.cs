using FastEndpoints;
using Oglasnik.Contracts.Records.Auth.Register;
using Oglasnik.Contracts.Services;

namespace OglasnikApi.Endpoints.Auth;

public class Register : Endpoint<RegisterRequestRecord, RegisterResponseRecord>
{
	private readonly IKeycloakService _keycloakService;
	private readonly IUserAccountService _userAccountService;
	private readonly ILogger<Register> _logger;

	public Register(IKeycloakService keycloakService, IUserAccountService userAccountService, ILogger<Register> logger)
	{
		_keycloakService = keycloakService;
		_userAccountService = userAccountService;
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

		// Create user in Keycloak
		var result = await _keycloakService.CreateUserAsync(
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

		_logger.LogInformation("User {Email} successfully registered with Keycloak ID: {KeycloakId}", request.Email, result.UserId);

		// Create user in local database
		try
		{
			var localUser = await _userAccountService.CreateAsync(
				result.UserId!,
				request.Email,
				request.FirstName,
				request.LastName
			);

			_logger.LogInformation("User {Email} successfully saved to local database with ID: {LocalId}", request.Email, localUser.Id);

			// Return success response
			await Send.OkAsync(new RegisterResponseRecord(
				localUser.Id,
				request.Email,
				request.FirstName,
				request.LastName
			), cancellationToken);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Failed to create user in local database for Keycloak user {KeycloakId}", result.UserId);
			ThrowError("User created in Keycloak but failed to save locally. Please contact support.");
		}
	}
}
