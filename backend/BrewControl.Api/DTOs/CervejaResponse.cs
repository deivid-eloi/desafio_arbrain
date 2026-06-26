namespace BrewControl.Api.DTOs;

// Dados de uma cerveja enviados ao frontend.
public class CervejaResponse
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Estilo { get; set; } = string.Empty;
}
