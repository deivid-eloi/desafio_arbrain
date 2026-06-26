using System.ComponentModel.DataAnnotations;

namespace BrewControl.Api.DTOs;

// Dados recebidos do frontend para criar ou atualizar uma cerveja.
public class CervejaRequest
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O estilo é obrigatório.")]
    public string Estilo { get; set; } = string.Empty;
}
