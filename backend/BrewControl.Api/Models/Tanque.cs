namespace BrewControl.Api.Models;

// Representa um tanque de fermentação disponível para uso.
public class Tanque
{
    public int Id { get; set; }

    // Identificação do tanque — obrigatório.
    public string Nome { get; set; } = string.Empty;

    // Capacidade do tanque em litros — obrigatório.
    public decimal Capacidade { get; set; }
}
