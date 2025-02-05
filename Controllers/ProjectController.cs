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
    public ProjectController(ProjectService projectService, SkillService skillService, UserService userService)
    {
        _projectService = projectService;
        _skillService = skillService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProjectResponseDto>>> Get()
    {
        var projects = await _projectService.GetAll();
        return await Task.FromResult(projects.Select(project => new ProjectResponseDto(project)).ToList());
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<ProjectResponseDto>> Get(string id)
    {
        return await Task.FromResult(Ok(new ProjectResponseDto(await _projectService.Get(project => project.Id == id))));
    }

    [HttpPost]

    public async Task<ActionResult<ProjectResponseDto>> Create(CreateProjectDto createProjectDto)
    {
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var skill = await _skillService.Get(skill => skill.Id == createProjectDto.SkillId);
        if (skill == null)
        {
            return await Task.FromResult(NotFound(Constants.SkillMessage.NOT_FOUND));
        }

        var project = await _projectService.Create(id!, createProjectDto);
        return await Task.FromResult(CreatedAtAction(nameof(Get), new { id = project.Id }, new ProjectResponseDto(project)));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<ProjectResponseDto>> Update(string id, UpdateProjectDto updateProjectDto)
    {
        if (updateProjectDto.SkillId != null)
        {
            var skill = await _skillService.Get(skill => skill.Id == updateProjectDto.SkillId);
            if (skill == null)
            {
                return await Task.FromResult(NotFound(Constants.SkillMessage.NOT_FOUND));
            }
        }
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var project = await _projectService.Get(project => project.Id == id);

        if (project.UserId != userId)
        {
            return await Task.FromResult(Forbid());
        }

        project = await _projectService.Update(project => project.Id == id, updateProjectDto);
        return await Task.FromResult(Ok(new ProjectResponseDto(project)));
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<ActionResult<ProjectResponseDto>> Delete(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var project = await _projectService.Get(project => project.Id == id);

        if (project.UserId != userId)
        {
            return await Task.FromResult(Forbid());
        }
        await _projectService.Remove(project => project.Id == id);
        return await Task.FromResult(Ok(new ProjectResponseDto(project)));
    }
}