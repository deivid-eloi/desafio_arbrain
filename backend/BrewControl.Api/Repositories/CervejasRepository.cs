using BrewControl.Api.Data;
using BrewControl.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewControl.Api.Repositories;

// Único ponto de acesso ao banco para a entidade Cerveja. Apenas operações
// de persistência — sem regras de negócio.
public class CervejasRepository
{
    private readonly AppDbContext _context;

    public CervejasRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cerveja>> ObterTodasAsync()
    {
        return await _context.Cervejas.AsNoTracking().ToListAsync();
    }

    public async Task<Cerveja?> ObterPorIdAsync(int id)
    {
        return await _context.Cervejas.FindAsync(id);
    }

    public async Task<bool> ExisteAsync(int id)
    {
        return await _context.Cervejas.AnyAsync(c => c.Id == id);
    }

    public async Task<Cerveja> AdicionarAsync(Cerveja cerveja)
    {
        _context.Cervejas.Add(cerveja);
        await _context.SaveChangesAsync();
        return cerveja;
    }

    public async Task AtualizarAsync(Cerveja cerveja)
    {
        _context.Cervejas.Update(cerveja);
        await _context.SaveChangesAsync();
    }

    public async Task RemoverAsync(Cerveja cerveja)
    {
        _context.Cervejas.Remove(cerveja);
        await _context.SaveChangesAsync();
    }
}
