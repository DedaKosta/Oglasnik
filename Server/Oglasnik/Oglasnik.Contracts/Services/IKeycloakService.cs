namespace Oglasnik.Contracts.Services;

public interface IKeycloakService
{
    Task<KeycloakTokenResponse?> AuthenticateUserAsync(string username, string password);
    Task<KeycloakUserCreationResponse?> CreateUserAsync(string username, string email, string firstName, string lastName, string password);
    Task<bool> SetUserPasswordAsync(string userId, string password, bool temporary = false);
    Task<KeycloakUser?> GetUserByEmailAsync(string email);
    Task<KeycloakUser?> GetUserByUsernameAsync(string username);
}

public class KeycloakTokenResponse
{
    public string access_token { get; set; } = string.Empty;
    public string refresh_token { get; set; } = string.Empty;
    public int expires_in { get; set; }
    public int refresh_expires_in { get; set; }
    public string token_type { get; set; } = "Bearer";
}

public class KeycloakUserCreationResponse
{
    public bool Success { get; set; }
    public string? UserId { get; set; }
    public string? Error { get; set; }
}

public class KeycloakUser
{
    public string id { get; set; } = string.Empty;
    public string username { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string firstName { get; set; } = string.Empty;
    public string lastName { get; set; } = string.Empty;
    public bool emailVerified { get; set; }
    public bool enabled { get; set; } = true;
}
