using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Oglasnik.Contracts.Configuration;
using Oglasnik.Contracts.Services;

namespace Oglasnik.Business.Services;

public class KeycloakService : IKeycloakService
{
    private readonly HttpClient _httpClient;
    private readonly KeycloakSettings _settings;
    private readonly ILogger<KeycloakService> _logger;
    private string? _adminToken;
    private DateTime _tokenExpiry = DateTime.MinValue;

    public KeycloakService(
        HttpClient httpClient,
        IOptions<KeycloakSettings> settings,
        ILogger<KeycloakService> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<KeycloakTokenResponse?> AuthenticateUserAsync(string email, string password)
    {
        try
        {
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_id", _settings.ClientId),
                new KeyValuePair<string, string>("client_secret", _settings.ClientSecret),
                new KeyValuePair<string, string>("grant_type", "password"),
                new KeyValuePair<string, string>("username", email),
                new KeyValuePair<string, string>("password", password)
            });

            var response = await _httpClient.PostAsync(_settings.TokenEndpoint, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("Keycloak authentication failed: {Error}", error);
                return null;
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<KeycloakTokenResponse>(jsonResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error authenticating user with Keycloak");
            return null;
        }
    }

    public async Task<KeycloakUserCreationResponse?> CreateUserAsync(
        string email,
        string firstName,
        string lastName,
        string password)
    {
        try
        {
            await EnsureAdminTokenAsync();

            var userPayload = new
            {
                username = email,
                email,
                firstName,
                lastName,
                enabled = true,
                emailVerified = false,
                credentials = new[]
                {
                    new
                    {
                        type = "password",
                        value = password,
                        temporary = false
                    }
                }
            };

            var jsonContent = JsonSerializer.Serialize(userPayload);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, _settings.UsersEndpoint)
            {
                Content = content
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _adminToken);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("Keycloak user creation failed: {Error}", error);
                return new KeycloakUserCreationResponse
                {
                    Success = false,
                    Error = error
                };
            }

            // Extract user ID from Location header
            var locationHeader = response.Headers.Location?.ToString();
            var userId = locationHeader?.Split('/').LastOrDefault();

            return new KeycloakUserCreationResponse
            {
                Success = true,
                UserId = userId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user in Keycloak");
            return new KeycloakUserCreationResponse
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public async Task<bool> SetUserPasswordAsync(string userId, string password, bool temporary = false)
    {
        try
        {
            await EnsureAdminTokenAsync();

            var credentialPayload = new
            {
                type = "password",
                value = password,
                temporary
            };

            var jsonContent = JsonSerializer.Serialize(credentialPayload);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Put, $"{_settings.UsersEndpoint}/{userId}/reset-password")
            {
                Content = content
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _adminToken);

            var response = await _httpClient.SendAsync(request);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting user password in Keycloak");
            return false;
        }
    }

    public async Task<KeycloakUser?> GetUserByEmailAsync(string email)
    {
        try
        {
            await EnsureAdminTokenAsync();

            var request = new HttpRequestMessage(HttpMethod.Get, $"{_settings.UsersEndpoint}?email={email}&exact=true");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _adminToken);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var users = JsonSerializer.Deserialize<KeycloakUser[]>(jsonResponse);

            return users?.FirstOrDefault();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by email from Keycloak");
            return null;
        }
    }

    private async Task EnsureAdminTokenAsync()
    {
        if (!string.IsNullOrEmpty(_adminToken) && DateTime.UtcNow < _tokenExpiry)
        {
            return; // Token is still valid
        }

        try
        {
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_id", "admin-cli"),
                new KeyValuePair<string, string>("grant_type", "password"),
                new KeyValuePair<string, string>("username", _settings.AdminUsername),
                new KeyValuePair<string, string>("password", _settings.AdminPassword)
            });

            var tokenUrl = $"{_settings.AuthServerUrl}/realms/master/protocol/openid-connect/token";
            var response = await _httpClient.PostAsync(tokenUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to get admin token: {Error}", error);
                throw new Exception("Failed to get Keycloak admin token");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonSerializer.Deserialize<KeycloakTokenResponse>(jsonResponse);

            if (tokenResponse != null)
            {
                _adminToken = tokenResponse.access_token;
                _tokenExpiry = DateTime.UtcNow.AddSeconds(tokenResponse.expires_in - 60); // Refresh 1 minute before expiry
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error obtaining admin token from Keycloak");
            throw;
        }
    }
}
