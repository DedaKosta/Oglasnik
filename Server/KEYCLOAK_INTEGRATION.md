# Keycloak Integration Best Practices

This document outlines the best practices implemented for integrating Keycloak with the Oglasnik application's local database.

## Architecture Overview

The application uses a **hybrid authentication model**:
- **Keycloak**: Primary authentication provider (identity management, JWT tokens, password management)
- **Local Database**: Stores user profiles, application-specific data, and roles

## Why This Approach?

### Benefits of Dual Storage:

1. **Separation of Concerns**
   - Keycloak handles authentication, security, and identity management
   - Local database handles application-specific user data and business logic

2. **Performance**
   - Avoid querying Keycloak for every user data request
   - Fast local queries for user profiles and application data

3. **Data Ownership**
   - Application-specific data (user preferences, activity, etc.) stays in your database
   - You're not locked into Keycloak's data model

4. **Resilience**
   - Application can still function with local data even if Keycloak has issues
   - Offline capabilities for read operations

5. **Flexibility**
   - Easy to add custom fields and relationships in your database
   - Can migrate away from Keycloak in the future if needed

## Implementation Details

### 1. Database Schema

The `UserAccount` entity includes:
- `Id`: Local database primary key
- `KeycloakUserId`: Foreign key to Keycloak user (from "sub" claim in JWT)
- `Email`, `FirstName`, `LastName`: Synced from Keycloak
- `RoleId`: Application-specific role (managed locally)
- `PasswordHash`: Deprecated (passwords managed by Keycloak)

### 2. User Registration Flow

```
1. User submits registration → Register endpoint
2. Create user in Keycloak → Get Keycloak user ID
3. Create user in local database with KeycloakUserId
4. Return success with local user ID
```

**Implementation**: `Register.cs:57-81`

### 3. User Login Flow

```
1. User submits credentials → Login endpoint
2. Authenticate with Keycloak → Get JWT tokens
3. Get user details from Keycloak
4. Sync user to local database (create or update)
5. Return JWT tokens + local user data
```

**Implementation**: `Login.cs:50-63`

### 4. JWT Token Enrichment

When a JWT token is validated:
```
1. Extract Keycloak user ID from "sub" claim
2. Query local database for user
3. Add custom claims: local_user_id, role
4. Add to ClaimsIdentity for authorization
```

**Implementation**: `Services.cs:66-100`

### 5. Service Layer

#### `IUserAccountService`
- `GetByEmailAsync()`: Find user by email
- `GetByKeycloakUserIdAsync()`: Find user by Keycloak ID
- `CreateAsync()`: Create new user in local DB
- `UpdateAsync()`: Update existing user
- `GetOrCreateFromKeycloakAsync()`: Sync user from Keycloak (idempotent)

#### `ICurrentUserService`
- `GetUserId()`: Get local user ID from claims
- `GetKeycloakUserId()`: Get Keycloak ID from claims
- `GetEmail()`: Get user email from claims
- `GetCurrentUserAsync()`: Get full user object from database

**Usage in endpoints**:
```csharp
public class MyEndpoint : Endpoint<MyRequest, MyResponse>
{
    private readonly ICurrentUserService _currentUserService;

    public override async Task HandleAsync(MyRequest req, CancellationToken ct)
    {
        var userId = _currentUserService.GetUserId(); // Get local ID
        var user = await _currentUserService.GetCurrentUserAsync(); // Get full user
    }
}
```

## Best Practices

### ✅ DO:

1. **Always sync on login**: Use `GetOrCreateFromKeycloakAsync()` to ensure user exists in local DB
2. **Use Keycloak for authentication**: Never store passwords locally
3. **Store application data locally**: User preferences, activity, relationships
4. **Use local user ID for foreign keys**: Reference `UserAccount.Id` in your tables
5. **Enrich JWT with local claims**: Add roles and permissions from local DB
6. **Handle sync failures gracefully**: Log errors but don't block operations

### ❌ DON'T:

1. **Don't store passwords**: Let Keycloak handle password hashing and security
2. **Don't duplicate all Keycloak data**: Only sync what you need
3. **Don't trust JWT alone**: Always validate against local database for critical operations
4. **Don't forget to sync on login**: Users might be updated in Keycloak
5. **Don't expose Keycloak IDs in APIs**: Use local IDs in your API responses

## User Data Flow

### Registration
```
Client → API → Keycloak (create user) → API → Local DB (create user) → Client
```

### Login
```
Client → API → Keycloak (authenticate) → API → Local DB (sync user) → Client
```

### Authenticated Request
```
Client (JWT) → API → JWT Validation → Local DB (enrich claims) → Endpoint Handler
```

## Security Considerations

1. **JWT Validation**: Keycloak signs JWTs, API validates signature
2. **Role-Based Access**: Roles stored locally, enforced via ASP.NET authorization policies
3. **Token Refresh**: Use refresh tokens from Keycloak (expires_in, refresh_token)
4. **HTTPS**: Always use HTTPS in production (set RequireHttpsMetadata: true)

## Configuration

### appsettings.json
```json
{
  "Keycloak": {
    "AuthServerUrl": "http://localhost:8080",
    "Realm": "Oglasnik",
    "ClientId": "oglasnik.client",
    "ClientSecret": "your-secret",
    "AdminUsername": "admin",
    "AdminPassword": "admin",
    "RequireHttpsMetadata": false,  // true in production
    "ValidateAudience": true,
    "ValidateIssuer": true,
    "ValidateLifetime": true
  }
}
```

## Migration from Old System

If you have existing users without Keycloak IDs:

1. User logs in with email/password
2. System finds user by email in local DB
3. Authenticates with Keycloak
4. Updates local user with `KeycloakUserId`
5. Future logins use Keycloak ID

**Implementation**: `UserAccountService.GetOrCreateFromKeycloakAsync()` handles this automatically

## Testing

### Test Registration
```bash
POST /api/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

### Test Login
```bash
POST /api/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Use JWT Token
```bash
GET /api/protected-endpoint
Authorization: Bearer <access_token>
```

## Troubleshooting

### User not found in local database
- Check if sync occurred during login
- Verify `KeycloakUserId` matches "sub" claim in JWT
- Check logs for sync errors

### JWT validation fails
- Verify Keycloak is running
- Check `Authority` URL in configuration
- Ensure clock skew is acceptable
- Verify token hasn't expired

### Role-based authorization fails
- Check if user has role in local database
- Verify claims are added during `OnTokenValidated`
- Check authorization policy configuration

## Future Enhancements

Consider implementing:
1. **Webhook from Keycloak**: Update local DB when user changes in Keycloak
2. **Admin API**: Manage user roles and permissions
3. **User profile API**: Update user data in both systems
4. **Soft delete**: Mark users as deleted instead of removing
5. **Audit logging**: Track all user data changes
