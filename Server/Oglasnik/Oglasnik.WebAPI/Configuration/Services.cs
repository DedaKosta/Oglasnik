using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Oglasnik.Contracts.Helpers;
using Oglasnik.Contracts.Enums;

namespace OglasnikApi.Configuration;

public static class Services
{
	public static IServiceCollection AddAuthenticationAndAuthorization(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
			.AddJwtBearer(opt =>
			{
				opt.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Authorization:Secret"]!)),
					ValidateIssuer = false,
					ValidateAudience = false,
					ValidateLifetime = true,
					ClockSkew = TimeSpan.Zero
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
