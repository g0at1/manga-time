namespace MangaTime.Core.Entities;

public class ReadVolume
{
    public Guid UserId { get; set; }
    public Guid VolumeId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = default!;
    public Volume Volume { get; set; } = default!;
}
