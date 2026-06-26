using BrewControl.Api.DTOs;
using BrewControl.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewControl.Api.Controllers;

// Endpoints HTTP de Tanques. Apenas recebe, delega ao service e retorna —
// sem lógica de negócio nem acesso ao banco.
[ApiController]
[Route("api/[controller]")]
public class TanquesController : ControllerBase
{
    private readonly TanquesService _service;

    public TanquesController(TanquesService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<TanqueResponse>>> ObterTodos()
    {
        return Ok(await _service.ObterTodosAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TanqueResponse>> ObterPorId(int id)
    {
        var tanque = await _service.ObterPorIdAsync(id);
        return tanque is null ? NotFound() : Ok(tanque);
    }

    [HttpPost]
    public async Task<ActionResult<TanqueResponse>> Criar(TanqueRequest request)
    {
        var criado = await _service.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = criado.Id }, criado);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TanqueResponse>> Atualizar(int id, TanqueRequest request)
    {
        var atualizado = await _service.AtualizarAsync(id, request);
        return atualizado is null ? NotFound() : Ok(atualizado);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remover(int id)
    {
        var removido = await _service.RemoverAsync(id);
        return removido ? NoContent() : NotFound();
    }
}
