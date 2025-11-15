using MangaTime.Core.Interfaces;
using Microsoft.Extensions.Options;
using MimeKit;

namespace MangaTime.Infrastructure.Services;

public class EmailSenderService : IEmailSender
{
    private readonly EmailSettings _settings;

    public EmailSenderService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromAddress));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("plain") { Text = body };

        using (var client = new MailKit.Net.Smtp.SmtpClient())
        {
            await client.ConnectAsync(_settings.Host, _settings.Port, _settings.UseSsl);
            await client.AuthenticateAsync(_settings.User, _settings.Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}

public class EmailSettings
{
    public string Host { get; set; } = default!;
    public int Port { get; set; }
    public bool UseSsl { get; set; }
    public string User { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string FromAddress { get; set; } = default!;
    public string FromName { get; set; } = default!;
}
