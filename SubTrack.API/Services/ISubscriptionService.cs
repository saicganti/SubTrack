using SubTrack.API.DTOS;

namespace SubTrack.API.Services
{
    public interface ISubscriptionService
    {
        Task<List<SubscriptionDto>> GetAllAsync(string userId);
        Task<SubscriptionDto?> GetByIdAsync(int id, string userId);
        Task<SubscriptionDto> CreateAsync(CreateSubscriptionDto dto, string userId);
        Task<SubscriptionDto?> UpdateAsync(int id, CreateSubscriptionDto dto, string userId);
        Task<bool> DeleteAsync(int id, string userId);
        Task<DashboardDto> GetDashboardAsync(string userId);
        Task<List<SubscriptionDto>> GetUpcomingRenewalsAsync(string userId, int days);
    }
}
