using System.Security.Claims;

using MangaTime.Core.DTOs;
using MangaTime.Core.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MangaTime.Api.Controllers;

[Authorize]
[ApiController]
[Route("library")]
public class LibraryController : ControllerBase
{
    private readonly ILibraryService _svc;
    public LibraryController(ILibraryService svc) { _svc = svc; }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public Task<SearchResponse<LibraryItemDto>> GetMyLibrary([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => _svc.GetLibraryAsync(UserId, page, pageSize);

    [HttpPost("{mangaId:guid}")]
    public Task<LibraryItemDto> Add(Guid mangaId, [FromBody] UpdateLibraryRequest req)
        => _svc.AddToLibraryAsync(UserId, mangaId, req.Status, req.Score, req.Notes);

    [HttpPatch("{mangaId:guid}")]
    public Task<LibraryItemDto> Update(Guid mangaId, [FromBody] UpdateLibraryRequest req)
        => _svc.UpdateLibraryAsync(UserId, mangaId, req.Status, req.Score, req.Notes);

    [HttpGet("{mangaId:guid}/progress")]
    public Task<ProgressDto> Progress(Guid mangaId) => _svc.GetProgressAsync(UserId, mangaId);
}
