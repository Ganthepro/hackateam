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

    public ProjectController(ProjectService projectService)
    {
        _projectService = projectService;
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

        createProjectDto.UserId = id;
        var project = await _projectService.Create(createProjectDto);
        return await Task.FromResult(CreatedAtAction(nameof(Get), new { id = project.Id }, new ProjectResponseDto(project)));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<ProjectResponseDto>> Update(string id, UpdateProjectDto updateProjectDto)
    {
        var project = await _projectService.Get(project => project.Id == id);
        project = await _projectService.Update(project => project.Id == id, updateProjectDto);
        return await Task.FromResult(Ok(new ProjectResponseDto(project)));
    }

    [Authorize]
    [HttpDelete("{id:length(24)}")]
    public async Task<ActionResult<ProjectResponseDto>> Delete(string id)
    {
        var project = await _projectService.Get(project => project.Id == id);
        await _projectService.Remove(project => project.Id == id);
        return await Task.FromResult(Ok(new ProjectResponseDto(project)));
    }
}