using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SubTrack.API.Data;
using System.Net.WebSockets;

namespace SubTrack.API.Services
{
    public class RenewalReminderService : BackgroundService 
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RenewalReminderService> _logger;

        public RenewalReminderService(IServiceProvider serviceProvider, ILogger<RenewalReminderService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Renewal reminder check running at : {time}", DateTimeOffset.Now);

                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var upcoming = await context.Subscriptions
                        .Where(s => s.NextRenewalDate >= DateTime.UtcNow && s.NextRenewalDate <= DateTime.UtcNow.AddDays(7))
                        .ToListAsync(stoppingToken);

                    foreach (var subscription in upcoming)
                    {
                        _logger.LogInformation(
                        "REMINDER: {Name} renews on {Date} for {Cost}",
                        subscription.Name, subscription.NextRenewalDate.ToString("yyyy-MM-dd"), subscription.Cost);
                    }

                    if (upcoming.Count == 0)
                        _logger.LogInformation("No upcoming renewals in the next 7 days.");
                }

                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in renewal reminder service");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
