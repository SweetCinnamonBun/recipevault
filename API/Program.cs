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
builder.Services.AddOpenApi();

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


builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();

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

app.UseHttpsRedirection();

app.UseAuthorization();




if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
 {
     options.SwaggerEndpoint("/openapi/v1.json", "api");
 });
}
;


// ✅ Static files AFTER routing
app.UseStaticFiles();
app.UseDefaultFiles();

// ✅ API endpoints
app.MapControllers();
app.MapGroup("api").MapIdentityApi<AppUser>();

app.MapFallbackToController("Index", "Fallback");

app.Run();