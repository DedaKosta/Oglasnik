using Oglasnik.Contracts.Enums;

namespace Oglasnik.Contracts.Records.Listing.Create;

public record CreateListingRequestRecord(
    string Caption,
    string Description,
    long CategoryId,
    ListingType ListingType,
    decimal Price,
    Currency Currency,
    bool IsPriceFixed,
    bool AcceptsTrade,
    ItemCondition ItemCondition,
    bool AvailableImmediately,
    bool DeliveryAvailable,
    bool InPersonPickup,
    string City,
    string ContactName
);
