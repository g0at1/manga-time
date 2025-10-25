namespace MangaTime.Core.DTOs;

public record MangaDto(Guid Id, string Title, string? CoverUrl, int? TotalVolumes);
public record VolumeDto(Guid Id, Guid MangaId, int Number, string? Title);
public record MangaDetailDto(MangaDto Manga, IEnumerable<VolumeDto> Volumes);
public record CreateMangaRequest(string Title, string? Author, int? TotalVolumes, string? CoverUrl);
public record BulkVolumesRequest(int from, int to);
public record SearchResponse<T>(IEnumerable<T> Items, int Total);
