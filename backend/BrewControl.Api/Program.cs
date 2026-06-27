using BrewControl.Api.Data;
using BrewControl.Api.DTOs;
using BrewControl.Api.Enums;
using BrewControl.Api.Models;
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

// Captura exceções não tratadas e retorna ProblemDetails JSON padronizado,
// evitando que stack traces vazem para o cliente.
app.UseExceptionHandler(appBuilder =>
{
    appBuilder.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(new
        {
            type = "https://tools.ietf.org/html/rfc9110#section-15.6.1",
            title = "Erro interno do servidor",
            status = 500,
            detail = "Ocorreu um erro inesperado. Tente novamente mais tarde."
        });
    });
});

// Aplica migrations pendentes automaticamente ao iniciar.
// Garante que o banco esteja atualizado em Docker sem comandos manuais.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Cervejas.Any())
    {
        var cervejas = new[]
        {
            new Cerveja { Nome = "IPA Artesanal", Estilo = "IPA" },
            new Cerveja { Nome = "Pilsen Premium", Estilo = "Pilsen" },
            new Cerveja { Nome = "Weizen Especial", Estilo = "Weizen" },
        };
        db.Cervejas.AddRange(cervejas);
        db.SaveChanges();

        var tanques = new[]
        {
            new Tanque { Nome = "Tanque A", Capacidade = 500 },
            new Tanque { Nome = "Tanque B", Capacidade = 1000 },
            new Tanque { Nome = "Tanque C", Capacidade = 750 },
        };
        db.Tanques.AddRange(tanques);
        db.SaveChanges();

        var paramIpa = new ParametrosFermentativos
        {
            CervejaId = cervejas[0].Id,
            TemperaturaMinima = 18, TemperaturaMaxima = 22,
            PhMinimo = 4.0m, PhMaximo = 4.5m,
            ExtratoPMinimo = 3.0m, ExtratoPMaximo = 5.0m,
        };
        var paramPilsen = new ParametrosFermentativos
        {
            CervejaId = cervejas[1].Id,
            TemperaturaMinima = 8, TemperaturaMaxima = 12,
            PhMinimo = 4.2m, PhMaximo = 4.6m,
            ExtratoPMinimo = 2.0m, ExtratoPMaximo = 3.5m,
        };
        var paramWeizen = new ParametrosFermentativos
        {
            CervejaId = cervejas[2].Id,
            TemperaturaMinima = 16, TemperaturaMaxima = 20,
            PhMinimo = 4.1m, PhMaximo = 4.6m,
            ExtratoPMinimo = 2.5m, ExtratoPMaximo = 4.0m,
        };
        db.ParametrosFermentativos.AddRange(paramIpa, paramPilsen, paramWeizen);
        db.SaveChanges();

        var agora = DateTime.UtcNow;
        var registrosIpa = new (int dias, decimal temp, decimal ph, decimal extrato)[]
        {
            (5, 19.5m, 4.2m, 4.8m),
            (4, 20.1m, 4.3m, 4.2m),
            (3, 22.8m, 4.4m, 3.8m),
            (2, 24.5m, 4.5m, 3.2m),
            (1, 21.0m, 4.2m, 3.0m),
        };

        foreach (var (dias, temp, ph, extrato) in registrosIpa)
        {
            var req = new RegistroRequest
            {
                DataHora = agora.AddDays(-dias),
                CervejaId = cervejas[0].Id, TanqueId = tanques[0].Id,
                NumeroDeLote = "IPA-2026-001",
                Temperatura = temp, Ph = ph, Extrato = extrato,
            };
            db.RegistrosFermentativos.Add(new RegistroFermentativo
            {
                DataHora = agora.AddDays(-dias),
                CervejaId = req.CervejaId, TanqueId = req.TanqueId,
                NumeroDeLote = req.NumeroDeLote,
                Temperatura = req.Temperatura, Ph = req.Ph, Extrato = req.Extrato,
                Classificacao = RegistrosService.Classificar(req, paramIpa),
            });
        }

        var registrosPilsen = new (int dias, decimal temp, decimal ph, decimal extrato)[]
        {
            (3, 9.0m, 4.3m, 3.2m),
            (2, 11.5m, 4.7m, 2.8m),
            (1, 10.0m, 4.4m, 2.5m),
        };

        foreach (var (dias, temp, ph, extrato) in registrosPilsen)
        {
            var req = new RegistroRequest
            {
                DataHora = agora.AddDays(-dias),
                CervejaId = cervejas[1].Id, TanqueId = tanques[1].Id,
                NumeroDeLote = "PIL-2026-003",
                Temperatura = temp, Ph = ph, Extrato = extrato,
            };
            db.RegistrosFermentativos.Add(new RegistroFermentativo
            {
                DataHora = agora.AddDays(-dias),
                CervejaId = req.CervejaId, TanqueId = req.TanqueId,
                NumeroDeLote = req.NumeroDeLote,
                Temperatura = req.Temperatura, Ph = req.Ph, Extrato = req.Extrato,
                Classificacao = RegistrosService.Classificar(req, paramPilsen),
            });
        }

        db.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(FrontendCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
