namespace BrewControl.Api.DTOs;

// Indicadores agregados do dashboard.
public class DashboardResponse
{
    public int TotalRegistros { get; set; }
    public int DentroDopadrao { get; set; }
    public int Atencao { get; set; }
    public int ForaDoPadrao { get; set; }
}
