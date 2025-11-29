namespace MangaTime.Core.Interfaces
{
    public interface IEmailTemplateRenderer
    {
        Task<string> RenderVerifyEmailTemplateAsync(string verifyUrl);
    }
}