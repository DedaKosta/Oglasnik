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

**Infrastructure:**
- Docker Compose for local development
- Keycloak 23.0 for identity management
- PostgreSQL 16 (separate databases for Keycloak and application)

### Project Structure

**Client (`Client/`):**
- `src/components/` - React components (HomePage, SignIn, SignUp, Layout, Header, Footer, etc.)
- `src/contexts/` - React contexts (ThemeContext, LayoutContext)
- `src/store/` - Zustand stores (authStore, appStore)
- `src/services/` - API service layer (authService)
- `src/locales/` - Translation files for i18next
- `src/config/` - API configuration
- `src/types/` - TypeScript type definitions

**Server (`Server/Oglasnik/`):**
- `Oglasnik.WebAPI/` - API layer with FastEndpoints
  - `Endpoints/` - API endpoint handlers
  - `Validators/` - Request validators
  - `Program.cs` - Application entry point
- `Oglasnik.Business/` - Business logic layer
  - `Services/` - Service implementations (KeycloakService)
- `Oglasnik.Data/` - Data access layer
  - `Entities/` - EF Core entity models
  - `Migrations/` - Database migrations
  - `DatabaseContext.cs` - EF Core DbContext
- `Oglasnik.Contracts/` - Shared contracts and DTOs
  - `Records/` - Request/response records
  - `Services/` - Service interfaces
  - `Configuration/` - Configuration classes

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
dotnet ef migrations add MigrationName --project Oglasnik.Data --startup-project Oglasnik.WebAPI
dotnet ef database update --project Oglasnik.Data --startup-project Oglasnik.WebAPI
```

### Docker (Keycloak + Databases)
```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose down -v         # Stop and remove volumes
docker-compose ps              # Check service status
docker-compose logs -f keycloak  # View Keycloak logs
```

## Key Architectural Patterns

### State Management
- **Zustand stores** for global state with persist middleware
- `authStore` handles authentication state, user data, and JWT tokens
- `appStore` for general application state
- Store exports centralized in `src/store/index.ts`

### Authentication Flow
- Keycloak handles user authentication and token management
- Backend validates JWT tokens from Keycloak
- Client stores tokens in localStorage via Zustand persist middleware
- API base URL: `http://localhost:5030`
- Keycloak URL: `http://localhost:8080` (realm: `oglasnik`)

### API Communication
- Centralized API configuration in `src/config/api.ts`
- Service layer pattern (`authService`) abstracts API calls
- Type-safe request/response with TypeScript interfaces in `src/types/api.ts`
- Backend uses FastEndpoints pattern (minimal APIs with validation)

### Internationalization
- i18next with 8 supported languages
- Translation files in `src/locales/*.json`
- Language switcher component available
- Default language: English, fallback: English

### Theming
- ThemeContext provides dark/light mode
- Tailwind CSS with utility-first approach
- Theme persisted in localStorage

### Backend Architecture
- **Clean Architecture** with separation of concerns:
  - WebAPI: HTTP layer, endpoints, validators
  - Business: Service implementations, business logic
  - Data: Database access, Entity Framework, migrations
  - Contracts: Shared interfaces, DTOs, configurations
- **FastEndpoints** pattern for endpoint organization
- **Keycloak integration** via IKeycloakService for user management
- **Database seeding** in development mode via AppDbInitializer

## Docker Services

Three PostgreSQL databases run in Docker:
1. **keycloak-db** (port 5433): Keycloak's user/realm data
2. **app-db** (port 5434): Application data (listings, messages, etc.)
3. **keycloak** (port 8080): Identity provider

All services connected via `oglasnik-network` bridge network.

## Important Notes

### Client
- React 19 uses `react-jsx` transform (no need to import React in components)
- TypeScript strict mode enabled
- Separate tsconfig for app code and Node/Vite config files
- ESLint uses flat config format

### Server
- Runs database migrations automatically on startup if pending
- Seeds test data in development environment
- CORS configured to allow all origins (development only)
- Serilog logs to console and daily rolling files in `logs/` directory
- JWT authentication configured via `.AddKeycloakAuthentication()`

### Keycloak
- Admin credentials: admin/admin (development)
- Realm: `oglasnik`
- Client ID: `oglasnik-web` (frontend), `oglasnik-api` (backend)
- See KEYCLOAK_SETUP.md for detailed configuration
- See DOCKER_COMMANDS.md for Docker operations

## Routing Structure

- `/` - Home page with listings
- `/signin`, `/signup` - Authentication pages
- `/forgot-password`, `/reset-password` - Password recovery
- `/add-listing` - Create new listing
- `/messages` - User messaging
- `/settings` - Account settings
- `/privacy`, `/terms`, `/contact` - Legal/info pages

All routes wrapped in Layout component with Header, Footer, and Sidebar.
