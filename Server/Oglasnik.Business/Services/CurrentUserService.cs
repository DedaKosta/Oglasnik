using Microsoft.AspNetCore.Http;
using Oglasnik.Contracts.Records.UserAccount;
using Oglasnik.Contracts.Services;
using System.Security.Claims;

namespace Oglasnik.Business.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserAccountService _userAccountService;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor, IUserAccountService userAccountService)
    {
        _httpContextAccessor = httpContextAccessor;
        _userAccountService = userAccountService;
    }

    public long? GetUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("local_user_id")?.Value;
        return long.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    public string? GetKeycloakUserId()
    {
        return _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value;
    }

    public string? GetEmail()
    {
        return _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Email)?.Value
            ?? _httpContextAccessor.HttpContext?.User?.FindFirst("email")?.Value;
    }

    public async Task<UserAccountRecord?> GetCurrentUserAsync()
    {
        var keycloakUserId = GetKeycloakUserId();
        if (string.IsNullOrEmpty(keycloakUserId))
        {
            return null;
        }

        return await _userAccountService.GetByKeycloakUserIdAsync(keycloakUserId);
    }
}
