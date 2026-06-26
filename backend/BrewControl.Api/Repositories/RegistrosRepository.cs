using BrewControl.Api.Data;
using BrewControl.Api.Enums;
using BrewControl.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewControl.Api.Repositories;

// Único ponto de acesso ao banco para RegistroFermentativo. Apenas
// operações de persistência e consulta — sem regras de negócio.
public class RegistrosRepository
{
    private readonly AppDbContext _context;

    public RegistrosRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RegistroFermentativo>> ObterTodosAsync()
    {
        return await _context.RegistrosFermentativos
            .Include(r => r.Cerveja)
            .Include(r => r.Tanque)
            .AsNoTracking()
            .OrderByDescending(r => r.DataHora)
            .ToListAsync();
    }

    public async Task<RegistroFermentativo?> ObterPorIdAsync(int id)
    {
        return await _context.RegistrosFermentativos
            .Include(r => r.Cerveja)
            .Include(r => r.Tanque)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<List<RegistroFermentativo>> ObterPorLoteAsync(string numeroDeLote)
    {
        return await _context.RegistrosFermentativos
            .Include(r => r.Cerveja)
            .Include(r => r.Tanque)
            .Where(r => r.NumeroDeLote == numeroDeLote)
            .OrderBy(r => r.DataHora)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<RegistroFermentativo> AdicionarAsync(RegistroFermentativo registro)
    {
        _context.RegistrosFermentativos.Add(registro);
        await _context.SaveChangesAsync();

        // Recarrega com as navegações para montar o response completo.
        await _context.Entry(registro).Reference(r => r.Cerveja).LoadAsync();
        await _context.Entry(registro).Reference(r => r.Tanque).LoadAsync();
        return registro;
    }

    // Contagens por classificação para o dashboard.
    public async Task<int> ContarTodosAsync()
    {
        return await _context.RegistrosFermentativos.CountAsync();
    }

    public async Task<int> ContarPorClassificacaoAsync(ClassificacaoRegistro classificacao)
    {
        return await _context.RegistrosFermentativos
            .CountAsync(r => r.Classificacao == classificacao);
    }
}
