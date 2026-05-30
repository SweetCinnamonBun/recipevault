using API.Mappings;
using API.Services;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ---------------- LOGGING ----------------
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(
    new LoggerConfiguration()
        .WriteTo.Console()
        .MinimumLevel.Information()
        .CreateLogger()
);

// ---------------- SERVICES ----------------
builder.Services.AddControllers();
builder.Services.AddOpenApi();
// DB
builder.Services.AddDbContext<BlogContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// CORS (optional for API testing tools)
builder.Services.AddCors();

// Swagger (THIS IS REQUIRED)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// App services
builder.Services.AddSingleton<AzureBlobStorageService>();
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<BlogContext>();

var app = builder.Build();

// ================= PIPELINE =================

// Swagger FIRST (critical)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
        c.RoutePrefix = "swagger";
    });
}

// HTTPS
app.UseHttpsRedirection();

// CORS
app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:5173"));

// AUTH
app.UseAuthorization();

// // STATIC FILES (safe now since no SPA)
app.UseStaticFiles();

// ROUTES
app.MapControllers();

app.MapGroup("api").MapIdentityApi<AppUser>();

app.Run();