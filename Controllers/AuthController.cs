using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using hackateam.Models;
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