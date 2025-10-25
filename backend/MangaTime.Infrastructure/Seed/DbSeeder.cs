using MangaTime.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace MangaTime.Infrastructure.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(Data.AppDbContext db)
    {
        if (await db.Mangas.AnyAsync()) return;

        var m = new Manga { Id = Guid.NewGuid(), Title = "Fullmetal Alchemist", TotalVolumes = 27 };
        db.Mangas.Add(m);
        for (int i = 1; i <= 5; i++) db.Volumes.Add(new Volume { Id = Guid.NewGuid(), MangaId = m.Id, Number = i, Title = $"Tom {i}" });

        await db.SaveChangesAsync();
    }
}
