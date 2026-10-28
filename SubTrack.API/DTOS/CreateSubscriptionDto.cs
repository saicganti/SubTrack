using System.ComponentModel.DataAnnotations;
using SubTrack.API.Models;

namespace SubTrack.API.DTOS
{
    public class CreateSubscriptionDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, 10000)]
        public decimal Cost { get; set; }

        public BillingCycle BillingCycle { get; set; }

        [Required]
        public DateTime NextRenewalDate { get; set; }

        [Range(1, int.MaxValue)]
        public int CategoryId { get; set; }

        [MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
    }
}
