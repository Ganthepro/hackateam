using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.User;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserResponseDto>> GetMe()
    {
        var id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return await Task.FromResult(Ok(new UserResponseDto(await _userService.Get(user => user.Id == id))));
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<UserResponseDto>>> Get(UserQueryDto userQueryDto)
    {
        var users = await _userService.GetAll(userQueryDto);
        return await Task.FromResult(users.Select(user => new UserResponseDto(user)).ToList());
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<UserResponseDto>> Get(string id)
    {
        return await Task.FromResult(Ok(new UserResponseDto(await _userService.Get(user => user.Id == id))));
    }

    [HttpPatch]
    [Authorize]
    public async Task<ActionResult<UserResponseDto>> Update(UpdateUserDto updateUserDto)
    {
        var id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userService.Get(user => user.Id == id);
        user = await _userService.Update(user => user.Id == id, updateUserDto);
        return await Task.FromResult(Ok(new UserResponseDto(user)));
    }

    [Authorize]
    [HttpDelete]
    public async Task<ActionResult<UserResponseDto>> Delete()
    {
        var id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _userService.Remove(user => user.Id == id);
        return await Task.FromResult(NoContent());
    }
}