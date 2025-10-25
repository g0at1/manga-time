using System.Net;
using System.Text.Json;

namespace MangaTime.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    public ExceptionHandlingMiddleware(RequestDelegate next) => _next = next;

    public async Task Invoke(HttpContext ctx)
    {
        try { await _next(ctx); }
        catch (Exception ex)
        {
            ctx.Response.ContentType = "application/json";
            ctx.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await ctx.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
        }
    }
}
