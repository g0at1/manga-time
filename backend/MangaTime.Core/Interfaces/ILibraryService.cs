using MangaTime.Core.DTOs;
using MangaTime.Core.Enums;

namespace MangaTime.Core.Interfaces;

public interface ILibraryService
{
    Task<SearchResponse<LibraryItemDto>> GetLibraryAsync(Guid userId, int page, int pageSize);
    Task<LibraryItemDto> AddToLibraryAsync(Guid userId, Guid mangaId, LibraryStatus status, int? score, string? notes);
    Task<LibraryItemDto> UpdateLibraryAsync(Guid userId, Guid mangaId, LibraryStatus status, int? score, string? notes);
    Task<ProgressDto> GetProgressAsync(Guid userId, Guid mangaId);
}
