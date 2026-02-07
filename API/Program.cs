using API.Mappings;
using API.Middleware;
using API.Repositories;
using API.Repositories.Interfaces;
using API.Services;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var logger = new LoggerConfiguration().WriteTo.Console().MinimumLevel.Information().CreateLogger();
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

builder.Services.AddControllers();
builder.Services.AddDbContext<BlogContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();

builder.Services.AddSingleton<AzureBlobStorageService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    return new AzureBlobStorageService(configuration);
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<BlogContext>();

// builder.Services.AddScoped<IRecipeRepository, SQLRecipeRepository>();





var app = builder.Build();

app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:5173", "https://localhost:5173"));

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.RoutePrefix = "swagger";
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "RecipeVault API V1");
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

// ✅ API endpoints
app.MapControllers();
app.MapGroup("api").MapIdentityApi<AppUser>();

// ✅ Static files AFTER routing
app.UseStaticFiles();
app.UseDefaultFiles();

// ❗ SPA fallback MUST be last
app.MapFallbackToController("Index", "Fallback");

app.Run();