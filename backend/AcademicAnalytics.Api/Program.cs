using MongoDB.Driver;
using Microsoft.Extensions.Options;
using AcademicAnalytics.Api.Settings;
using AcademicAnalytics.Api.Services;
using AcademicAnalytics.Api.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings"));

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});
builder.Services.AddSingleton<MongoDbContext>();

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));
var jwtSecretKey = builder.Configuration["JwtSettings:SecretKey"]!;
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"]!;
var jwtAudience = builder.Configuration["JwtSettings:Audience"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<AnalyticsService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

app.MapGet("/api/ping", async (IMongoClient mongoClient) =>
{
    try
    {
        var databases = await mongoClient.ListDatabaseNamesAsync();
        var list = await databases.ToListAsync();
        return Results.Ok(new { connected = true, databases = list });
    }
    catch (Exception ex)
    {
        return Results.Json(new { connected = false, error = ex.Message }, statusCode: 500);
    }
});

app.MapPost("/auth/login", async (LoginRequest request, AuthService authService) =>
{
    var result = await authService.LoginAsync(request);

    if (result is null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(result);
});

app.MapGet("/students/search", async (StudentService studentService, string? name, string? program, double? minGpa, double? maxGpa) =>
{
    var query = new StudentSearchQuery
    {
        Name = name,
        Program = program,
        MinGpa = minGpa,
        MaxGpa = maxGpa
    };

    var results = await studentService.SearchAsync(query);
    return Results.Ok(results);
})
.RequireAuthorization(policy => policy.RequireRole("Administrator"));

app.MapGet("/students/{id}/history", async (string id, StudentService studentService) =>
{
    var result = await studentService.GetHistoryAsync(id);

    if (result is null)
    {
        return Results.NotFound(new { message = $"No student found with id '{id}'" });
    }

    return Results.Ok(result);
});
app.MapGet("/students/at-risk", async (StudentService studentService) =>
{
    var results = await studentService.GetAtRiskAsync();
    return Results.Ok(results);
})
.RequireAuthorization();
app.MapGet("/analytics/dashboard", async (AnalyticsService analyticsService) =>
{
    var result = await analyticsService.GetDashboardAsync();
    return Results.Ok(result);
});
app.MapGet("/analytics/comparison", async (AnalyticsService analyticsService, string semesterA, string semesterB) =>
{
    var result = await analyticsService.GetComparisonAsync(semesterA, semesterB);
    return Results.Ok(result);
})
.RequireAuthorization(policy => policy.RequireRole("Administrator"));
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
