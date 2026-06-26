using System.ComponentModel.DataAnnotations;

namespace BrewControl.Api.DTOs;

// Dados recebidos do frontend para criar ou atualizar um tanque.
public class TanqueRequest
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    public string Nome { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "A capacidade deve ser maior que zero.")]
    public decimal Capacidade { get; set; }
}
