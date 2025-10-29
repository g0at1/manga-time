using MangaTime.Core.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MangaTime.Infrastructure.Data.EntityConfigurations;

public class ReadVolumeConfiguration : IEntityTypeConfiguration<ReadVolume>
{
    public void Configure(EntityTypeBuilder<ReadVolume> e)
    {
        e.HasKey(x => new { x.UserId, x.VolumeId });
        e.HasOne(x => x.Volume).WithMany(v => v.Readings).HasForeignKey(x => x.VolumeId);
    }
}
