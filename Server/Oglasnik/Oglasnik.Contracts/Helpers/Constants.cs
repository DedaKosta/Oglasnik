
namespace Oglasnik.Contracts.Helpers;

public static class Constants
{
	// Validation Regex
	public const string EmailRegex = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
	public const string PasswordRegex = @"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$";

	// Policies
	public const string AdminPolicy = "Admin";
	public const string RegisteredUserOrAbovePolicy = "RegisteredUserOrAbove";
	public const string AllUsersPolicy = "AllUsers";
}
