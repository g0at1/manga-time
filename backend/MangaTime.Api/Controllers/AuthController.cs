using System.Security.Cryptography;
using System.Text;

using MangaTime.Core.DTOs;
using MangaTime.Core.Entities;
using MangaTime.Core.Interfaces;
using MangaTime.Infrastructure.Data;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MangaTime.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenService _jwt;
    public AuthController(AppDbContext db, IJwtTokenService jwt) { _db = db; _jwt = jwt; }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return BadRequest("Email already registered");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = req.Email,
            PasswordHash = Hash(req.Password)
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return Ok(new { message = "registered" });
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || user.PasswordHash != Hash(req.Password))
            return Unauthorized("Invalid credentials");
        var token = _jwt.GenerateToken(user);
        return new LoginResponse { Token = token };
    }

    private static string Hash(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }
}
