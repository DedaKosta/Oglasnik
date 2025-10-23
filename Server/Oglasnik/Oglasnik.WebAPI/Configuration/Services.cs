using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Oglasnik.Contracts.Helpers;
using Oglasnik.Contracts.Enums;
using Oglasnik.Contracts.Configuration;

namespace OglasnikApi.Configuration;

public static class Services
{
	public static IServiceCollection AddKeycloakAuthentication(this IServiceCollection services, IConfiguration configuration)
	{
		var keycloakSettings = configuration.GetSection("Keycloak").Get<KeycloakSettings>();

		services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
			.AddJwtBearer(opt =>
			{
				opt.Authority = keycloakSettings?.Authority;
				opt.RequireHttpsMetadata = keycloakSettings?.RequireHttpsMetadata ?? true;
				opt.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = keycloakSettings?.ValidateIssuer ?? true,
					ValidateAudience = keycloakSettings?.ValidateAudience ?? true,
					ValidateLifetime = keycloakSettings?.ValidateLifetime ?? true,
					ValidateIssuerSigningKey = true,
					ValidAudience = keycloakSettings?.ClientId,
					ClockSkew = TimeSpan.Zero
				};
				opt.Events = new JwtBearerEvents
				{
					OnAuthenticationFailed = context =>
					{
						var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
						logger.LogError(context.Exception, "JWT authentication failed");
						return Task.CompletedTask;
					}
				};
			});

		services.AddAuthorization(opt =>
		{
			opt.AddPolicy(Constants.AdminPolicy, policy => policy.RequireRole(AccountTypes.Admin.ToString()));
			opt.AddPolicy(Constants.RegisteredUserOrAbovePolicy, policy => policy.RequireRole(AccountTypes.RegisteredUser.ToString(), AccountTypes.RegisteredUser.ToString()));
			opt.AddPolicy(Constants.AllUsersPolicy, policy => policy.RequireRole(Enum.GetNames(typeof(AccountTypes))));
		});

		services.AddHttpContextAccessor();

		return services;
	}
}
