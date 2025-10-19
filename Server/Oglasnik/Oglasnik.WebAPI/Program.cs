using Serilog;
using FastEndpoints;
using FastEndpoints.Swagger;
using OglasnikApi.Configuration;
using Oglasnik.Data.Configuration;
using Oglasnik.Data;
using Microsoft.EntityFrameworkCore;
using Oglasnik.Data.DbInitializer;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services
    .AddDatabase(builder.Configuration)
    .AddAuthenticationAndAuthorization(builder.Configuration)
    .AddFastEndpoints()
    .SwaggerDocument();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

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

// Use CORS
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.UseFastEndpoints()
    .UseSwaggerGen();

app.Run();