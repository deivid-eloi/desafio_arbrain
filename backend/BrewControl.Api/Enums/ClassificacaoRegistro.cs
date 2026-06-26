namespace BrewControl.Api.Enums;

// Resultado da classificação automática de um registro fermentativo.
// Calculada no RegistrosService conforme a regra de negócio central:
// temperatura fora da faixa é o desvio mais crítico (ForaDoPadrao);
// desvios apenas de pH ou extrato geram Atencao; tudo dentro da faixa
// resulta em DentroDopadrao.
public enum ClassificacaoRegistro
{
    DentroDopadrao,
    Atencao,
    ForaDoPadrao
}
