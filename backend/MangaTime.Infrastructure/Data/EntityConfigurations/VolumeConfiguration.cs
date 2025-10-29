using MangaTime.Core.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MangaTime.Infrastructure.Data.EntityConfigurations;

public class VolumeConfiguration : IEntityTypeConfiguration<Volume>
{
    public void Configure(EntityTypeBuilder<Volume> e)
    {
        e.HasKey(x => x.Id);
        e.HasIndex(x => new { x.MangaId, x.Number }).IsUnique();
    }
}
