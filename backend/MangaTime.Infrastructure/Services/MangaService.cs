using MangaTime.Core.DTOs;
using MangaTime.Core.Entities;
using MangaTime.Core.Interfaces;
using MangaTime.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MangaTime.Infrastructure.Services;

public class MangaService : IMangaService
{
    private readonly AppDbContext _db;
    public MangaService(AppDbContext db) { _db = db; }

    public async Task<SearchResponse<MangaDto>> SearchAsync(string? q, int page, int pageSize)
    {
        var src = _db.Mangas.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(q))
            src = src.Where(m => m.Title.Contains(q));
        var total = await src.CountAsync();
        var items = await src.OrderBy(m => m.Title)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(m => new MangaDto(m.Id, m.Title, m.CoverUrl, m.TotalVolumes))
            .ToListAsync();
        return new(items, total);
    }

    public async Task<MangaDetailDto> GetAsync(Guid id)
    {
        var m = await _db.Mangas.AsNoTracking()
            .Include(x => x.Volumes)
            .SingleAsync(x => x.Id == id);
        var dto = new MangaDto(m.Id, m.Title, m.CoverUrl, m.TotalVolumes);
        var vols = m.Volumes.OrderBy(v => v.Number)
            .Select(v => new VolumeDto(v.Id, v.MangaId, v.Number, v.Title));
        return new(dto, vols);
    }

    public async Task<MangaDto> CreateAsync(CreateMangaRequest req)
    {
        var m = new Manga { Id = Guid.NewGuid(), Title = req.Title, Author = null, TotalVolumes = req.TotalVolumes, CoverUrl = req.CoverUrl };
        _db.Mangas.Add(m); await _db.SaveChangesAsync();
        return new MangaDto(m.Id, m.Title, m.CoverUrl, m.TotalVolumes);
    }

    public async Task BulkVolumesAsync(Guid mangaId, BulkVolumesRequest req)
    {
        var list = new List<Volume>();
        for (int i = req.from; i <= req.to; i++)
            list.Add(new Volume { Id = Guid.NewGuid(), MangaId = mangaId, Number = i });
        _db.Volumes.AddRange(list);
        await _db.SaveChangesAsync();
    }
}
