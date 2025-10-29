using MangaTime.Core.DTOs;
using MangaTime.Core.Entities;
using MangaTime.Core.Enums;
using MangaTime.Core.Interfaces;
using MangaTime.Infrastructure.Data;

using Microsoft.EntityFrameworkCore;

namespace MangaTime.Infrastructure.Services;

public class LibraryService : ILibraryService
{
    private readonly AppDbContext _db;
    public LibraryService(AppDbContext db) { _db = db; }

    public async Task<SearchResponse<LibraryItemDto>> GetLibraryAsync(Guid userId, int page, int pageSize)
    {
        var q = _db.LibraryItems.AsNoTracking()
            .Include(li => li.Manga).Where(li => li.UserId == userId);

        var total = await q.CountAsync();
        var items = await q.OrderBy(li => li.Manga.Title)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(li => new LibraryItemDto(
                li.MangaId, li.Manga.Title, li.Status, li.Score,
                li.Manga.Volumes.Count,
                li.Manga.Volumes.Count(v => v.Readings.Any(rv => rv.UserId == userId))
            )).ToListAsync();
        return new(items, total);
    }

    public async Task<LibraryItemDto> AddToLibraryAsync(Guid userId, Guid mangaId, LibraryStatus status, int? score, string? notes)
    {
        var existing = await _db.LibraryItems.SingleOrDefaultAsync(x => x.UserId == userId && x.MangaId == mangaId);
        if (existing == null)
        {
            existing = new LibraryItem { Id = Guid.NewGuid(), UserId = userId, MangaId = mangaId, Status = status, Score = score, Notes = notes };
            _db.LibraryItems.Add(existing);
        }
        else
        {
            existing.Status = status; existing.Score = score; existing.Notes = notes;
        }
        await _db.SaveChangesAsync();
        return await ItemDto(userId, mangaId);
    }

    public async Task<LibraryItemDto> UpdateLibraryAsync(Guid userId, Guid mangaId, LibraryStatus status, int? score, string? notes)
        => await AddToLibraryAsync(userId, mangaId, status, score, notes);

    public async Task<ProgressDto> GetProgressAsync(Guid userId, Guid mangaId)
    {
        var total = await _db.Volumes.CountAsync(v => v.MangaId == mangaId);
        var read = await _db.ReadVolumes.CountAsync(rv => rv.UserId == userId && rv.Volume.MangaId == mangaId);
        var percent = total == 0 ? 0 : Math.Round(100.0 * read / total, 1);
        return new ProgressDto(total, read, percent);
    }

    private async Task<LibraryItemDto> ItemDto(Guid userId, Guid mangaId)
    {
        var li = await _db.LibraryItems.Include(x => x.Manga).SingleAsync(x => x.UserId == userId && x.MangaId == mangaId);
        var total = li.Manga.Volumes.Count;
        var read = li.Manga.Volumes.Count(v => v.Readings.Any(rv => rv.UserId == userId));
        return new LibraryItemDto(mangaId, li.Manga.Title, li.Status, li.Score, total, read);
    }
}
