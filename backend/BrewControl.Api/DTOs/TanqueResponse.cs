namespace BrewControl.Api.DTOs;

// Dados de um tanque enviados ao frontend.
public class TanqueResponse
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Capacidade { get; set; }
}
