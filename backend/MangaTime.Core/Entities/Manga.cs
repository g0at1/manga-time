namespace MangaTime.Core.Entities;

public class Manga
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string? AltTitle { get; set; }
    public string? Author { get; set; }
    public int? Year { get; set; }
    public int? TotalVolumes { get; set; }
    public string? CoverUrl { get; set; }
    public string? Tags { get; set; }
    public ICollection<Volume> Volumes { get; set; } = new List<Volume>();
}
