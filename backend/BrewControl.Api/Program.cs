using BrewControl.Api.Data;
using BrewControl.Api.Repositories;
using BrewControl.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Registra o DbContext com o provider PostgreSQL (Npgsql).
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Libera o frontend (Vite) a consumir a API durante o desenvolvimento.
const string FrontendCorsPolicy = "FrontendCorsPolicy";
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()));

// Injeção de dependência das camadas de serviço e repositório.
builder.Services.AddScoped<CervejasRepository>();
builder.Services.AddScoped<CervejasService>();
builder.Services.AddScoped<TanquesRepository>();
builder.Services.AddScoped<TanquesService>();
builder.Services.AddScoped<ParametrosRepository>();
builder.Services.AddScoped<ParametrosService>();
builder.Services.AddScoped<RegistrosRepository>();
builder.Services.AddScoped<RegistrosService>();
builder.Services.AddScoped<DashboardService>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Aplica migrations pendentes automaticamente ao iniciar.
// Garante que o banco esteja atualizado em Docker sem comandos manuais.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors(FrontendCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
