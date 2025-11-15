using MangaTime.Core.Entities;

using Microsoft.EntityFrameworkCore;

namespace MangaTime.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Manga> Mangas => Set<Manga>();
    public DbSet<Volume> Volumes => Set<Volume>();
    public DbSet<LibraryItem> LibraryItems => Set<LibraryItem>();
    public DbSet<ReadVolume> ReadVolumes => Set<ReadVolume>();
    public DbSet<EmailVerificationToken> EmailVerificationTokens => Set<EmailVerificationToken>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
