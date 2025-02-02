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
    public async Task<ActionResult<List<UserResponseDto>>> Get()
    {
        var users = await _userService.GetAll();
        return await Task.FromResult(users.Select(user => new UserResponseDto(user)).ToList());
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<UserResponseDto>> Get(string id)
    {
        return await Task.FromResult(Ok(new UserResponseDto(await _userService.Get(user => user.Id == id))));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<UserResponseDto>> Update(string id, UpdateUserDto updateUserDto)
    {
        var user = await _userService.Get(user => user.Id == id);
        user = await _userService.Update(user => user.Id == id, new User
        {
            FullName = updateUserDto.FullName,
            Header = updateUserDto.Header,
            Tel = updateUserDto.Tel,
        });
        return await Task.FromResult(Ok(new UserResponseDto(user)));
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<ActionResult<UserResponseDto>> Delete(string id)
    {
        var user = await _userService.Get(user => user.Id == id);
        await _userService.Remove(user => user.Id == id);
        return await Task.FromResult(NoContent());
    }
}