using System.ComponentModel.DataAnnotations;
using Oglasnik.Contracts.Enums;

namespace Oglasnik.Data.Entities;

public class Listing : Base
{
    // Basic Information
    [Required]
    [MaxLength(100)]
    public string Caption { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    // Category Reference
    public long CategoryId { get; set; }

    // Listing Type & Price
    [Required]
    public ListingType ListingType { get; set; } = ListingType.Selling;

    [Required]
    public decimal Price { get; set; }

    [Required]
    public Currency Currency { get; set; } = Currency.EUR;

    public bool IsPriceFixed { get; set; } = true;

    public bool AcceptsTrade { get; set; } = false;

    // Item Condition
    [Required]
    public ItemCondition ItemCondition { get; set; }

    // Availability
    public bool AvailableImmediately { get; set; } = true;

    // Delivery Options
    public bool DeliveryAvailable { get; set; } = false;

    public bool InPersonPickup { get; set; } = true;

    // Location & Contact
    [Required]
    [MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ContactName { get; set; } = string.Empty;

    // User Reference
    public long UserId { get; set; }

    // Listing Status
    [Required]
    public ListingStatus Status { get; set; } = ListingStatus.Active;

    // Engagement Metrics
    public int ViewCount { get; set; } = 0;

    public int FollowCount { get; set; } = 0;

    // Expiration (optional - for featured/promoted listings)
    public DateTime? ExpiresOnUtc { get; set; }

    // Navigation Properties
    public UserAccount User { get; set; } = null!;

    public Category Category { get; set; } = null!;

    public ICollection<ListingImage> Images { get; set; } = new List<ListingImage>();
}
