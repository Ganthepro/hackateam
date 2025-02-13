using hackateam.Dtos.Auth;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using hackateam.Shared;

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

    public async Task<AuthResponseDto> Login(LoginDto loginDto)
    {
        var user = await _userService.Get(user => user.Email == loginDto.Email);
        var isValidPassword = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
        if (!isValidPassword)
        {
            throw new HttpResponseException((int)HttpStatusCode.Unauthorized, "Invalid password");
        }
        var jwtPayloadDto = new JwtPayloadDto { Id = user.Id! };
        var token = await GeneratedJwtToken(jwtPayloadDto);
        return new AuthResponseDto(new Dtos.User.UserResponseDto(user), token);
    }

    public async Task<AuthResponseDto> Register(RegisterDto registerDto) {
        var user = await _userService.GetByEmail(registerDto.Email!);
        if (user != null) {
            throw new HttpResponseException((int)HttpStatusCode.Conflict, "Email already exists");
        }
        registerDto.Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
        var createdUser = await _userService.Create(registerDto);
        var jwtPayloadDto = new JwtPayloadDto { Id = createdUser.Id! };
        var token = await GeneratedJwtToken(jwtPayloadDto);
        return new AuthResponseDto(new Dtos.User.UserResponseDto(createdUser), token);
    }

    private Task<string> GeneratedJwtToken(JwtPayloadDto jwtPayloadDto) {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, jwtPayloadDto.Id!),
            new Claim(ClaimTypes.Role, jwtPayloadDto.Role.ToString()!)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["SecretKey"]!));
        var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        if (credential == null) throw new ArgumentNullException(nameof(credential));
        var token = new JwtSecurityToken(claims: claims, expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credential);
        return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
    }
}