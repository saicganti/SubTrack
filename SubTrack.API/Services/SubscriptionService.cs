using SubTrack.API.DTOS;
using SubTrack.API.Data;
using SubTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace SubTrack.API.Services
{
    public class SubscriptionService : ISubscriptionService
    {

        private readonly ApplicationDbContext _context;

        public SubscriptionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SubscriptionDto>> GetAllAsync(string userId)
        {
            return await _context.Subscriptions
                .Include(s => s.Category)
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.NextRenewalDate)
                .Select(s => MapToDto(s))
                .ToListAsync();
        }

        public async Task<SubscriptionDto?> GetByIdAsync(int id, string userId)
        {
            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            return subscription == null ? null : MapToDto(subscription);
        }

        public async Task<SubscriptionDto> CreateAsync(CreateSubscriptionDto dto, string userId)
        {
            var subscription = new Subscription
            {
                Name = dto.Name,
                Cost = dto.Cost,
                BillingCycle = dto.BillingCycle,
                NextRenewalDate = dto.NextRenewalDate,
                CategoryId = dto.CategoryId,
                PaymentMethod = dto.PaymentMethod,
                Notes = dto.Notes,
                UserId = userId
            };

            _context.Subscriptions.Add(subscription);
            await _context.SaveChangesAsync();

            return MapToDto(subscription);
        }

        public async Task<SubscriptionDto?> UpdateAsync(int id, CreateSubscriptionDto dto, string userId)
        {
            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if(subscription == null) { return null; }

            subscription.Name = dto.Name;
            subscription.Cost = dto.Cost;
            subscription.BillingCycle = dto.BillingCycle;
            subscription.NextRenewalDate = dto.NextRenewalDate;
            subscription.CategoryId = dto.CategoryId;
            subscription.PaymentMethod = dto.PaymentMethod;
            subscription.Notes = dto.Notes;
            subscription.UserId = userId;

            await _context.SaveChangesAsync();
            return MapToDto(subscription);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if(subscription == null) { return false; }

            _context.Subscriptions.Remove(subscription);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<DashboardDto> GetDashboardAsync(string userId)
        {
            var subscriptions = await _context.Subscriptions
                .Where(s => s.UserId == userId)
                .Include(s => s.Category)
                .ToListAsync();

            var monthlySpend = subscriptions
                .Sum(s => GetMonthlyCost(s));

            var yearlySpend = monthlySpend * 12;

            var next7Days = subscriptions
                .Where(s => s.NextRenewalDate >= DateTime.UtcNow && s.NextRenewalDate <= DateTime.UtcNow.AddDays(7))
                .OrderBy(s => s.NextRenewalDate)
                .Select(s => MapToDto(s))
                .ToList();

            var next30Days = subscriptions
                .Where(s => s.NextRenewalDate >= DateTime.UtcNow && s.NextRenewalDate <= DateTime.UtcNow.AddDays(30))
                .OrderBy(s => s.NextRenewalDate)
                .Select(s => MapToDto(s))
                .ToList();

            var byCategory = subscriptions
                .GroupBy(s => new { s.CategoryId, Name = s.Category?.Name ?? "Uncategorized" })
                .Select(g => new CategorySpendDto
                {
                    CategoryId = g.Key.CategoryId,
                    Category = g.Key.Name,
                    Amount = g.Sum(s => GetMonthlyCost(s))
                })
                .OrderByDescending(c => c.Amount)
                .ToList();

            return new DashboardDto
            {
                TotalMonthlySpend = monthlySpend,
                TotalYearlySpend = yearlySpend,
                UpcomingRenewals7Days = next7Days,
                UpcomingRenewals30Days = next30Days,
                SpendingByCategory = byCategory
            };
        }

        public async Task<List<SubscriptionDto>> GetUpcomingRenewalsAsync(string userId, int days)
        {
            var cutoff = DateTime.UtcNow.AddDays(days);
            return await _context.Subscriptions
                .Where(s => s.UserId == userId && s.NextRenewalDate <= cutoff)
                .Include(s => s.Category)
                .OrderBy(s => s.NextRenewalDate)
                .Select(s => MapToDto(s))
                .ToListAsync();
        }

        private static decimal GetMonthlyCost(Subscription s)
        {
            return s.BillingCycle switch
            {
                BillingCycle.Weekly => s.Cost *4.33m,
                BillingCycle.Monthly => s.Cost,
                BillingCycle.Yearly => s.Cost / 12m,
                _ => s.Cost
            };
        }

        private static SubscriptionDto MapToDto(Subscription s)
        {
            return new SubscriptionDto
            {
                Id = s.Id,
                Name = s.Name,
                Cost = s.Cost,
                BillingCycle = s.BillingCycle.ToString(),
                NextRenewalDate = s.NextRenewalDate,
                CategoryId = s.CategoryId,
                CategoryName = s.Category?.Name ?? "Uncategorized",
                PaymentMethod = s.PaymentMethod,
                Notes = s.Notes
            };
        }
    }
}
