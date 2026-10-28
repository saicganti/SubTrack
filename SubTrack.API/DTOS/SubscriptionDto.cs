namespace SubTrack.API.DTOS
{
    public class SubscriptionDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Cost { get; set; }
        public string BillingCycle { get; set; } = string.Empty;
        public DateTime NextRenewalDate { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}
