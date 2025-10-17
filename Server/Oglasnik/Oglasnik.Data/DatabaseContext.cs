using Oglasnik.Data.Entities;

namespace Oglasnik.Data;

public class DatabaseContext : DbContext
{
	public virtual DbSet<UserAccount> UserAccounts { get; set; }
	public virtual DbSet<Role> Roles { get; set; }

	public DatabaseContext(DbContextOptions<DatabaseContext> options)
		:base(options)
	{

	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<UserAccount>().HasQueryFilter(x => x.DeletedOnUtc == null);
		modelBuilder.Entity<Role>().HasQueryFilter(x => x.DeletedOnUtc == null);
	}
}