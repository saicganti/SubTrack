namespace SubTrack.API.DTOS
{
    public class DashboardDto
    {
        public decimal TotalMonthlySpend { get; set; }
        public decimal TotalYearlySpend { get; set; }
        public List<SubscriptionDto> UpcomingRenewals7Days { get; set; } = new();
        public List<SubscriptionDto> UpcomingRenewals30Days { get; set; } = new();
        public List<CategorySpendDto> SpendingByCategory { get; set; } = new();

    }

    public class CategorySpendDto
    {
        public int CategoryId { get; set; }
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
