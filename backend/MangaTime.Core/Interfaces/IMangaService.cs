using MangaTime.Core.DTOs;

namespace MangaTime.Core.Interfaces;

public interface IMangaService
{
    Task<SearchResponse<MangaDto>> SearchAsync(string? q, int page, int pageSize);
    Task<MangaDetailDto> GetAsync(Guid id);
    Task<MangaDto> CreateAsync(CreateMangaRequest req);
    Task BulkVolumesAsync(Guid mangaId, BulkVolumesRequest req);
    Task<MangaDto?> UpdateAsync(Guid id, UpdateMangaRequest req);
}
