using BrewControl.Api.Data;
using BrewControl.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewControl.Api.Repositories;

// Único ponto de acesso ao banco para os ParametrosFermentativos. Cada
// cerveja possui no máximo um conjunto de parâmetros (relação 1:1).
public class ParametrosRepository
{
    private readonly AppDbContext _context;

    public ParametrosRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ParametrosFermentativos?> ObterPorCervejaIdAsync(int cervejaId)
    {
        return await _context.ParametrosFermentativos
            .FirstOrDefaultAsync(p => p.CervejaId == cervejaId);
    }

    public async Task<ParametrosFermentativos> AdicionarAsync(ParametrosFermentativos parametros)
    {
        _context.ParametrosFermentativos.Add(parametros);
        await _context.SaveChangesAsync();
        return parametros;
    }

    public async Task AtualizarAsync(ParametrosFermentativos parametros)
    {
        _context.ParametrosFermentativos.Update(parametros);
        await _context.SaveChangesAsync();
    }
}
