using BrewControl.Api.Data;
using BrewControl.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewControl.Api.Repositories;

// Único ponto de acesso ao banco para a entidade Tanque. Apenas operações
// de persistência — sem regras de negócio.
public class TanquesRepository
{
    private readonly AppDbContext _context;

    public TanquesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tanque>> ObterTodosAsync()
    {
        return await _context.Tanques.AsNoTracking().ToListAsync();
    }

    public async Task<Tanque?> ObterPorIdAsync(int id)
    {
        return await _context.Tanques.FindAsync(id);
    }

    public async Task<Tanque> AdicionarAsync(Tanque tanque)
    {
        _context.Tanques.Add(tanque);
        await _context.SaveChangesAsync();
        return tanque;
    }

    public async Task AtualizarAsync(Tanque tanque)
    {
        _context.Tanques.Update(tanque);
        await _context.SaveChangesAsync();
    }

    public async Task RemoverAsync(Tanque tanque)
    {
        _context.Tanques.Remove(tanque);
        await _context.SaveChangesAsync();
    }
}
