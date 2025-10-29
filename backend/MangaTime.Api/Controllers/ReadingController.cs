using System.Security.Claims;

using MangaTime.Core.Entities;
using MangaTime.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("reading")]
public class ReadingController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReadingController(AppDbContext db) { _db = db; }
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("{volumeId:guid}")]
    public async Task<IActionResult> MarkRead(Guid volumeId)
    {
        var exists = await _db.ReadVolumes.FindAsync(UserId, volumeId);
        if (exists != null) return NoContent();
        _db.ReadVolumes.Add(new ReadVolume { UserId = UserId, VolumeId = volumeId });
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{volumeId:guid}")]
    public async Task<IActionResult> UnmarkRead(Guid volumeId)
    {
        var rv = await _db.ReadVolumes.FindAsync(UserId, volumeId);
        if (rv == null) return NoContent();
        _db.ReadVolumes.Remove(rv);
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("manga/{mangaId:guid}")]
    public async Task<ActionResult<IEnumerable<Guid>>> GetReadVolumes(Guid mangaId)
    {
        var ids = await _db.ReadVolumes
            .Where(rv => rv.UserId == UserId && rv.Volume.MangaId == mangaId)
            .Select(rv => rv.VolumeId)
            .ToListAsync();

        return Ok(ids);
    }
}
