using MangaTime.Core.Enums;

namespace MangaTime.Core.Entities;

public class LibraryItem
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid MangaId { get; set; }
    public LibraryStatus Status { get; set; } = LibraryStatus.Planning;
    public int? Score { get; set; }
    public string? Notes { get; set; }

    public User User { get; set; } = default!;
    public Manga Manga { get; set; } = default!;
}
