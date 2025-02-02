using hackateam.Models;
using hackateam.Services;
using hackateam.Dtos.Auth;
using System.CodeDom.Compiler;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace hackateam.Services;

public class AuthService
{
    private readonly UserService _userService;
    private readonly IConfiguration _configuration;

    public AuthService(UserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> Register(RegisterDto registerDto) {
        var user = await _userService.Create(registerDto);
        var jwtPayloadDto = new JwtPayloadDto { Id = user.Id! };
        var token = await GeneratedJwtToken(jwtPayloadDto);
        return new AuthResponseDto(new Dtos.User.UserResponseDto(user), token);
    }

    private Task<string> GeneratedJwtToken(JwtPayloadDto jwtPayloadDto) {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, jwtPayloadDto.Id!),
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["SecretKey"]!));
        var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        if (credential == null) throw new ArgumentNullException(nameof(credential));
        var token = new JwtSecurityToken(claims: claims, expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credential);
        return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
    }
}