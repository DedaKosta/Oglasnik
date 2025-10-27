using Oglasnik.Data.Entities;
using Oglasnik.Contracts.Enums;
using System.Security.Cryptography;
using System.Text;

namespace Oglasnik.Data.DbInitializer;

public class AppDbInitializer
{
	public static void Seed(IApplicationBuilder applicationBuilder, IConfiguration configuration)
	{
		using var serviceScope = applicationBuilder.ApplicationServices.CreateScope();

		var _dbContext = serviceScope.ServiceProvider.GetService<DatabaseContext>();

		if(_dbContext == null)
		{
			return;
		}

		_dbContext.Database.EnsureCreated();

		SeedRoles(_dbContext);
		SeedUserAccounts(_dbContext, configuration);
		SeedCategories(_dbContext);
	}

	private static void SeedRoles(DatabaseContext _dbContextx)
	{
		if (_dbContextx.Roles.Any())
		{
			return;
		}

		_dbContextx.Roles.AddRange(Enum.GetValues<AccountTypes>().Select(x => new Role { Name = x }));
		_dbContextx.SaveChanges();
	}

	private static void SeedUserAccounts(DatabaseContext _dbContextx, IConfiguration configuration)
	{
		if (_dbContextx.UserAccounts.Any())
		{
			return;
		}

		string salt = configuration["PasswordSalt:Salt"]!;

		// Note: Seed users are now created through Keycloak registration
		// If you need seed users, create them through the /api/register endpoint
		// or manually in Keycloak, then they will be synced to the local database on first login
		_dbContextx.SaveChanges();
	}

	private static void SeedCategories(DatabaseContext _dbContext)
	{
		if (_dbContext.Categories.Any())
		{
			return;
		}

		var categories = new List<Category>
		{
			new Category { Name = "Electronics", Description = "Electronic devices and gadgets" },
			new Category { Name = "Vehicles", Description = "Cars, motorcycles, and other vehicles" },
			new Category { Name = "Real Estate", Description = "Property and real estate listings" },
			new Category { Name = "Fashion", Description = "Clothing, shoes, and accessories" },
			new Category { Name = "Home & Garden", Description = "Furniture, appliances, and garden items" },
			new Category { Name = "Sports & Outdoors", Description = "Sports equipment and outdoor gear" },
			new Category { Name = "Books & Media", Description = "Books, movies, music, and games" },
			new Category { Name = "Toys & Games", Description = "Children's toys and board games" },
			new Category { Name = "Other", Description = "Miscellaneous items" }
		};

		_dbContext.Categories.AddRange(categories);
		_dbContext.SaveChanges();
	}

	private static string GetPasswordHash(string password, string saltString)
	{
		using var sha256 = SHA256.Create();

		byte[] salt = Encoding.UTF8.GetBytes(saltString);
		var saltedPassword = salt.Concat(Encoding.UTF8.GetBytes(password)).ToArray();

		return Convert.ToBase64String(sha256.ComputeHash(saltedPassword));
	}
}
