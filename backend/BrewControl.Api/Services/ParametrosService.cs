using BrewControl.Api.DTOs;
using BrewControl.Api.Models;
using BrewControl.Api.Repositories;

namespace BrewControl.Api.Services;

// Resultado das operações de escrita de parâmetros, permitindo ao controller
// traduzir cada caso de negócio no status HTTP adequado sem conhecer as regras.
public enum ResultadoParametros
{
    Sucesso,
    CervejaNaoEncontrada,
    JaPossuiParametros,
    ParametrosNaoEncontrados
}

// Regras de negócio e mapeamento dos ParametrosFermentativos, sempre
// vinculados a uma cerveja (relação 1:1). Orquestra os repositórios de
// parâmetros e de cervejas; nunca acessa o banco diretamente.
public class ParametrosService
{
    private readonly ParametrosRepository _repository;
    private readonly CervejasRepository _cervejasRepository;

    public ParametrosService(ParametrosRepository repository, CervejasRepository cervejasRepository)
    {
        _repository = repository;
        _cervejasRepository = cervejasRepository;
    }

    // Retorna null quando a cerveja não tem parâmetros definidos (controller traduz em 404).
    public async Task<ParametrosResponse?> ObterPorCervejaIdAsync(int cervejaId)
    {
        var parametros = await _repository.ObterPorCervejaIdAsync(cervejaId);
        return parametros is null ? null : MapearParaResponse(parametros);
    }

    // Cria os parâmetros de uma cerveja. Falha se a cerveja não existe ou se
    // já possui parâmetros, pois a relação é de no máximo um por cerveja.
    public async Task<(ResultadoParametros Status, ParametrosResponse? Dados)> CriarAsync(
        int cervejaId, ParametrosRequest request)
    {
        if (!await _cervejasRepository.ExisteAsync(cervejaId))
        {
            return (ResultadoParametros.CervejaNaoEncontrada, null);
        }

        var existentes = await _repository.ObterPorCervejaIdAsync(cervejaId);
        if (existentes is not null)
        {
            return (ResultadoParametros.JaPossuiParametros, null);
        }

        var parametros = new ParametrosFermentativos
        {
            CervejaId = cervejaId,
            TemperaturaMinima = request.TemperaturaMinima,
            TemperaturaMaxima = request.TemperaturaMaxima,
            PhMinimo = request.PhMinimo,
            PhMaximo = request.PhMaximo,
            ExtratoPMinimo = request.ExtratoPMinimo,
            ExtratoPMaximo = request.ExtratoPMaximo
        };

        var criados = await _repository.AdicionarAsync(parametros);
        return (ResultadoParametros.Sucesso, MapearParaResponse(criados));
    }

    // Atualiza os parâmetros existentes de uma cerveja.
    public async Task<(ResultadoParametros Status, ParametrosResponse? Dados)> AtualizarAsync(
        int cervejaId, ParametrosRequest request)
    {
        if (!await _cervejasRepository.ExisteAsync(cervejaId))
        {
            return (ResultadoParametros.CervejaNaoEncontrada, null);
        }

        var parametros = await _repository.ObterPorCervejaIdAsync(cervejaId);
        if (parametros is null)
        {
            return (ResultadoParametros.ParametrosNaoEncontrados, null);
        }

        parametros.TemperaturaMinima = request.TemperaturaMinima;
        parametros.TemperaturaMaxima = request.TemperaturaMaxima;
        parametros.PhMinimo = request.PhMinimo;
        parametros.PhMaximo = request.PhMaximo;
        parametros.ExtratoPMinimo = request.ExtratoPMinimo;
        parametros.ExtratoPMaximo = request.ExtratoPMaximo;

        await _repository.AtualizarAsync(parametros);
        return (ResultadoParametros.Sucesso, MapearParaResponse(parametros));
    }

    private static ParametrosResponse MapearParaResponse(ParametrosFermentativos parametros) => new()
    {
        Id = parametros.Id,
        CervejaId = parametros.CervejaId,
        TemperaturaMinima = parametros.TemperaturaMinima,
        TemperaturaMaxima = parametros.TemperaturaMaxima,
        PhMinimo = parametros.PhMinimo,
        PhMaximo = parametros.PhMaximo,
        ExtratoPMinimo = parametros.ExtratoPMinimo,
        ExtratoPMaximo = parametros.ExtratoPMaximo
    };
}
