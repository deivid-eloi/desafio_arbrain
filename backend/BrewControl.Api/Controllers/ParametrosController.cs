using BrewControl.Api.DTOs;
using BrewControl.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewControl.Api.Controllers;

// Endpoints HTTP dos Parâmetros Fermentativos, aninhados sob a cerveja.
// Apenas recebe, delega ao service e traduz o resultado de negócio em
// status HTTP — sem lógica de negócio nem acesso ao banco.
[ApiController]
[Route("api/cervejas/{cervejaId}/parametros")]
public class ParametrosController : ControllerBase
{
    private readonly ParametrosService _service;

    public ParametrosController(ParametrosService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ParametrosResponse>> ObterPorCerveja(int cervejaId)
    {
        var parametros = await _service.ObterPorCervejaIdAsync(cervejaId);
        return parametros is null ? NotFound() : Ok(parametros);
    }

    [HttpPost]
    public async Task<ActionResult<ParametrosResponse>> Criar(int cervejaId, ParametrosRequest request)
    {
        var (status, dados) = await _service.CriarAsync(cervejaId, request);
        return status switch
        {
            ResultadoParametros.CervejaNaoEncontrada => NotFound(),
            ResultadoParametros.JaPossuiParametros => Conflict("A cerveja já possui parâmetros definidos. Use PUT para atualizar."),
            _ => CreatedAtAction(nameof(ObterPorCerveja), new { cervejaId }, dados)
        };
    }

    [HttpPut]
    public async Task<ActionResult<ParametrosResponse>> Atualizar(int cervejaId, ParametrosRequest request)
    {
        var (status, dados) = await _service.AtualizarAsync(cervejaId, request);
        return status switch
        {
            ResultadoParametros.CervejaNaoEncontrada => NotFound(),
            ResultadoParametros.ParametrosNaoEncontrados => NotFound(),
            _ => Ok(dados)
        };
    }
}
