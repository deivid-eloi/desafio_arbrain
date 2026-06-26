namespace BrewControl.Api.Models;

// Representa uma cerveja cadastrada no sistema.
// Cada cerveja possui seus próprios parâmetros fermentativos de referência.
public class Cerveja
{
    public int Id { get; set; }

    // Nome comercial da cerveja — obrigatório.
    public string Nome { get; set; } = string.Empty;

    // Estilo da cerveja (ex: IPA, Pilsen) — obrigatório.
    public string Estilo { get; set; } = string.Empty;
}
