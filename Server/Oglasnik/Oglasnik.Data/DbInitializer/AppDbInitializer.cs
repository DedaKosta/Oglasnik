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

		_dbContextx.UserAccounts.AddRange(new List<UserAccount>
		{
			new UserAccount
			{
				FirstName = "Nikola",
				LastName = "Jovanovic",
				Username = "nikola123",
				PasswordHash = GetPasswordHash("Nikola@123", salt),
				Email = "nikola.jovanovic@gmail.com",
				RoleId = _dbContextx.Roles.First(x => x.Name == AccountTypes.Admin).Id
			},
			new UserAccount
			{
				FirstName = "Strahinja",
				LastName = "Djurkovic",
				Username = "strahinja123",
				PasswordHash = GetPasswordHash("Strahinja@123", salt),
				Email = "strahinja.djurkovic@gmail.com",
				RoleId = _dbContextx.Roles.First(x => x.Name == AccountTypes.Admin).Id
			},
			new UserAccount
			{
				FirstName = "Dimitrije",
				LastName = "Petrovic",
				Username = "dimitrije123",
				PasswordHash = GetPasswordHash("Dimitrije@123", salt),
				Email = "dimitrije.petrovic@gmail.com",
				RoleId = _dbContextx.Roles.First(x => x.Name == AccountTypes.Admin).Id
			}
		});
		_dbContextx.SaveChanges();
	}

	private static string GetPasswordHash(string password, string saltString)
	{
		using var sha256 = SHA256.Create();

		byte[] salt = Encoding.UTF8.GetBytes(saltString);
		var saltedPassword = salt.Concat(Encoding.UTF8.GetBytes(password)).ToArray();

		return Convert.ToBase64String(sha256.ComputeHash(saltedPassword));
	}
}
