using API.Mappings;
using Core.Entities;
using Infrastructure.Data;
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

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<BlogContext>();



var app = builder.Build();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
    .WithOrigins("http://localhost:5173", "https://localhost:5173"));

app.MapControllers();
app.MapGroup("api").MapIdentityApi<AppUser>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
