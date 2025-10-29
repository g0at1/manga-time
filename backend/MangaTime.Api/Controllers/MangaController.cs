using MangaTime.Core.DTOs;
using MangaTime.Core.Interfaces;
using MangaTime.Infrastructure.Data;

using Microsoft.AspNetCore.Mvc;

namespace MangaTime.Api.Controllers;

[ApiController]
[Route("manga")]
public class MangaController : ControllerBase
{
    private readonly IMangaService _svc;
    private readonly AppDbContext _db;

    public MangaController(
        IMangaService svc,
        AppDbContext db
    )
    {
        _svc = svc;
        _db = db;
    }

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

    [HttpDelete("{volumeId:guid}")]
    public async Task<IActionResult> UnmarkRead(Guid volumeId)
    {
        var rv = await _db.Mangas.FindAsync(volumeId);
        if (rv == null) return NoContent();
        _db.Mangas.Remove(rv);
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<MangaDto>> Update(Guid id, UpdateMangaRequest req)
    {
        var updated = await _svc.UpdateAsync(id, req);
        if (updated == null)
            return NotFound();
        return Ok(updated);
    }
}
