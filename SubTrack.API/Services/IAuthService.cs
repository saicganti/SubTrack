using SubTrack.API.DTOS;
using static SubTrack.API.DTOS.AuthDtos;

namespace SubTrack.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync (LoginDto dto);
    }
}
