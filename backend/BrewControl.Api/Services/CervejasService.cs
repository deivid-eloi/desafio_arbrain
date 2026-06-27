using BrewControl.Api.DTOs;
using BrewControl.Api.Enums;
using BrewControl.Api.Models;
using BrewControl.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace BrewControl.Api.Services;

// Regras de negócio e mapeamento entre entidade e DTO para Cervejas.
// Orquestra o repositório; nunca acessa o banco diretamente.
public class CervejasService
{
    private readonly CervejasRepository _repository;

    public CervejasService(CervejasRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<CervejaResponse>> ObterTodasAsync()
    {
        var cervejas = await _repository.ObterTodasAsync();
        return cervejas.Select(MapearParaResponse).ToList();
    }

    public async Task<CervejaResponse?> ObterPorIdAsync(int id)
    {
        var cerveja = await _repository.ObterPorIdAsync(id);
        return cerveja is null ? null : MapearParaResponse(cerveja);
    }

    public async Task<CervejaResponse> CriarAsync(CervejaRequest request)
    {
        var cerveja = new Cerveja
        {
            Nome = request.Nome,
            Estilo = request.Estilo
        };

        var criada = await _repository.AdicionarAsync(cerveja);
        return MapearParaResponse(criada);
    }

    // Retorna null quando a cerveja não existe, para o controller traduzir em 404.
    public async Task<CervejaResponse?> AtualizarAsync(int id, CervejaRequest request)
    {
        var cerveja = await _repository.ObterPorIdAsync(id);
        if (cerveja is null)
        {
            return null;
        }

        cerveja.Nome = request.Nome;
        cerveja.Estilo = request.Estilo;

        await _repository.AtualizarAsync(cerveja);
        return MapearParaResponse(cerveja);
    }

    public async Task<ResultadoExclusao> RemoverAsync(int id)
    {
        var cerveja = await _repository.ObterPorIdAsync(id);
        if (cerveja is null)
            return ResultadoExclusao.NaoEncontrado;

        try
        {
            await _repository.RemoverAsync(cerveja);
            return ResultadoExclusao.Sucesso;
        }
        catch (DbUpdateException)
        {
            return ResultadoExclusao.PossuiDependencias;
        }
    }

    private static CervejaResponse MapearParaResponse(Cerveja cerveja) => new()
    {
        Id = cerveja.Id,
        Nome = cerveja.Nome,
        Estilo = cerveja.Estilo
    };
}
