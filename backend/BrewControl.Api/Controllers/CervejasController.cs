using BrewControl.Api.DTOs;
using BrewControl.Api.Enums;
using BrewControl.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewControl.Api.Controllers;

// Endpoints HTTP de Cervejas. Apenas recebe, delega ao service e retorna —
// sem lógica de negócio nem acesso ao banco.
[ApiController]
[Route("api/[controller]")]
public class CervejasController : ControllerBase
{
    private readonly CervejasService _service;

    public CervejasController(CervejasService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<CervejaResponse>>> ObterTodas()
    {
        return Ok(await _service.ObterTodasAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CervejaResponse>> ObterPorId(int id)
    {
        var cerveja = await _service.ObterPorIdAsync(id);
        return cerveja is null ? NotFound() : Ok(cerveja);
    }

    [HttpPost]
    public async Task<ActionResult<CervejaResponse>> Criar(CervejaRequest request)
    {
        var criada = await _service.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = criada.Id }, criada);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CervejaResponse>> Atualizar(int id, CervejaRequest request)
    {
        var atualizada = await _service.AtualizarAsync(id, request);
        return atualizada is null ? NotFound() : Ok(atualizada);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remover(int id)
    {
        var resultado = await _service.RemoverAsync(id);
        return resultado switch
        {
            ResultadoExclusao.NaoEncontrado => NotFound(),
            ResultadoExclusao.PossuiDependencias =>
                Problem(detail: "Não é possível remover. Existem registros vinculados a esta cerveja.",
                        statusCode: StatusCodes.Status409Conflict),
            _ => NoContent()
        };
    }
}
