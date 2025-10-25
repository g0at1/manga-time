namespace MangaTime.Core.Entities;

public class Volume
{
    public Guid Id { get; set; }
    public Guid MangaId { get; set; }
    public Manga Manga { get; set; } = default!;
    public int Number { get; set; }
    public string? Title { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public ICollection<ReadVolume> Readings { get; set; } = new List<ReadVolume>();
}
