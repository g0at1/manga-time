namespace MangaTime.Core.Entities;

public class EmailVerificationToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string TokenHash { get; set; } = default!;
    public DateTime ExpiresAt { get; set; }
    public bool Used { get; set; }

    public User User { get; set; } = default!;
}
