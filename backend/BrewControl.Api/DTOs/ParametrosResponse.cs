namespace BrewControl.Api.DTOs;

// Parâmetros fermentativos de uma cerveja enviados ao frontend.
public class ParametrosResponse
{
    public int Id { get; set; }
    public int CervejaId { get; set; }
    public decimal TemperaturaMinima { get; set; }
    public decimal TemperaturaMaxima { get; set; }
    public decimal PhMinimo { get; set; }
    public decimal PhMaximo { get; set; }
    public decimal ExtratoPMinimo { get; set; }
    public decimal ExtratoPMaximo { get; set; }
}
