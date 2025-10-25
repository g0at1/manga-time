using MangaTime.Core.Entities;

namespace MangaTime.Core.Interfaces;
public interface IJwtTokenService { string GenerateToken(User user); }
