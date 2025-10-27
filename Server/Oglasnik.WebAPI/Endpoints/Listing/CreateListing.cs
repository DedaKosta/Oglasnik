using FastEndpoints;
using Oglasnik.Contracts.Helpers;
using Oglasnik.Contracts.Records.Listing.Create;
using Oglasnik.Contracts.Services;
using System.Security.Claims;

namespace Oglasnik.WebAPI.Endpoints.Listing;

public class CreateListing : Endpoint<CreateListingRequestRecord, CreateListingResponseRecord>
{
    private readonly IListingsService _listingsService;
    private readonly ILogger<CreateListing> _logger;

    public CreateListing(IListingsService listingsService, ILogger<CreateListing> logger)
    {
        _listingsService = listingsService;
        _logger = logger;
    }

    public override void Configure()
    {
        Post("/api/listings");
        // TODO: Re-enable authorization policy after configuring Keycloak roles
        // Policies(Constants.RegisteredUserOrAbovePolicy);
        // For now, just require authentication without role check
    }

    public override async Task HandleAsync(CreateListingRequestRecord request, CancellationToken cancellationToken)
    {
        try
        {
            // Get user ID from claims
            // Keycloak provides 'sub' claim as GUID, but we need numeric user ID for database
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                _logger.LogWarning("No user identifier found in claims");
                await Send.UnauthorizedAsync(cancellationToken);
                return;
            }

            // TODO: Implement proper Keycloak user ID to database user ID mapping
            // For now, use hardcoded user ID for testing
            long userId = 1; // Temporary: maps to first user in database

            _logger.LogInformation("Creating listing for Keycloak user: {KeycloakUserId}, using database userId: {DbUserId}",
                userIdClaim, userId);

            // Create listing (without images for now - images will be handled separately)
            var result = await _listingsService.CreateListingAsync(request, userId);

            if (result.Id == 0)
            {
                ThrowError(result.Message);
            }

            await Send.OkAsync(result, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating listing");
            ThrowError("An error occurred while creating the listing");
        }
    }
}
