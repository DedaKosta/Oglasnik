using Oglasnik.Contracts.Services;
using System.Security.Claims;

namespace OglasnikApi.Middleware;

public class UserClaimsEnrichmentMiddleware
{
	private readonly RequestDelegate _next;
	private readonly ILogger<UserClaimsEnrichmentMiddleware> _logger;

	public UserClaimsEnrichmentMiddleware(RequestDelegate next, ILogger<UserClaimsEnrichmentMiddleware> logger)
	{
		_next = next;
		_logger = logger;
	}

	public async Task InvokeAsync(HttpContext context, IUserAccountService userAccountService)
	{
		if (context.User.Identity?.IsAuthenticated == true)
		{
			var keycloakUserId = context.User.FindFirst("sub")?.Value;

			if (!string.IsNullOrEmpty(keycloakUserId))
			{
				var localUser = await userAccountService.GetByKeycloakUserIdAsync(keycloakUserId);

				if (localUser != null)
				{
					var claims = new List<Claim>
					{
						new Claim("local_user_id", localUser.Id.ToString()),
						new Claim(ClaimTypes.Role, localUser.RoleName)
					};

					var identity = context.User.Identity as ClaimsIdentity;
					identity?.AddClaims(claims);

					_logger.LogInformation("User claims enriched for user: {Email}, LocalId: {LocalId}, Role: {Role}",
						localUser.Email, localUser.Id, localUser.RoleName);
				}
				else
				{
					_logger.LogWarning("Authenticated user {KeycloakUserId} not found in local database", keycloakUserId);
				}
			}
		}

		await _next(context);
	}
}
