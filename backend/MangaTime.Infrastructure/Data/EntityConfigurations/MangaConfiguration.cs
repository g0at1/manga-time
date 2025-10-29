using MangaTime.Core.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MangaTime.Infrastructure.Data.EntityConfigurations;

public class MangaConfiguration : IEntityTypeConfiguration<Manga>
{
    public void Configure(EntityTypeBuilder<Manga> e)
    {
        e.HasKey(x => x.Id);
        e.Property(x => x.Title).IsRequired().HasMaxLength(200);
        e.HasMany(x => x.Volumes).WithOne(v => v.Manga).HasForeignKey(v => v.MangaId);
    }
}
