using BrewControl.Api.DTOs;
using BrewControl.Api.Enums;
using BrewControl.Api.Models;
using BrewControl.Api.Repositories;

namespace BrewControl.Api.Services;

// Resultado das operações de escrita de registros, para o controller
// traduzir cada caso de negócio no status HTTP adequado.
public enum ResultadoRegistro
{
    Sucesso,
    CervejaNaoEncontrada,
    TanqueNaoEncontrado,
    ParametrosNaoDefinidos
}

// Regras de negócio dos Registros Fermentativos. Contém a lógica de
// classificação automática — regra central do sistema, que NUNCA deve
// ser calculada no Controller ou no Frontend.
public class RegistrosService
{
    private readonly RegistrosRepository _repository;
    private readonly CervejasRepository _cervejasRepository;
    private readonly TanquesRepository _tanquesRepository;
    private readonly ParametrosRepository _parametrosRepository;

    public RegistrosService(
        RegistrosRepository repository,
        CervejasRepository cervejasRepository,
        TanquesRepository tanquesRepository,
        ParametrosRepository parametrosRepository)
    {
        _repository = repository;
        _cervejasRepository = cervejasRepository;
        _tanquesRepository = tanquesRepository;
        _parametrosRepository = parametrosRepository;
    }

    public async Task<List<RegistroResponse>> ObterTodosAsync()
    {
        var registros = await _repository.ObterTodosAsync();
        return registros.Select(MapearParaResponse).ToList();
    }

    public async Task<RegistroResponse?> ObterPorIdAsync(int id)
    {
        var registro = await _repository.ObterPorIdAsync(id);
        return registro is null ? null : MapearParaResponse(registro);
    }

    public async Task<List<RegistroResponse>> ObterPorLoteAsync(string numeroDeLote)
    {
        var registros = await _repository.ObterPorLoteAsync(numeroDeLote);
        return registros.Select(MapearParaResponse).ToList();
    }

    // Cria um registro fermentativo. Valida a existência da cerveja,
    // tanque e parâmetros antes de calcular a classificação automática.
    public async Task<(ResultadoRegistro Status, RegistroResponse? Dados)> CriarAsync(
        RegistroRequest request)
    {
        if (await _cervejasRepository.ObterPorIdAsync(request.CervejaId) is null)
            return (ResultadoRegistro.CervejaNaoEncontrada, null);

        if (await _tanquesRepository.ObterPorIdAsync(request.TanqueId) is null)
            return (ResultadoRegistro.TanqueNaoEncontrado, null);

        var parametros = await _parametrosRepository.ObterPorCervejaIdAsync(request.CervejaId);
        if (parametros is null)
            return (ResultadoRegistro.ParametrosNaoDefinidos, null);

        var registro = new RegistroFermentativo
        {
            // Npgsql exige UTC para colunas timestamp with time zone.
            DataHora = DateTime.SpecifyKind(request.DataHora, DateTimeKind.Utc),
            CervejaId = request.CervejaId,
            TanqueId = request.TanqueId,
            NumeroDeLote = request.NumeroDeLote,
            Temperatura = request.Temperatura,
            Ph = request.Ph,
            Extrato = request.Extrato,
            Observacoes = request.Observacoes,
            Classificacao = Classificar(request, parametros)
        };

        var criado = await _repository.AdicionarAsync(registro);
        return (ResultadoRegistro.Sucesso, MapearParaResponse(criado));
    }

    // Regra de negócio central — classificação automática.
    // Delega à fonte única de verdade (ClassificacaoHelper), que concentra a
    // lógica pura e é coberta por testes de unidade isolados.
    internal static ClassificacaoRegistro Classificar(
        RegistroRequest request, ParametrosFermentativos parametros)
        => ClassificacaoHelper.Classificar(request, parametros);

    private static RegistroResponse MapearParaResponse(RegistroFermentativo registro) => new()
    {
        Id = registro.Id,
        DataHora = registro.DataHora,
        CervejaId = registro.CervejaId,
        CervejaNome = registro.Cerveja?.Nome ?? string.Empty,
        TanqueId = registro.TanqueId,
        TanqueNome = registro.Tanque?.Nome ?? string.Empty,
        NumeroDeLote = registro.NumeroDeLote,
        Temperatura = registro.Temperatura,
        Ph = registro.Ph,
        Extrato = registro.Extrato,
        Observacoes = registro.Observacoes,
        Classificacao = registro.Classificacao.ToString()
    };
}
