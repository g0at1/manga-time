using MangaTime.Core.DTOs;
using MangaTime.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MangaTime.Api.Controllers;

[ApiController]
[Route("manga")]
public class MangaController : ControllerBase
{
    private readonly IMangaService _svc;
    public MangaController(IMangaService svc) { _svc = svc; }

    [HttpGet]
    public async Task<ActionResult<SearchResponse<MangaDto>>> Search([FromQuery] string? search = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => await _svc.SearchAsync(search, page, pageSize);

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MangaDetailDto>> Get(Guid id) => await _svc.GetAsync(id);

    [HttpPost]
    public async Task<ActionResult<MangaDto>> Create(CreateMangaRequest req) => await _svc.CreateAsync(req);

    [HttpPost("{id:guid}/volumes/bulk")]
    public async Task<IActionResult> BulkVolumes(Guid id, BulkVolumesRequest req)
    { await _svc.BulkVolumesAsync(id, req); return Ok(); }
}
