using Oglasnik.Contracts.Records.Auth.Login;
using FastEndpoints;
using Oglasnik.Contracts.Services;

namespace Oglasnik.WebAPI.Endpoints.Auth;

public class Login : Endpoint<LoginRequestRecord, LoginResponseRecord>
{
	private readonly IKeycloakService _keycloakService;
	private readonly IUserAccountService _userAccountService;
	private readonly ILogger<Login> _logger;

	public Login(IKeycloakService keycloakService, IUserAccountService userAccountService, ILogger<Login> logger)
	{
		_keycloakService = keycloakService;
		_userAccountService = userAccountService;
		_logger = logger;
	}

	public override void Configure()
	{
		Post("/api/login");
		AllowAnonymous();
	}

	public override async Task HandleAsync(LoginRequestRecord request, CancellationToken cancellationToken)
	{
		// Authenticate with Keycloak using email as username
		var tokenResponse = await _keycloakService.AuthenticateUserAsync(request.Email, request.Password);

		if (tokenResponse == null)
		{
			_logger.LogWarning("Failed login attempt for email: {Email}", request.Email);
			await Send.UnauthorizedAsync(cancellationToken);
			return;
		}

		// Get user details from Keycloak
		var keycloakUser = await _keycloakService.GetUserByEmailAsync(request.Email);

		if (keycloakUser == null)
		{
			_logger.LogError("User authenticated but not found in Keycloak: {Email}", request.Email);
			await Send.UnauthorizedAsync(cancellationToken);
			return;
		}

		_logger.LogInformation("User {Email} successfully logged in", keycloakUser.email);

		// Return user info and token
		var response = new LoginResponseRecord(
			keycloakUser.id,
			keycloakUser.email,
			keycloakUser.firstName,
			keycloakUser.lastName,
			tokenResponse.access_token,
			tokenResponse.refresh_token,
			tokenResponse.expires_in
		);

		await Send.OkAsync(response, cancellationToken);
	}
}
