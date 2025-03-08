using Microsoft.AspNetCore.Mvc;
using hackateam.Dtos.Auth;
using hackateam.Services;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : Controller
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
    {
        return await Task.FromResult(Ok(await _authService.Login(loginDto)));
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
    {
        return await Task.FromResult(Ok(await _authService.Register(registerDto)));
    }

    [HttpGet("Login")]
    public IActionResult Login()
    {
        return View();
    }

    [HttpGet("Register")]
    public IActionResult Register()
    {
        return View();
    }
}