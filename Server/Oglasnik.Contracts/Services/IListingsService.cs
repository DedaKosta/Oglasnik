using Oglasnik.Contracts.Records.Listing.Create;

namespace Oglasnik.Contracts.Services;

public interface IListingsService
{
    /// <summary>
    /// Creates a new listing with images
    /// </summary>
    /// <param name="request">Listing creation request</param>
    /// <param name="userId">ID of the user creating the listing</param>
    /// <param name="images">Collection of image files</param>
    /// <param name="thumbnailIndex">Index of the thumbnail image</param>
    /// <returns>Created listing response</returns>
    Task<CreateListingResponseRecord> CreateListingAsync(
        CreateListingRequestRecord request,
        long userId,
        IEnumerable<ImageUploadData>? images = null,
        int thumbnailIndex = 0);

    /// <summary>
    /// Deletes a listing (soft delete)
    /// </summary>
    /// <param name="listingId">Listing ID</param>
    /// <param name="userId">User ID requesting deletion</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteListingAsync(long listingId, long userId);
}

/// <summary>
/// Data structure for image upload
/// </summary>
public class ImageUploadData
{
    public Stream FileStream { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = "image/jpeg";
    public long FileSize { get; set; }
}
