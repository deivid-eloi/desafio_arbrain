namespace BrewControl.Api.DTOs;

// Dados de um registro fermentativo enviados ao frontend.
// Inclui a classificação calculada pelo Service.
public class RegistroResponse
{
    public int Id { get; set; }
    public DateTime DataHora { get; set; }
    public int CervejaId { get; set; }
    public string CervejaNome { get; set; } = string.Empty;
    public int TanqueId { get; set; }
    public string TanqueNome { get; set; } = string.Empty;
    public string NumeroDeLote { get; set; } = string.Empty;
    public decimal Temperatura { get; set; }
    public decimal Ph { get; set; }
    public decimal Extrato { get; set; }
    public string? Observacoes { get; set; }
    public string Classificacao { get; set; } = string.Empty;
}
