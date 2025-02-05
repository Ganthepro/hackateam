using hackateam.Dtos.User;

namespace hackateam.Dtos.Auth;

public class AuthResponseDto
{
    public AuthResponseDto(UserResponseDto user, string token)
    {
        User = user;
        Token = token;
    }

    public UserResponseDto User { get; set; }
    public string? Token { get; set; }
}