using BrewControl.Api.DTOs;
using BrewControl.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewControl.Api.Controllers;

// Endpoints HTTP dos Registros Fermentativos. Apenas recebe, delega ao
// service e traduz o resultado em status HTTP — sem lógica de negócio.
[ApiController]
[Route("api/[controller]")]
public class RegistrosController : ControllerBase
{
    private readonly RegistrosService _service;

    public RegistrosController(RegistrosService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<RegistroResponse>>> ObterTodos()
    {
        return Ok(await _service.ObterTodosAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RegistroResponse>> ObterPorId(int id)
    {
        var registro = await _service.ObterPorIdAsync(id);
        return registro is null ? NotFound() : Ok(registro);
    }

    [HttpGet("lote/{numeroDeLote}")]
    public async Task<ActionResult<List<RegistroResponse>>> ObterPorLote(string numeroDeLote)
    {
        return Ok(await _service.ObterPorLoteAsync(numeroDeLote));
    }

    [HttpPost]
    public async Task<ActionResult<RegistroResponse>> Criar(RegistroRequest request)
    {
        var (status, dados) = await _service.CriarAsync(request);
        return status switch
        {
            ResultadoRegistro.CervejaNaoEncontrada =>
                NotFound("Cerveja não encontrada."),
            ResultadoRegistro.TanqueNaoEncontrado =>
                NotFound("Tanque não encontrado."),
            ResultadoRegistro.ParametrosNaoDefinidos =>
                UnprocessableEntity("A cerveja não possui parâmetros fermentativos definidos. Cadastre-os antes de registrar."),
            _ => CreatedAtAction(nameof(ObterPorId), new { id = dados!.Id }, dados)
        };
    }
}
