using BrewControl.Api.DTOs;
using BrewControl.Api.Enums;
using BrewControl.Api.Repositories;

namespace BrewControl.Api.Services;

// Indicadores agregados do dashboard — consulta via repositório de registros.
public class DashboardService
{
    private readonly RegistrosRepository _registrosRepository;

    public DashboardService(RegistrosRepository registrosRepository)
    {
        _registrosRepository = registrosRepository;
    }

    public async Task<DashboardResponse> ObterIndicadoresAsync()
    {
        return new DashboardResponse
        {
            TotalRegistros = await _registrosRepository.ContarTodosAsync(),
            DentroDopadrao = await _registrosRepository.ContarPorClassificacaoAsync(ClassificacaoRegistro.DentroDopadrao),
            Atencao = await _registrosRepository.ContarPorClassificacaoAsync(ClassificacaoRegistro.Atencao),
            ForaDoPadrao = await _registrosRepository.ContarPorClassificacaoAsync(ClassificacaoRegistro.ForaDoPadrao)
        };
    }
}
