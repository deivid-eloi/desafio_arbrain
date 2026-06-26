using BrewControl.Api.DTOs;
using BrewControl.Api.Models;
using BrewControl.Api.Repositories;

namespace BrewControl.Api.Services;

// Regras de negócio e mapeamento entre entidade e DTO para Tanques.
// Orquestra o repositório; nunca acessa o banco diretamente.
public class TanquesService
{
    private readonly TanquesRepository _repository;

    public TanquesService(TanquesRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<TanqueResponse>> ObterTodosAsync()
    {
        var tanques = await _repository.ObterTodosAsync();
        return tanques.Select(MapearParaResponse).ToList();
    }

    public async Task<TanqueResponse?> ObterPorIdAsync(int id)
    {
        var tanque = await _repository.ObterPorIdAsync(id);
        return tanque is null ? null : MapearParaResponse(tanque);
    }

    public async Task<TanqueResponse> CriarAsync(TanqueRequest request)
    {
        var tanque = new Tanque
        {
            Nome = request.Nome,
            Capacidade = request.Capacidade
        };

        var criado = await _repository.AdicionarAsync(tanque);
        return MapearParaResponse(criado);
    }

    // Retorna null quando o tanque não existe, para o controller traduzir em 404.
    public async Task<TanqueResponse?> AtualizarAsync(int id, TanqueRequest request)
    {
        var tanque = await _repository.ObterPorIdAsync(id);
        if (tanque is null)
        {
            return null;
        }

        tanque.Nome = request.Nome;
        tanque.Capacidade = request.Capacidade;

        await _repository.AtualizarAsync(tanque);
        return MapearParaResponse(tanque);
    }

    // Retorna false quando o tanque não existe, para o controller traduzir em 404.
    public async Task<bool> RemoverAsync(int id)
    {
        var tanque = await _repository.ObterPorIdAsync(id);
        if (tanque is null)
        {
            return false;
        }

        await _repository.RemoverAsync(tanque);
        return true;
    }

    private static TanqueResponse MapearParaResponse(Tanque tanque) => new()
    {
        Id = tanque.Id,
        Nome = tanque.Nome,
        Capacidade = tanque.Capacidade
    };
}
