using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Oglasnik.Contracts.Configuration;
using Oglasnik.Contracts.Enums;
using Oglasnik.Contracts.Records.Listing.Create;
using Oglasnik.Contracts.Services;
using Oglasnik.Data;
using Oglasnik.Data.Entities;

namespace Oglasnik.Business.Services;

public class ListingsService : IListingsService
{
    private readonly DatabaseContext _dbContext;
    private readonly IMinioService _minioService;
    private readonly MinioSettings _minioSettings;
    private readonly ILogger<ListingsService> _logger;

    public ListingsService(
        DatabaseContext dbContext,
        IMinioService minioService,
        IOptions<MinioSettings> minioSettings,
        ILogger<ListingsService> logger)
    {
        _dbContext = dbContext;
        _minioService = minioService;
        _minioSettings = minioSettings.Value;
        _logger = logger;
    }

    public async Task<CreateListingResponseRecord> CreateListingAsync(
        CreateListingRequestRecord request,
        long userId,
        IEnumerable<ImageUploadData>? images = null,
        int thumbnailIndex = 0)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            // Validate user exists
            var userExists = await _dbContext.UserAccounts
                .AnyAsync(u => u.Id == userId);

            if (!userExists)
            {
                return new CreateListingResponseRecord(0, string.Empty, "User not found");
            }

            // Validate category exists
            var categoryExists = await _dbContext.Categories
                .AnyAsync(c => c.Id == request.CategoryId);

            if (!categoryExists)
            {
                return new CreateListingResponseRecord(0, string.Empty, "Category not found");
            }

            // Create the listing
            var listing = new Listing
            {
                Caption = request.Caption,
                Description = request.Description,
                CategoryId = request.CategoryId,
                ListingType = request.ListingType,
                Price = request.Price,
                Currency = request.Currency,
                IsPriceFixed = request.IsPriceFixed,
                AcceptsTrade = request.AcceptsTrade,
                ItemCondition = request.ItemCondition,
                AvailableImmediately = request.AvailableImmediately,
                DeliveryAvailable = request.DeliveryAvailable,
                InPersonPickup = request.InPersonPickup,
                City = request.City,
                ContactName = request.ContactName,
                UserId = userId,
                Status = ListingStatus.Active,
                ViewCount = 0,
                FollowCount = 0,
                CreatedOnUtc = DateTime.UtcNow
            };

            _dbContext.Listings.Add(listing);
            await _dbContext.SaveChangesAsync();

            // Upload images if provided
            if (images != null && images.Any())
            {
                var imageList = images.ToList();
                var bucketName = _minioSettings.BucketNames.ListingsImages;

                for (int i = 0; i < imageList.Count; i++)
                {
                    var imageData = imageList[i];

                    try
                    {
                        // Generate unique filename: listings/{userId}/{listingId}/{guid}-{originalFileName}
                        var fileExtension = Path.GetExtension(imageData.FileName);
                        var uniqueFileName = $"listings/{userId}/{listing.Id}/{Guid.NewGuid()}{fileExtension}";

                        // Upload to MinIO
                        await _minioService.UploadFileAsync(
                            imageData.FileStream,
                            uniqueFileName,
                            bucketName,
                            imageData.ContentType);

                        // Create ListingImage entity
                        var listingImage = new ListingImage
                        {
                            ListingId = listing.Id,
                            MinioBucketName = bucketName,
                            MinioFileName = uniqueFileName,
                            OriginalFileName = imageData.FileName,
                            DisplayOrder = i,
                            IsThumbnail = i == thumbnailIndex,
                            FileSizeBytes = imageData.FileSize,
                            ContentType = imageData.ContentType,
                            CreatedOnUtc = DateTime.UtcNow
                        };

                        _dbContext.ListingImages.Add(listingImage);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error uploading image {Index} for listing {ListingId}", i, listing.Id);
                        // Continue with other images
                    }
                }

                await _dbContext.SaveChangesAsync();
            }

            await transaction.CommitAsync();

            _logger.LogInformation(
                "Listing created successfully. ListingId: {ListingId}, UserId: {UserId}, ImageCount: {ImageCount}",
                listing.Id, userId, images?.Count() ?? 0);

            return new CreateListingResponseRecord(
                listing.Id,
                listing.Caption,
                "Listing created successfully");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error creating listing for user {UserId}", userId);
            throw;
        }
    }

    public async Task<bool> DeleteListingAsync(long listingId, long userId)
    {
        try
        {
            var listing = await _dbContext.Listings
                .Include(l => l.Images)
                .FirstOrDefaultAsync(l => l.Id == listingId && l.UserId == userId);

            if (listing == null)
            {
                return false;
            }

            // Soft delete the listing
            listing.DeletedOnUtc = DateTime.UtcNow;

            // Delete images from MinIO
            foreach (var image in listing.Images)
            {
                try
                {
                    await _minioService.DeleteFileAsync(image.MinioFileName, image.MinioBucketName);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to delete image {FileName} from MinIO", image.MinioFileName);
                    // Continue with other deletions
                }
            }

            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Listing {ListingId} deleted by user {UserId}", listingId, userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting listing {ListingId} for user {UserId}", listingId, userId);
            throw;
        }
    }
}
