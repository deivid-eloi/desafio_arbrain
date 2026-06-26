using BrewControl.Api.DTOs;
using BrewControl.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrewControl.Api.Controllers;

// Endpoint do dashboard com indicadores agregados.
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _service;

    public DashboardController(DashboardService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardResponse>> ObterIndicadores()
    {
        return Ok(await _service.ObterIndicadoresAsync());
    }
}
