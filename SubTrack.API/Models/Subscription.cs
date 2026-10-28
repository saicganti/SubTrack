using System.ComponentModel.DataAnnotations;

namespace SubTrack.API.Models
{
    public class Subscription
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, 10000)]
        public decimal Cost { get; set; }

        public BillingCycle BillingCycle { get; set; }

        public DateTime NextRenewalDate { get; set; }

        [MaxLength(50)]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        [MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;

        // Foreign key to the user
        public string UserId { get; set; } = string.Empty;
    }
}
