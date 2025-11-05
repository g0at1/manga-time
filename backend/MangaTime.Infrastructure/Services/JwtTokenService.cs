using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using MangaTime.Core.Entities;
using MangaTime.Core.Interfaces;

using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace MangaTime.Infrastructure.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _cfg;
    public JwtTokenService(IConfiguration cfg) { _cfg = cfg; }

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _cfg["Jwt:Issuer"], audience: _cfg["Jwt:Audience"],
            claims: claims, expires: DateTime.UtcNow.AddMinutes(30), signingCredentials: creds, notBefore: DateTime.UtcNow);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
