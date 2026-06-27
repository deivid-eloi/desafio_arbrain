using BrewControl.Api.DTOs;
using BrewControl.Api.Enums;
using BrewControl.Api.Models;

namespace BrewControl.Api.Services;

// Lógica pura da classificação automática — regra de negócio CENTRAL do sistema.
// Isolada em um helper estático, sem dependências de banco ou HTTP, para ser a
// fonte única de verdade da classificação e permitir testes de unidade isolados.
//
// Temperatura é o parâmetro mais crítico: desvios podem comprometer
// irreversivelmente o lote. Variações de pH e extrato são recuperáveis.
//
//   Temperatura fora da faixa     → ForaDoPadrao
//   pH ou extrato fora da faixa   → Atencao
//   Tudo dentro                   → DentroDopadrao
public static class ClassificacaoHelper
{
    public static ClassificacaoRegistro Classificar(
        RegistroRequest request, ParametrosFermentativos parametros)
    {
        bool temperaturaFora =
            request.Temperatura < parametros.TemperaturaMinima ||
            request.Temperatura > parametros.TemperaturaMaxima;

        if (temperaturaFora)
            return ClassificacaoRegistro.ForaDoPadrao;

        bool phFora =
            request.Ph < parametros.PhMinimo ||
            request.Ph > parametros.PhMaximo;

        bool extratoFora =
            request.Extrato < parametros.ExtratoPMinimo ||
            request.Extrato > parametros.ExtratoPMaximo;

        if (phFora || extratoFora)
            return ClassificacaoRegistro.Atencao;

        return ClassificacaoRegistro.DentroDopadrao;
    }
}
