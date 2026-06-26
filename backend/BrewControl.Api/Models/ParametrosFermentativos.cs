namespace BrewControl.Api.Models;

// Intervalos de referência (mínimo e máximo) que definem o padrão
// fermentativo esperado para uma cerveja específica. São a base da
// classificação automática de cada registro fermentativo.
public class ParametrosFermentativos
{
    public int Id { get; set; }

    // Cerveja à qual estes parâmetros pertencem.
    public int CervejaId { get; set; }
    public Cerveja? Cerveja { get; set; }

    // Faixa de temperatura aceitável em °C.
    public decimal TemperaturaMinima { get; set; }
    public decimal TemperaturaMaxima { get; set; }

    // Faixa de pH aceitável.
    public decimal PhMinimo { get; set; }
    public decimal PhMaximo { get; set; }

    // Faixa de extrato aceitável em °P (graus Plato).
    public decimal ExtratoPMinimo { get; set; }
    public decimal ExtratoPMaximo { get; set; }
}
