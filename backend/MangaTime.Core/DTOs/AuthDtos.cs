namespace MangaTime.Core.DTOs;

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);
public record LoginResponse { public string Token { get; set; } = default!; }
