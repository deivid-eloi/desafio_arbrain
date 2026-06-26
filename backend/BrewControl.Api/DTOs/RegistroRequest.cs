using System.ComponentModel.DataAnnotations;

namespace BrewControl.Api.DTOs;

// Dados recebidos do frontend para criar um registro fermentativo.
// A classificação não trafega aqui — é calculada automaticamente no Service.
public class RegistroRequest
{
    [Required(ErrorMessage = "A data/hora é obrigatória.")]
    public DateTime DataHora { get; set; }

    [Required(ErrorMessage = "A cerveja é obrigatória.")]
    [Range(1, int.MaxValue, ErrorMessage = "CervejaId inválido.")]
    public int CervejaId { get; set; }

    [Required(ErrorMessage = "O tanque é obrigatório.")]
    [Range(1, int.MaxValue, ErrorMessage = "TanqueId inválido.")]
    public int TanqueId { get; set; }

    [Required(ErrorMessage = "O número de lote é obrigatório.")]
    public string NumeroDeLote { get; set; } = string.Empty;

    [Required(ErrorMessage = "A temperatura é obrigatória.")]
    public decimal Temperatura { get; set; }

    [Required(ErrorMessage = "O pH é obrigatório.")]
    public decimal Ph { get; set; }

    [Required(ErrorMessage = "O extrato é obrigatório.")]
    public decimal Extrato { get; set; }

    public string? Observacoes { get; set; }
}
