using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.User;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using hackateam.Shared;
using System.Net;
using hackateam.Dtos.Skill;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : Controller
{
    private readonly UserService _userService;
    private readonly FileService _fileService;
    private readonly NotificationService _notificationService;
    private readonly ProjectService _projectService;
    private readonly SkillService _skillService;

    public UserController(UserService userService, FileService fileService, NotificationService notificationService, ProjectService projectService, SkillService skillService)
    {
        _userService = userService;
        _fileService = fileService;
        _notificationService = notificationService;
        _projectService = projectService;
        _skillService = skillService;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserResponseDto>> GetMe()
    {
        var id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return await Task.FromResult(Ok(new UserResponseDto(await _userService.Get(user => user.Id == id))));
    }

    [HttpPut("avatar")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<NoContentResult> UpdateAvatar(IFormFile file)
    {
        var id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userService.Get(user => user.Id == id);
        var fileName = await _fileService.UpdateFile(user.Id + Path.GetExtension(file.FileName), FileService.FolderName.Avatar, file);
        _userService.UpdateAvatar(user.Id!, fileName!);
        return await Task.FromResult(NoContent());
    }

    [HttpGet("skills")]
    [Authorize]
    public async Task<ActionResult<List<SkillResponseDto>>> GetSkills()
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var project = await _projectService.GetAll(project => project.UserId == userId);

        var skillDtos = new List<SkillResponseDto>();
        foreach (var p in project)
        {
            var skill = await _skillService.Get(skill => skill.Id == p.SkillId);
            if (skill == null)
            {
                return NotFound(Constants.SkillMessage.NOT_FOUND);
            }
            if (skillDtos.Any(s => s.Id == skill.Id))
            {
                continue;
            }
            skillDtos.Add(new SkillResponseDto(skill));
        }
        return Ok(skillDtos);
    }

    [HttpGet("{id:length(24)}/avatar")]
    public async Task<FileStreamResult> GetAvatar(string id)
    {
        var user = await _userService.Get(user => user.Id == id);
        if (user.Avatar == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Avatar not found");
        }
        var stream = _fileService.Get(user.Avatar!, FileService.FolderName.Avatar);
        return await Task.FromResult(File(stream, "image/jpeg"));
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
    public async Task<NoContentResult> Delete()
    {
        var id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _userService.Remove(user => user.Id == id);
        await _notificationService.RemoveAll(notification => notification.UserId == id);
        return await Task.FromResult(NoContent());
    }
}