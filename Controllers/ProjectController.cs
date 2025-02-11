using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Project;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ProjectController : Controller
{
    private readonly ProjectService _projectService;
    private readonly SkillService _skillService;
    private readonly UserService _userService;
    public ProjectController(ProjectService projectService, SkillService skillService, UserService userService)
    {
        _projectService = projectService;
        _skillService = skillService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProjectResponseDto>>> Get()
    {
        var projects = await _projectService.GetAll();
        var projectDtos = new List<ProjectResponseDto>();
        foreach (var project in projects)
        {
            var skill = await _skillService.Get(skill => skill.Id == project.SkillId);
            var user = await _userService.Get(user => user.Id == project.UserId);
            projectDtos.Add(new ProjectResponseDto(project, skill, user));
        }
        return Ok(projectDtos);
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<ProjectResponseDto>> Get(string id)
    {
        var project = await _projectService.Get(project => project.Id == id);
        if (project == null)
        {
            return await Task.FromResult(NotFound(Constants.ProjectMessage.NOT_FOUND));
        }

        var skill = await _skillService.Get(skill => skill.Id == project.SkillId);
        var user = await _userService.Get(user => user.Id == project.UserId);

        return Ok(new ProjectResponseDto(project, skill, user));
    }

    [HttpPost]

    public async Task<ActionResult<ProjectResponseDto>> Create(CreateProjectDto createProjectDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var user = await _userService.Get(user => user.Id == userId);

        var skill = await _skillService.Get(skill => skill.Id == createProjectDto.SkillId);
        if (skill == null)
        {
            return await Task.FromResult(NotFound(Constants.SkillMessage.NOT_FOUND));
        }

        var project = await _projectService.Create(userId!, createProjectDto);
        return CreatedAtAction(
            nameof(Get),
            new { id = project.Id },
            new ProjectResponseDto(project, skill, user));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<ProjectResponseDto>> Update(string id, UpdateProjectDto updateProjectDto)
    {
        var project = await _projectService.Get(project => project.Id == id);
        if (project == null)
        {
            return NotFound(Constants.ProjectMessage.NOT_FOUND);
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (project.UserId != userId)
        {
            return Forbid();
        }

        var skill = await _skillService.Get(skill => skill.Id == (updateProjectDto.SkillId ?? project.SkillId));
        if (skill == null)
        {
            return NotFound(Constants.SkillMessage.NOT_FOUND);
        }

        var user = await _userService.Get(user => user.Id == project.UserId);
        if (user == null)
        {
            return NotFound(Constants.UserMessage.NOT_FOUND);
        }

        var updatedProject = await _projectService.Update(project => project.Id == id, updateProjectDto);

        return Ok(new ProjectResponseDto(updatedProject, skill, user));
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<ActionResult<ProjectResponseDto>> Delete(string id)
    {
        var project = await _projectService.Get(project => project.Id == id);
        if (project == null)
        {
            return NotFound(Constants.ProjectMessage.NOT_FOUND);
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (project.UserId != userId)
        {
            return Forbid();
        }

        var skill = await _skillService.Get(skill => skill.Id == project.SkillId);
        var user = await _userService.Get(user => user.Id == project.UserId);

        if (skill == null || user == null)
        {
            return NotFound("Related skill or user not found");
        }

        await _projectService.Remove(project => project.Id == id);


        return Ok(new ProjectResponseDto(project, skill, user));
    }
}