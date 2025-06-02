using Microsoft.EntityFrameworkCore;
using Backend.Hubs;
using Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// anslut till Mysql databas
builder.Services.AddDbContext<ChatDbContext>(options =>
    options.UseMySql("Server=Server;port=port;Database=Database;User=User;Password=Password", new MySqlServerVersion(new Version()))
);

builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddSingleton<TempDb>();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("reactApp", builder =>
    {
        builder.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

var apiKey = builder.Configuration.GetValue<string>("JWTConfig:Key");

apiKey ??= "";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "http://localhost:5218",
            ValidAudience = "http://localhost:5173",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(apiKey))
        };
    });

var app = builder.Build();

app.UseCors("reactApp");

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/Chat");

app.Run();
