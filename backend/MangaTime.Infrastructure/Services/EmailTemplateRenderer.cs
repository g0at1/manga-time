using MangaTime.Core.Interfaces;
using Microsoft.Extensions.Hosting;
using System.Text.Encodings.Web;

namespace MangaTime.Infrastructure.Services
{
    public class EmailTemplateRenderer : IEmailTemplateRenderer
    {
        private readonly IHostEnvironment _env;
        private readonly HtmlEncoder _htmlEncoder;

        public EmailTemplateRenderer(IHostEnvironment env, HtmlEncoder htmlEncoder)
        {
            _env = env;
            _htmlEncoder = htmlEncoder;
        }

        public async Task<string> RenderVerifyEmailTemplateAsync(string verifyUrl)
        {
            var templatePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "verify-email.html");

            if (!File.Exists(templatePath))
                throw new FileNotFoundException($"Email template not found: {templatePath}");

            var html = await File.ReadAllTextAsync(templatePath);
            var encodedUrl = _htmlEncoder.Encode(verifyUrl);

            html = html.Replace("{{VERIFY_URL_HREF}}", encodedUrl).Replace("{{VERIFY_URL_TEXT}}", encodedUrl);

            return html;
        }
    }
}