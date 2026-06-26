using System.ComponentModel.DataAnnotations;

namespace BrewControl.Api.DTOs;

// Dados recebidos do frontend para definir ou atualizar os parâmetros
// fermentativos de uma cerveja. A cerveja é identificada pela rota,
// portanto o CervejaId não trafega no corpo da requisição.
public class ParametrosRequest
{
    [Required(ErrorMessage = "A temperatura mínima é obrigatória.")]
    public decimal TemperaturaMinima { get; set; }

    [Required(ErrorMessage = "A temperatura máxima é obrigatória.")]
    public decimal TemperaturaMaxima { get; set; }

    [Required(ErrorMessage = "O pH mínimo é obrigatório.")]
    public decimal PhMinimo { get; set; }

    [Required(ErrorMessage = "O pH máximo é obrigatório.")]
    public decimal PhMaximo { get; set; }

    [Required(ErrorMessage = "O extrato mínimo é obrigatório.")]
    public decimal ExtratoPMinimo { get; set; }

    [Required(ErrorMessage = "O extrato máximo é obrigatório.")]
    public decimal ExtratoPMaximo { get; set; }
}
