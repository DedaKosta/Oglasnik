# Keycloak Integration Setup Guide

This guide walks you through setting up Keycloak for identity management in the Oglasnik application.

## 🚀 Quick Start

### 1. Start Keycloak with Docker Compose

```bash
# From the project root
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f keycloak
```

### 2. Access Keycloak Admin Console

- URL: http://localhost:8080
- Username: `admin`
- Password: `admin`

## 🔧 Keycloak Configuration

### Step 1: Create Realm

1. Click on the dropdown in the top left (says "master")
2. Click "Create Realm"
3. **Name**: `oglasnik`
4. Click "Create"

### Step 2: Create Client

1. Go to **Clients** → Click "Create client"
2. **Client type**: OpenID Connect
3. **Client ID**: `oglasnik-web`
4. Click "Next"

**Capability config:**
- ✅ Client authentication: OFF (public client for SPA)
- ✅ Authorization: OFF
- ✅ Standard flow: ON
- ✅ Direct access grants: ON
- Click "Next"

**Login settings:**
- Valid redirect URIs:
  - `http://localhost:5173/*`
  - `http://localhost:5175/*`
- Valid post logout redirect URIs:
  - `http://localhost:5173/*`
  - `http://localhost:5175/*`
- Web origins:
  - `http://localhost:5173`
  - `http://localhost:5175`
- Click "Save"

### Step 3: Create Client for Backend

1. Go to **Clients** → Click "Create client"
2. **Client ID**: `oglasnik-api`
3. Click "Next"

**Capability config:**
- ✅ Client authentication: ON (confidential client)
- ✅ Authorization: OFF
- ✅ Service accounts roles: ON
- Click "Next"

**Login settings:**
- Click "Save"

4. Go to **Credentials** tab
5. Copy the **Client secret** (you'll need this in your ASP.NET app)

### Step 4: Configure Realm Settings

1. Go to **Realm settings**
2. **General** tab:
   - User profile enabled: ON
3. **Login** tab:
   - User registration: ON (if you want users to register)
   - Forgot password: ON
   - Remember me: ON
4. **Tokens** tab:
   - Access token lifespan: 5 minutes (default)
   - Refresh token max reuse: 0
5. Click "Save"

### Step 5: Create Test User

1. Go to **Users** → Click "Create new user"
2. **Username**: `testuser`
3. **Email**: `test@oglasnik.com`
4. **Email verified**: ON
5. **First name**: `Test`
6. **Last name**: `User`
7. Click "Create"

8. Go to **Credentials** tab
9. Click "Set password"
10. **Password**: `Password123!`
11. **Temporary**: OFF
12. Click "Save"

### Step 6: Create User Roles (Optional)

1. Go to **Realm roles** → Click "Create role"
2. Create these roles:
   - `user` (default user)
   - `admin` (administrator)
   - `moderator` (content moderator)

3. Assign role to test user:
   - Go to **Users** → Select `testuser`
   - **Role mapping** tab
   - Click "Assign role"
   - Select `user`
   - Click "Assign"

## 🔐 ASP.NET Core Integration

### Install NuGet Packages

```bash
cd Server/Oglasnik/Oglasnik.WebAPI
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.AspNetCore.Authentication.OpenIdConnect
```

### Update appsettings.json

```json
{
  "Keycloak": {
    "Authority": "http://localhost:8080/realms/oglasnik",
    "Audience": "oglasnik-api",
    "RequireHttpsMetadata": false,
    "ValidateAudience": true,
    "ValidateIssuer": true,
    "ValidateLifetime": true
  }
}
```

### Configure in Program.cs

```csharp
// Add after builder.Services
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Keycloak:Authority"];
        options.Audience = builder.Configuration["Keycloak:Audience"];
        options.RequireHttpsMetadata = bool.Parse(builder.Configuration["Keycloak:RequireHttpsMetadata"] ?? "true");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Keycloak:Authority"],
            ValidAudience = builder.Configuration["Keycloak:Audience"],
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully");
                return Task.CompletedTask;
            }
        };
    });

// Add authorization
builder.Services.AddAuthorization();
```

## ⚛️ React Client Integration

### Install Dependencies

```bash
cd Client
npm install @react-keycloak/web keycloak-js
```

### Create Keycloak Config

Create `Client/src/keycloak.ts`:

```typescript
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'oglasnik',
  clientId: 'oglasnik-web',
});

export default keycloak;
```

### Wrap App with Keycloak Provider

Update `Client/src/main.tsx`:

```typescript
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'

const keycloakProviderInitConfig = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakProviderInitConfig}>
      <App />
    </ReactKeycloakProvider>
  </React.StrictMode>,
)
```

### Use Keycloak in Components

```typescript
import { useKeycloak } from '@react-keycloak/web'

function MyComponent() {
  const { keycloak, initialized } = useKeycloak()

  if (!initialized) {
    return <div>Loading...</div>
  }

  const login = () => keycloak.login()
  const logout = () => keycloak.logout()

  return (
    <div>
      {!keycloak.authenticated ? (
        <button onClick={login}>Login</button>
      ) : (
        <button onClick={logout}>Logout ({keycloak.tokenParsed?.preferred_username})</button>
      )}
    </div>
  )
}
```

## 🧪 Testing the Integration

### Test Authentication Flow

1. Start all services:
   ```bash
   docker-compose up -d
   cd Server/Oglasnik && dotnet run --project Oglasnik.WebAPI
   cd Client && npm run dev
   ```

2. Open http://localhost:5173
3. Click "Login"
4. You should be redirected to Keycloak
5. Login with:
   - Username: `testuser`
   - Password: `Password123!`
6. You should be redirected back to your app

### Test Protected Endpoint

```typescript
// In React component
const { keycloak } = useKeycloak()

const callProtectedApi = async () => {
  const response = await fetch('https://localhost:7283/api/protected', {
    headers: {
      Authorization: `Bearer ${keycloak.token}`
    }
  })
  const data = await response.json()
  console.log(data)
}
```

## 🔍 Useful Endpoints

- **Keycloak Admin**: http://localhost:8080
- **Realm Info**: http://localhost:8080/realms/oglasnik
- **OpenID Config**: http://localhost:8080/realms/oglasnik/.well-known/openid-configuration
- **JWKS**: http://localhost:8080/realms/oglasnik/protocol/openid-connect/certs

## 🛠️ Troubleshooting

### Keycloak won't start
```bash
docker-compose down -v
docker-compose up -d
```

### Token validation fails
- Check that `Authority` URL is correct
- Verify client configuration in Keycloak
- Check CORS settings (Web origins in client config)
- Ensure `RequireHttpsMetadata` is false for development

### Can't login from React
- Verify redirect URIs match exactly
- Check browser console for errors
- Ensure Keycloak is accessible from browser

## 📚 Next Steps

1. ✅ Set up role-based access control (RBAC)
2. ✅ Configure user profile attributes
3. ✅ Set up social login (Google, Facebook, etc.)
4. ✅ Configure email server for password reset
5. ✅ Set up multi-factor authentication (MFA)
6. ✅ Configure token refresh strategy
7. ✅ Set up Keycloak themes for branding

## 🔒 Production Considerations

- Use HTTPS for all services
- Store secrets in environment variables or secrets manager
- Set up proper database backups for Keycloak DB
- Configure proper session and token lifetimes
- Enable rate limiting
- Set up monitoring and logging
- Use Keycloak clustering for high availability
- Configure proper realm security policies
