using System.ComponentModel.DataAnnotations;

namespace Oglasnik.Data.Entities;

public class Category : Base
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    /// <summary>
    /// Parent category ID - null for root categories
    /// </summary>
    public long? ParentCategoryId { get; set; }

    // Navigation Properties

    /// <summary>
    /// Parent category (null for root categories)
    /// </summary>
    public Category? ParentCategory { get; set; }

    /// <summary>
    /// Child categories (subcategories)
    /// </summary>
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();

    /// <summary>
    /// Listings in this category
    /// </summary>
    public ICollection<Listing> Listings { get; set; } = new List<Listing>();
}
