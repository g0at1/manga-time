namespace MangaTime.Core.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public ICollection<LibraryItem> Library { get; set; } = new List<LibraryItem>();
    public bool IsEmailConfirmed { get; set; }
}
