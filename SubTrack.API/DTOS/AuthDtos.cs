using System.ComponentModel.DataAnnotations;

namespace SubTrack.API.DTOS
{
    public class AuthDtos
    {
        public class RegisterDto
        {
            [Required]
            public string FirstName { get; set; } = string.Empty;

            [Required]
            public string LastName { get; set; } = string.Empty;

            [Required]
            public string Password { get; set; } = string.Empty;

            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;
        }

        public class LoginDto
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required]
            public string Password { get; set; } = string.Empty;
        }

        public class AuthResponseDto 
        {
            public string Token { get; set; } = string.Empty;
            public string Email {  get; set; } = string.Empty;

            public string FirstName { get; set; } = string.Empty;

            public string LastName { get; set; } = string.Empty;
        }
    }
}
