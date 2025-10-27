using System.ComponentModel.DataAnnotations;

namespace Oglasnik.Data.Entities;

public class ListingImage : Base
{
    /// <summary>
    /// Reference to the listing this image belongs to
    /// </summary>
    public long ListingId { get; set; }

    /// <summary>
    /// MinIO bucket identifier where the image is stored
    /// Example: "listings-images"
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string MinioBucketName { get; set; } = string.Empty;

    /// <summary>
    /// File name/path in MinIO bucket
    /// Example: "listings/user123/listing456/image1.jpg" or "abc123-def456.jpg"
    /// </summary>
    [Required]
    [MaxLength(300)]
    public string MinioFileName { get; set; } = string.Empty;

    /// <summary>
    /// Original file name uploaded by user
    /// </summary>
    [MaxLength(255)]
    public string? OriginalFileName { get; set; }

    /// <summary>
    /// Display order of the image in the listing (0-based)
    /// </summary>
    public int DisplayOrder { get; set; } = 0;

    /// <summary>
    /// Whether this image is the thumbnail/primary image for the listing
    /// </summary>
    public bool IsThumbnail { get; set; } = false;

    /// <summary>
    /// File size in bytes
    /// </summary>
    public long FileSizeBytes { get; set; } = 0;

    /// <summary>
    /// MIME type of the image (e.g., "image/jpeg", "image/png")
    /// </summary>
    [MaxLength(100)]
    public string? ContentType { get; set; }

    // Navigation Properties
    public Listing Listing { get; set; } = null!;
}
