using MangaTime.Core.Interfaces;
using Microsoft.Extensions.Hosting;

namespace MangaTime.Infrastructure.Services
{
    public class EmailTemplateRenderer : IEmailTemplateRenderer
    {
        private readonly IHostEnvironment _env;

        public EmailTemplateRenderer(IHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> RenderVerifyEmailTemplateAsync(string verifyUrl)
        {
            var templatePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "verify-email.html");

            if (!File.Exists(templatePath))
                throw new FileNotFoundException($"Email template not found: {templatePath}");

            var html = await File.ReadAllTextAsync(templatePath);

            html = html.Replace("{{VERIFY_URL}}", verifyUrl);

            return html;
        }
    }
}