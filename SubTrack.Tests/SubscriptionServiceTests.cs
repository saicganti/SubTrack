using Microsoft.EntityFrameworkCore;
using SubTrack.API.Data;
using SubTrack.API.DTOS;
using SubTrack.API.Models;
using SubTrack.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SubTrack.Tests
{
    public class SubscriptionServiceTests
    {
        private static ApplicationDbContext NewContext() =>
            new(new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options);

        private static CreateSubscriptionDto MakeDto(decimal cost, BillingCycle cycle, int daysUntilRenewal, int categoryId = 1) => new()
        {
            Name = "Test",
            Cost = cost,
            BillingCycle = cycle,
            NextRenewalDate = DateTime.UtcNow.AddDays(daysUntilRenewal),
            CategoryId = categoryId,
            PaymentMethod = "Visa",
            Notes = ""
        };

        [Fact]
        public async Task Create_ReturnsDtoWithCategoryName()
        {
            using var ctx = NewContext();
            ctx.Categories.Add(new Category { Id = 1, Name = "Test Category" });
            await ctx.SaveChangesAsync();

            var svc = new SubscriptionService(ctx);
            var result = await svc.CreateAsync(MakeDto(15.99m, BillingCycle.Monthly, 10), "user1");

            Assert.NotNull(result);
            Assert.Equal("Test Category", result.CategoryName);
            Assert.Equal(15.99m, result.Cost);
        }

        [Fact]
        public async Task Dashboard_ComputesMonthlySpendFromMixedCycles()
        {
            using var ctx = NewContext();
            ctx.Categories.Add(new Category { Id = 1, Name = "Test Category" });
            await ctx.SaveChangesAsync();

            var svc = new SubscriptionService(ctx);
            await svc.CreateAsync(MakeDto(10m, BillingCycle.Weekly, 3), "user");
            await svc.CreateAsync(MakeDto(20m, BillingCycle.Monthly, 15), "user");
            await svc.CreateAsync(MakeDto(120m, BillingCycle.Yearly, 200), "user");

            var DashResult = await svc.GetDashboardAsync("user");

            Assert.NotNull(DashResult);
            Assert.Equal(10m*4.33m + 20 + 120m/ 12, DashResult.TotalMonthlySpend);
        }

        [Fact]
        public async Task Delete_RemovesSubscription()
        {
            using var ctx = NewContext();
            ctx.Categories.Add(new Category { Id = 1, Name = "Test Category" });
            await ctx.SaveChangesAsync();

            var svc = new SubscriptionService(ctx);
            var created = await svc.CreateAsync(MakeDto(5m, BillingCycle.Monthly, 10), "user1");

            Assert.True(await svc.DeleteAsync(created.Id, "user1"));
            Assert.Empty(await svc.GetAllAsync("user1"));
        }
    }
}
