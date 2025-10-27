namespace Oglasnik.Data.Configuration;

public static class Services
{
	public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddDbContext<DatabaseContext>((serviceProvider, options) =>
		{
			if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
			{
				options.EnableSensitiveDataLogging();
			}

			options.UseNpgsql(configuration.GetConnectionString("WebApi"));
		});

		return services;
	}
}
