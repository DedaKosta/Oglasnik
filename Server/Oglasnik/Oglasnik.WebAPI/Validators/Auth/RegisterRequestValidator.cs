using FastEndpoints;
using FluentValidation;
using Oglasnik.Contracts.Records.Auth.Register;
using Oglasnik.Contracts.Helpers;

namespace OglasnikApi.Validators.Auth;

public class RegisterRequestValidator : Validator<RegisterRequestRecord>
{
    public RegisterRequestValidator()
    {
		RuleFor(x => x.Username)
	        .NotEmpty().WithMessage("Username is required!")
	        .MinimumLength(8).WithMessage("Minimum length for Username is 8 characters!")
	        .MaximumLength(20).WithMessage("Maximum length for Username is 20 characters!");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required!")
            .MinimumLength(8).WithMessage("Minimum length for Password is 8 cahracters!")
            .Matches(Constants.PasswordRegex).WithMessage("Password must contain at least one number, one small character, one big character and one special character!");

		RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First Name is required!")
            .MinimumLength(2).WithMessage("Minimum length for First Name is 2 characters!")
            .MaximumLength(50).WithMessage("Maximum length for First Name is 50 characters!");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last Name is required!")
            .MinimumLength(2).WithMessage("Minimum length for Last Name is 2 characters!")
            .MaximumLength(50).WithMessage("Maximum length for Last Name is 50 characters!");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required!")
            .Matches(Constants.EmailRegex).WithMessage("Email must be in a valid format!");

    }
}
