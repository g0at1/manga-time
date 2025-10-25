using MangaTime.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MangaTime.Infrastructure.Data.EntityConfigurations;

public class LibraryItemConfiguration : IEntityTypeConfiguration<LibraryItem>
{
    public void Configure(EntityTypeBuilder<LibraryItem> e)
    {
        e.HasKey(x => x.Id);
        e.HasIndex(x => new { x.UserId, x.MangaId }).IsUnique();
        e.HasOne(x => x.User).WithMany(u => u.Library).HasForeignKey(x => x.UserId);
        e.HasOne(x => x.Manga).WithMany().HasForeignKey(x => x.MangaId);
    }
}
