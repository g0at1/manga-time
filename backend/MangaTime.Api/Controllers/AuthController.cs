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
    private readonly IEmailSender _emailSender;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext db, IJwtTokenService jwt, IEmailSender emailSender, IConfiguration configuration)
    {
        _db = db;
        _jwt = jwt;
        _emailSender = emailSender;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return BadRequest("Email already registered");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = req.Email,
            PasswordHash = Hash(req.Password),
            IsEmailConfirmed = false,
        };
        _db.Users.Add(user);
        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        var tokenHash = Hash(rawToken);
        var emailToken = new EmailVerificationToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            Used = false
        };
        _db.EmailVerificationTokens.Add(emailToken);
        await _db.SaveChangesAsync();
        var verifyUrl = $"{_configuration["Frontend:BaseUrl"]}/verify-email?token={Uri.EscapeDataString(rawToken)}";

        await _emailSender.SendEmailAsync(
            user.Email,
            "Confirm your MangaTime account",
            $@"Hi,
Click the link below to confirm your account:
{verifyUrl}
If you didn't request this, you can ignore this email."
        );
        return Ok(new { message = "registered" });
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || user.PasswordHash != Hash(req.Password))
            return Unauthorized("Invalid credentials");
        if (!user.IsEmailConfirmed)
        {
            return BadRequest("Email not confirmed");
        }
        var token = _jwt.GenerateToken(user);
        return new LoginResponse { Token = token };
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest req)
    {
        var rawToken = req.Token;

        var tokenHash = Hash(rawToken);

        var record = await _db.EmailVerificationTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash);

        if (record == null || record.Used || record.ExpiresAt < DateTime.UtcNow)
            return BadRequest("Invalid or expired token.");

        record.Used = true;
        record.User.IsEmailConfirmed = true;

        await _db.SaveChangesAsync();

        return Ok();
    }

    private static string Hash(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }
}
