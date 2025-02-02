using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using hackateam.Models;
using hackateam.Services;
using hackateam.Dtos.User;
using Microsoft.AspNetCore.Authorization;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : Controller
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize]
    public async Task<List<UserResponseDto>> Get()
    {
        var users = await _userService.GetAll();
        return users.Select(user => new UserResponseDto(user)).ToList();
    }

    [HttpGet("{id:length(24)}")]
    public async Task<UserResponseDto> Get(string id)
    {
        return new UserResponseDto(await _userService.Get(user => user.Id == id));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<UserResponseDto> Update(string id, UpdateUserDto updateUserDto)
    {
        var user = await _userService.Get(user => user.Id == id);
        user = await _userService.Update(user => user.Id == id, new User
        {
            FullName = updateUserDto.FullName,
            Header = updateUserDto.Header,
            Tel = updateUserDto.Tel,
        });
        return new UserResponseDto(user);
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