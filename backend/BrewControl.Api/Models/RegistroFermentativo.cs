using BrewControl.Api.Enums;

namespace BrewControl.Api.Models;

// Leitura pontual dos parâmetros de fermentação de um lote em um dado momento.
// A Classificacao é calculada automaticamente na camada de serviço no momento
// do salvamento, comparando os valores medidos com os ParametrosFermentativos
// da cerveja. Nunca é calculada no controller ou no frontend.
public class RegistroFermentativo
{
    public int Id { get; set; }

    // Momento da leitura — obrigatório.
    public DateTime DataHora { get; set; }

    // Cerveja medida.
    public int CervejaId { get; set; }
    public Cerveja? Cerveja { get; set; }

    // Tanque onde a fermentação ocorre.
    public int TanqueId { get; set; }
    public Tanque? Tanque { get; set; }

    // Identificação do lote — obrigatório.
    public string NumeroDeLote { get; set; } = string.Empty;

    // Valores medidos.
    public decimal Temperatura { get; set; } // °C
    public decimal Ph { get; set; }
    public decimal Extrato { get; set; } // °P

    // Observações livres — opcional.
    public string? Observacoes { get; set; }

    // Resultado da classificação automática (regra de negócio central).
    public ClassificacaoRegistro Classificacao { get; set; }
}
