using Oglasnik.Data.Entities;

namespace Oglasnik.Data;

public class DatabaseContext : DbContext
{
	public virtual DbSet<UserAccount> UserAccounts { get; set; }
	public virtual DbSet<Role> Roles { get; set; }
	public virtual DbSet<Category> Categories { get; set; }
	public virtual DbSet<Listing> Listings { get; set; }
	public virtual DbSet<ListingImage> ListingImages { get; set; }

	public DatabaseContext(DbContextOptions<DatabaseContext> options)
		:base(options)
	{

	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		// Soft delete query filters
		modelBuilder.Entity<UserAccount>().HasQueryFilter(x => x.DeletedOnUtc == null);
		modelBuilder.Entity<Role>().HasQueryFilter(x => x.DeletedOnUtc == null);
		modelBuilder.Entity<Category>().HasQueryFilter(x => x.DeletedOnUtc == null);
		modelBuilder.Entity<Listing>().HasQueryFilter(x => x.DeletedOnUtc == null);
		modelBuilder.Entity<ListingImage>().HasQueryFilter(x => x.DeletedOnUtc == null);

		// Category self-referencing relationship
		modelBuilder.Entity<Category>()
			.HasOne(c => c.ParentCategory)
			.WithMany(c => c.SubCategories)
			.HasForeignKey(c => c.ParentCategoryId)
			.OnDelete(DeleteBehavior.Restrict);

		// Listing relationships
		modelBuilder.Entity<Listing>()
			.HasOne(l => l.User)
			.WithMany()
			.HasForeignKey(l => l.UserId)
			.OnDelete(DeleteBehavior.Restrict);

		modelBuilder.Entity<Listing>()
			.HasOne(l => l.Category)
			.WithMany(c => c.Listings)
			.HasForeignKey(l => l.CategoryId)
			.OnDelete(DeleteBehavior.Restrict);

		// ListingImage relationship
		modelBuilder.Entity<ListingImage>()
			.HasOne(li => li.Listing)
			.WithMany(l => l.Images)
			.HasForeignKey(li => li.ListingId)
			.OnDelete(DeleteBehavior.Cascade);

		// Indexes for performance
		modelBuilder.Entity<Listing>()
			.HasIndex(l => l.UserId);

		modelBuilder.Entity<Listing>()
			.HasIndex(l => l.CategoryId);

		modelBuilder.Entity<Listing>()
			.HasIndex(l => l.Status);

		modelBuilder.Entity<Listing>()
			.HasIndex(l => l.CreatedOnUtc);

		modelBuilder.Entity<Category>()
			.HasIndex(c => c.ParentCategoryId);

		modelBuilder.Entity<ListingImage>()
			.HasIndex(li => li.ListingId);
	}
}