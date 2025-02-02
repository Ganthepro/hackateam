using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using hackateam.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using hackateam.Dtos.Auth;
using hackateam.Services;
using hackateam.Dtos.User;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : Controller
{
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration Configuration;
    private readonly AuthService _authService;

    public AuthController(ILogger<AuthController> logger, IConfiguration configuration, AuthService authService)
    {
        _logger = logger;
        Configuration = configuration;
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login(LoginDto loginDto)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, loginDto.Email!),
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecretKey"]!));
        var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        if (credential == null) throw new ArgumentNullException(nameof(credential));
        var token = new JwtSecurityToken(claims: claims, expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credential);
        return await Task.FromResult(Ok(new JwtSecurityTokenHandler().WriteToken(token)));
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserResponseDto>> Register(RegisterDto registerDto)
    {
        return await Task.FromResult(Ok(await _authService.Register(registerDto)));
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}