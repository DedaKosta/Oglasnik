# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Oglasnik is a full-stack classified ads marketplace platform for buying and selling new and used goods. The project features multi-level categories, integrated messaging, storefronts, payment processing, and Keycloak-based authentication.

## Architecture

### Technology Stack

**Client (Frontend):**
- React 19.1.1 with TypeScript 5.9.3
- Vite 7.1.7 as build tool
- Tailwind CSS 4.1.14 with PostCSS
- React Router DOM 7.9.4 for routing
- Zustand 5.0.8 for state management
- i18next for internationalization (8 languages: en, sr, bs, hr, mk, bg, el, me)
- ESLint 9 with TypeScript support

**Server (Backend):**
- ASP.NET Core 8.0 with C#
- FastEndpoints for API endpoints
- Entity Framework Core with PostgreSQL
- Serilog for structured logging
- Keycloak integration for authentication/authorization
- MinIO for object storage (S3-compatible)

**Infrastructure:**
- Docker Compose for local development
- Keycloak 23.0 for identity management
- PostgreSQL 16 (separate databases for Keycloak and application)
- MinIO for file storage (ports 9000/9001)

### Project Structure

**Client (`Client/`):**
- `src/components/` - React components (HomePage, SignIn, SignUp, Layout, Header, Footer, etc.)
- `src/contexts/` - React contexts (ThemeContext, ToastContext, LoadingContext, LayoutContext)
- `src/store/` - Zustand stores (authStore, appStore)
- `src/services/` - API service layer (authService, listingService)
- `src/locales/` - Translation files for i18next
- `src/config/` - API configuration
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions (API request wrapper)

**Server (`Server/Oglasnik/`):**
- `Oglasnik.WebAPI/` - API layer with FastEndpoints
  - `Endpoints/` - API endpoint handlers (Auth/, Listing/, Healthcheck/)
  - `Validators/` - FluentValidation validators
  - `Middleware/` - Custom middleware (UserClaimsEnrichmentMiddleware)
  - `Program.cs` - Application entry point
- `Oglasnik.Business/` - Business logic layer
  - `Services/` - Service implementations (KeycloakService, UserAccountService, ListingsService, MinioService, CurrentUserService)
- `Oglasnik.Data/` - Data access layer
  - `Entities/` - EF Core entity models (UserAccount, Listing, Category, Role, etc.)
  - `Migrations/` - Database migrations
  - `DatabaseContext.cs` - EF Core DbContext with soft delete query filters
  - `DbInitializer/` - Database seeding logic
- `Oglasnik.Contracts/` - Shared contracts and DTOs
  - `Records/` - Request/response records (immutable DTOs)
  - `Services/` - Service interfaces
  - `Configuration/` - Configuration classes (KeycloakSettings, MinioSettings)
  - `Enums/` - Shared enums (AccountTypes, ListingStatus, Currency, ItemCondition)
  - `Helpers/` - Constants and validation patterns

## Development Commands

### Client
```bash
cd Client
npm install                    # Install dependencies
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Build for production (tsc + vite build)
npm run preview                # Preview production build
npm run lint                   # Run ESLint
```

### Server
```bash
cd Server/Oglasnik
dotnet restore                 # Restore packages
dotnet build                   # Build solution
dotnet run --project Oglasnik.WebAPI  # Run API (http://localhost:5030)

# Entity Framework migrations (from Server/Oglasnik directory)
dotnet ef migrations add MigrationName --project Oglasnik.Data --startup-project Oglasnik.WebAPI
dotnet ef database update --project Oglasnik.Data --startup-project Oglasnik.WebAPI
```

### Docker (Keycloak + Databases + MinIO)
```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose down -v         # Stop and remove volumes
docker-compose ps              # Check service status
docker-compose logs -f keycloak  # View Keycloak logs
docker-compose logs -f minio     # View MinIO logs
```

## Key Architectural Patterns

### Frontend State Management
- **Zustand stores** with persist middleware for authentication state
- `authStore` (persisted): authentication state, user data, JWT tokens (localStorage key: `auth-storage`)
- `appStore` (non-persisted): UI state (sidebar, modals, notifications)
- Centralized exports in `src/store/index.ts`
- Async actions in stores: `signIn()`, `signUp()`, `signOut()`

### Frontend API Communication
- **Centralized configuration** in `src/config/api.ts` with base URL and endpoint paths
- **Service layer pattern**: Singleton class-based services (`authService`, `listingService`)
- **API request wrapper** (`src/utils/api.ts`): Handles loading state, toast notifications, and error formatting
- **Context bridge pattern**: `ApiContextInitializer` component connects API utils to React contexts
- Type-safe request/response with interfaces in `src/types/`

### Frontend Provider Hierarchy
```
ThemeProvider
└── ToastProvider
  └── LoadingProvider
    └── ApiContextInitializer
      └── BrowserRouter
        └── Routes
```

### Authentication & Authorization Flow

**Client → Server:**
1. User submits credentials via SignIn component
2. `authStore.signIn()` calls `authService.login()`
3. Backend validates credentials with Keycloak via `KeycloakService`
4. Keycloak returns JWT access + refresh tokens
5. Backend returns tokens to client
6. Client stores tokens in authStore (persisted to localStorage)

**Subsequent API Requests:**
1. Client includes JWT in Authorization header
2. Backend validates JWT signature and claims
3. `UserClaimsEnrichmentMiddleware` enriches claims with local user data:
   - Extracts Keycloak user ID from `sub` claim
   - Queries local database for UserAccount
   - Adds `local_user_id` and role claims to HttpContext
4. Endpoints access user via `ICurrentUserService`

**Authorization Policies:**
- `AdminPolicy`: Requires Admin role
- `RegisteredUserOrAbovePolicy`: Requires RegisteredUser or Admin
- `AllUsersPolicy`: Any authenticated user
- Applied in FastEndpoints via `Policies()` method

### Backend Clean Architecture

**4-Layer Separation:**
1. **Contracts**: Shared types, DTOs (records), service interfaces, configuration classes
2. **Data**: EF Core entities, DbContext, migrations, database seeding
3. **Business**: Service implementations, business logic
4. **WebAPI**: FastEndpoints, validators, middleware, Program.cs

**Dependency Flow:** WebAPI → Business → Data → Contracts

### FastEndpoints Pattern

```csharp
public class Register : Endpoint<RegisterRequestRecord, RegisterResponseRecord>
{
    public override void Configure()
    {
        Post("/api/register");
        AllowAnonymous();
    }

    public override async Task HandleAsync(RegisterRequestRecord req, CancellationToken ct)
    {
        // Handler logic with automatic DI
    }
}
```

**Key Features:**
- Strong typing with `Endpoint<TRequest, TResponse>`
- Built-in FluentValidation integration
- Policy-based authorization
- Automatic error responses with `ThrowError()`

### Database Patterns

**Soft Delete:**
- All entities inherit from `Base` class with `DeletedOnUtc` property
- Query filters applied globally: `modelBuilder.Entity<T>().HasQueryFilter(x => x.DeletedOnUtc == null)`
- Soft-deleted records excluded from queries automatically

**Entity Relationships:**
- **UserAccount**: Local user mirror (1-to-many with Listings)
- **Listing**: Product listings (many-to-one with UserAccount, Category; 1-to-many with ListingImages)
- **ListingImage**: Image metadata with MinIO storage references
- **Category**: Self-referencing hierarchy via `ParentCategoryId`
- **Role**: Seeded from `AccountTypes` enum

**Connection String:** `Host=localhost;Port=5434;Database=oglasnik;Username=oglasnik_user;Password=oglasnik_password`

### File Storage (MinIO)

- S3-compatible object storage
- API endpoint: `http://localhost:9000`
- Web console: `http://localhost:9001` (credentials: minioadmin/minioadmin123)
- Image path pattern: `listings/{userId}/{listingId}/{guid}-{extension}`
- `IMinioService` handles upload/download/delete operations
- Metadata stored in `ListingImage` entity, files stored in MinIO

### Transaction Management

Pattern used in `ListingsService`:
```csharp
using var transaction = await _dbContext.Database.BeginTransactionAsync();
try
{
    // Database operations
    await _dbContext.SaveChangesAsync();
    // File operations
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}
```

## Docker Services

Four services run in Docker:
1. **keycloak-db** (port 5433): Keycloak's user/realm data
2. **app-db** (port 5434): Application data (listings, messages, etc.)
3. **keycloak** (port 8080): Identity provider
4. **minio** (ports 9000/9001): Object storage

All services connected via `oglasnik-network` bridge network.

## Important Implementation Details

### Client

**React 19 Features:**
- Uses `react-jsx` transform (no need to import React in components)
- TypeScript strict mode enabled
- Separate tsconfig for app code (`tsconfig.app.json`) and config files (`tsconfig.node.json`)

**Type Definitions:**
- Enums defined as const objects due to `erasableSyntaxOnly`:
  ```typescript
  const ListingType = { Selling: 1, Buying: 2 } as const
  type ListingType = typeof ListingType[keyof typeof ListingType]
  ```

**API Request Wrapper Options:**
- `showLoading`: Toggle global spinner
- `showSuccessToast`: Display success notification
- `showErrorToast`: Display error notification
- `successMessage`: Custom success text
- `onSuccess`, `onError`: Callback functions

### Server

**Automatic Operations on Startup:**
1. Database migrations applied if pending
2. Development database seeding (roles, categories)
3. Serilog logs to console and rolling files in `logs/` directory

**Keycloak Service:**
- Admin token caching with automatic refresh (60s before expiry)
- User creation, authentication, password management
- Settings from `appsettings.Development.json` Keycloak section

**Validation Patterns (in `Oglasnik.Contracts/Helpers/Constants.cs`):**
- Email regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- Password regex: Requires 8+ chars, number, lowercase, uppercase, special char

**CORS Configuration:**
- Development: Allows all origins (`AllowAnyOrigin()`)
- Production: Should be restricted to specific domains

### Keycloak

- Admin console: `http://localhost:8080` (admin/admin)
- Realm: `Oglasnik`
- Client ID: `oglasnik-web` (frontend), `oglasnik-api` (backend)
- Authority URL: `http://localhost:8080/realms/Oglasnik`
- JWT validation: issuer, audience, lifetime, signing key

## Routing Structure

Frontend routes (all wrapped in Layout):
- `/` - Home page with listings
- `/signin`, `/signup` - Authentication pages
- `/forgot-password`, `/reset-password` - Password recovery
- `/add-listing` - Create new listing
- `/messages` - User messaging
- `/settings` - Account settings
- `/privacy`, `/terms`, `/contact` - Legal/info pages

Backend API endpoints:
- `POST /api/register` - User registration (creates Keycloak user + local UserAccount)
- `POST /api/login` - User authentication (returns JWT tokens)
- `POST /api/listings` - Create listing (requires authentication)
- `GET /api/health` - Health check (anonymous)

## Known Implementation Notes

1. **User ID Mapping** (`CreateListing.cs:46`):
   - Currently hardcoded to `userId = 1`
   - Should use `ICurrentUserService.GetUserId()` to get authenticated user ID from claims

2. **Authorization Enforcement** (`CreateListing.cs:23`):
   - TODO comment indicates need to re-enable `Policies(Constants.RegisteredUserOrAbovePolicy)`

3. **Internationalization**:
   - Language files use nested structure: `t('auth.signIn.title')`
   - Default values supported: `t('key', 'fallback text')`

4. **Theme Persistence**:
   - Stored in localStorage as 'theme'
   - Applies 'dark' class to document.documentElement
   - System preference detected on first load
