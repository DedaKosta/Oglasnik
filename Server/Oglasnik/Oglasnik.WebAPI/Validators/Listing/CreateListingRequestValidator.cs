using FastEndpoints;
using FluentValidation;
using Oglasnik.Contracts.Records.Listing.Create;

namespace Oglasnik.WebAPI.Validators.Listing;

public class CreateListingRequestValidator : Validator<CreateListingRequestRecord>
{
    public CreateListingRequestValidator()
    {
        RuleFor(x => x.Caption)
            .NotEmpty().WithMessage("Caption is required")
            .MaximumLength(100).WithMessage("Caption must not exceed 100 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters");

        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("Valid category is required");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City must not exceed 100 characters");

        RuleFor(x => x.ContactName)
            .NotEmpty().WithMessage("Contact name is required")
            .MaximumLength(100).WithMessage("Contact name must not exceed 100 characters");

        RuleFor(x => x.ListingType)
            .IsInEnum().WithMessage("Invalid listing type");

        RuleFor(x => x.Currency)
            .IsInEnum().WithMessage("Invalid currency");

        RuleFor(x => x.ItemCondition)
            .IsInEnum().WithMessage("Invalid item condition");
    }
}
