using Serilog;
using FastEndpoints;
using FastEndpoints.Swagger;
using OglasnikApi.Configuration;
using OglasnikApi.Middleware;
using Oglasnik.Data.Configuration;
using Oglasnik.Data;
using Microsoft.EntityFrameworkCore;
using Oglasnik.Data.DbInitializer;
using Oglasnik.Contracts.Configuration;
using Oglasnik.Contracts.Services;
using Oglasnik.Business.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Keycloak settings
builder.Services.Configure<KeycloakSettings>(builder.Configuration.GetSection("Keycloak"));

// Configure MinIO settings
builder.Services.Configure<MinioSettings>(builder.Configuration.GetSection("MinIO"));

// Register Keycloak service
builder.Services.AddHttpClient<IKeycloakService, KeycloakService>();

// Register UserAccount service
builder.Services.AddScoped<IUserAccountService, UserAccountService>();

// Register CurrentUser service
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// Register MinIO service
builder.Services.AddSingleton<IMinioService, MinioService>();

// Register Listings service
builder.Services.AddScoped<IListingsService, ListingsService>();

builder.Services
    .AddDatabase(builder.Configuration)
    .AddKeycloakAuthentication(builder.Configuration)
    .AddFastEndpoints()
    .SwaggerDocument();

var app = builder.Build();

using (var serviceScope = app.Services.CreateScope())
{
	var dbContext = serviceScope.ServiceProvider.GetRequiredService<DatabaseContext>();
	if (dbContext.Database.GetPendingMigrations().Any())
	{
		dbContext.Database.Migrate();
	}
}

if (app.Environment.IsDevelopment())
{
	AppDbInitializer.Seed(app, builder.Configuration);
}

app.UseAuthentication();
app.UseMiddleware<UserClaimsEnrichmentMiddleware>();
app.UseAuthorization();

app.UseFastEndpoints()
    .UseSwaggerGen();

app.UseCors("AllowAll");

app.Run();