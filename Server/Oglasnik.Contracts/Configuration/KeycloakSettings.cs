namespace Oglasnik.Contracts.Configuration;

public class KeycloakSettings
{
    public string AuthServerUrl { get; set; } = string.Empty;
    public string Realm { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string AdminUsername { get; set; } = string.Empty;
    public string AdminPassword { get; set; } = string.Empty;
    public bool RequireHttpsMetadata { get; set; } = true;
    public bool ValidateAudience { get; set; } = true;
    public bool ValidateIssuer { get; set; } = true;
    public bool ValidateLifetime { get; set; } = true;

    public string Authority => $"{AuthServerUrl}/realms/{Realm}";
    public string TokenEndpoint => $"{Authority}/protocol/openid-connect/token";
    public string AdminApiUrl => $"{AuthServerUrl}/admin/realms/{Realm}";
    public string UsersEndpoint => $"{AdminApiUrl}/users";
}
