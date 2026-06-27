using BrewControl.Api.DTOs;
using BrewControl.Api.Enums;
using BrewControl.Api.Models;
using BrewControl.Api.Services;
using Xunit;

namespace BrewControl.Tests.Services;

// Testes de unidade da regra de negócio CENTRAL — classificação automática.
// Cobrem os cenários DentroDopadrao, Atencao e ForaDoPadrao diretamente sobre a
// lógica pura (ClassificacaoHelper), sem banco, HTTP ou qualquer dependência externa.
public class ClassificacaoTests
{
    // Faixa de referência padrão usada por todos os cenários:
    //   Temperatura 18–22 °C | pH 4.0–4.5 | Extrato 3.0–5.0 °P
    private static ParametrosFermentativos CriarParametros() => new()
    {
        TemperaturaMinima = 18m,
        TemperaturaMaxima = 22m,
        PhMinimo = 4.0m,
        PhMaximo = 4.5m,
        ExtratoPMinimo = 3.0m,
        ExtratoPMaximo = 5.0m,
    };

    private static RegistroRequest CriarRegistro(decimal temperatura, decimal ph, decimal extrato) => new()
    {
        DataHora = DateTime.UtcNow,
        CervejaId = 1,
        TanqueId = 1,
        NumeroDeLote = "TESTE-001",
        Temperatura = temperatura,
        Ph = ph,
        Extrato = extrato,
    };

    [Fact]
    public void Classificar_DeveRetornarDentroDopadrao_QuandoTodosParametrosDentroDoIntervalo()
    {
        var parametros = CriarParametros();
        var registro = CriarRegistro(temperatura: 20m, ph: 4.2m, extrato: 4.0m);

        var resultado = ClassificacaoHelper.Classificar(registro, parametros);

        Assert.Equal(ClassificacaoRegistro.DentroDopadrao, resultado);
    }

    [Fact]
    public void Classificar_DeveRetornarAtencao_QuandoPhAcimaDoMaximo()
    {
        var parametros = CriarParametros();
        // Temperatura dentro da faixa, mas pH acima do máximo (4.5).
        var registro = CriarRegistro(temperatura: 20m, ph: 4.8m, extrato: 4.0m);

        var resultado = ClassificacaoHelper.Classificar(registro, parametros);

        Assert.Equal(ClassificacaoRegistro.Atencao, resultado);
    }

    [Fact]
    public void Classificar_DeveRetornarAtencao_QuandoExtratoAbaixoDoMinimo()
    {
        var parametros = CriarParametros();
        // Temperatura dentro da faixa, mas extrato abaixo do mínimo (3.0).
        var registro = CriarRegistro(temperatura: 20m, ph: 4.2m, extrato: 2.5m);

        var resultado = ClassificacaoHelper.Classificar(registro, parametros);

        Assert.Equal(ClassificacaoRegistro.Atencao, resultado);
    }

    [Fact]
    public void Classificar_DeveRetornarForaDoPadrao_QuandoTemperaturaAcimaDoMaximo()
    {
        var parametros = CriarParametros();
        // Temperatura acima do máximo (22) — parâmetro mais crítico.
        var registro = CriarRegistro(temperatura: 24m, ph: 4.2m, extrato: 4.0m);

        var resultado = ClassificacaoHelper.Classificar(registro, parametros);

        Assert.Equal(ClassificacaoRegistro.ForaDoPadrao, resultado);
    }

    [Fact]
    public void Classificar_DeveRetornarForaDoPadrao_QuandoTemperaturaEPhForaDoIntervalo()
    {
        var parametros = CriarParametros();
        // Temperatura tem prioridade: mesmo com o pH fora, o resultado é ForaDoPadrao.
        var registro = CriarRegistro(temperatura: 24m, ph: 4.8m, extrato: 4.0m);

        var resultado = ClassificacaoHelper.Classificar(registro, parametros);

        Assert.Equal(ClassificacaoRegistro.ForaDoPadrao, resultado);
    }
}
