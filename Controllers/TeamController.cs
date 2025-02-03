using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Team;
using Microsoft.AspNetCore.Authorization;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class TeamController : Controller
{
    private readonly TeamService _teamService;

    public TeamController(TeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TeamResponseDto>>> Get()
    {
        var skills = await _teamService.GetAll();
        return await Task.FromResult(skills.Select(team => new TeamResponseDto(team)).ToList());
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<TeamResponseDto>> Get(string id)
    {
        return await Task.FromResult(Ok(new TeamResponseDto(await _teamService.Get(skill => skill.Id == id))));
    }

    [HttpPost]
    public async Task<ActionResult<TeamResponseDto>> Create(CreateTeamDto createTeamDto)
    {
        var team = await _teamService.Create(createTeamDto);
        return await Task.FromResult(CreatedAtAction(nameof(Get), new { id = team.Id }, new TeamResponseDto(team)));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<TeamResponseDto>> Update(string id, UpdateTeamDto updateTeamDto)
    {
        var team = await _teamService.Update(team => team.Id == id, updateTeamDto);
        return await Task.FromResult(Ok(new TeamResponseDto(team)));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deletedHackathon = await _teamService.Delete(id);

        if (deletedHackathon == null)
        {
            return NotFound(Constants.TeamMessage.NOT_FOUND);
        }

        return NoContent();
    }
}