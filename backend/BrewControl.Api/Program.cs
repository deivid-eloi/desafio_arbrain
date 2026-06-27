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

        // Cria os registros de um lote a partir de uma curva fermentativa
        // pré-definida. A classificação é SEMPRE calculada por
        // RegistrosService.Classificar (regra central) — nunca hardcoded.
        // Cada registro recebe hora/minuto próprios para refletir apontamentos
        // reais ao longo do dia, em vez de um único timestamp repetido.
        var hojeUtc = DateTime.UtcNow.Date;

        void SemearLote(
            string lote, int cervejaId, int tanqueId, ParametrosFermentativos parametros,
            (int dias, int hora, int minuto, decimal temp, decimal ph, decimal extrato)[] curva)
        {
            foreach (var (dias, hora, minuto, temp, ph, extrato) in curva)
            {
                var req = new RegistroRequest
                {
                    DataHora = hojeUtc.AddDays(-dias).AddHours(hora).AddMinutes(minuto),
                    CervejaId = cervejaId, TanqueId = tanqueId,
                    NumeroDeLote = lote,
                    Temperatura = temp, Ph = ph, Extrato = extrato,
                };
                db.RegistrosFermentativos.Add(new RegistroFermentativo
                {
                    DataHora = req.DataHora,
                    CervejaId = req.CervejaId, TanqueId = req.TanqueId,
                    NumeroDeLote = req.NumeroDeLote,
                    Temperatura = req.Temperatura, Ph = req.Ph, Extrato = req.Extrato,
                    Classificacao = RegistrosService.Classificar(req, parametros),
                });
            }
        }

        // IPA-2026-001 (Tanque A): curva de ale — temperatura sobe até o pico e
        // recua, extrato cai continuamente, pH estável com leve variação no fim.
        SemearLote("IPA-2026-001", cervejas[0].Id, tanques[0].Id, paramIpa, new[]
        {
            (5,  8, 30, 18.5m, 4.2m, 4.9m), // dentro do padrão
            (4, 14, 15, 20.2m, 4.3m, 4.3m), // dentro do padrão
            (3,  9, 45, 21.8m, 4.3m, 3.6m), // dentro do padrão
            (2, 16, 50, 23.5m, 4.4m, 3.1m), // temperatura acima do teto → fora do padrão
            (1, 11, 20, 20.5m, 4.6m, 2.8m), // pH e extrato fora da faixa → atenção
        });

        // PIL-2026-003 (Tanque B): curva de lager — fermentação fria e controlada,
        // com leve sobre-atenuação (extrato abaixo do mínimo) no último apontamento.
        SemearLote("PIL-2026-003", cervejas[1].Id, tanques[1].Id, paramPilsen, new[]
        {
            (3,  7, 50,  9.2m, 4.3m, 3.4m), // dentro do padrão
            (2, 13, 30, 11.0m, 4.4m, 2.7m), // dentro do padrão
            (1, 18, 10, 10.3m, 4.5m, 1.8m), // extrato abaixo do mínimo → atenção
        });

        // WEI-2026-004 (Tanque C): curva de weizen — fermentação quente que
        // ultrapassa o teto de temperatura no pico e depois recua.
        SemearLote("WEI-2026-004", cervejas[2].Id, tanques[2].Id, paramWeizen, new[]
        {
            (4,  8,  5, 16.5m, 4.2m, 3.9m), // dentro do padrão
            (3, 15, 40, 18.8m, 4.3m, 3.2m), // dentro do padrão
            (2, 10, 25, 20.5m, 4.5m, 2.8m), // temperatura acima do teto → fora do padrão
            (1, 17, 15, 18.0m, 4.7m, 2.4m), // pH e extrato fora da faixa → atenção
        });

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
