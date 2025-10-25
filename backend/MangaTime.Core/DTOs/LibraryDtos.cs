using MangaTime.Core.Enums;

namespace MangaTime.Core.DTOs;

public record LibraryItemDto(Guid MangaId, string Title, LibraryStatus Status, int? Score, int TotalVolumes, int Read);
public record UpdateLibraryRequest(LibraryStatus Status, int? Score, string? Notes);
public record ProgressDto(int Total, int Read, double Percent);
