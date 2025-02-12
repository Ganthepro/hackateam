using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Team;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class TeamController : Controller
{
    private readonly TeamService _teamService;
    private readonly HackathonService _hackathonService;
    private readonly UserService _userService;

    public TeamController(TeamService teamService, HackathonService hackathonService, UserService userService)
    {
        _teamService = teamService;
        _hackathonService = hackathonService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TeamResponseDto>>> Get(TeamQueryDto teamQueryDto)
    {
        var teams = await _teamService.GetAll(teamQueryDto);
        var teamDtos = new List<TeamResponseDto>();
        foreach (var team in teams)
        {
            var hackathon = await _hackathonService.Get(hackathon => hackathon.Id == team.HackathonId);
            var user = await _userService.Get(user => user.Id == team.LeadId);
            teamDtos.Add(new TeamResponseDto(team, hackathon, user));
        }
        return Ok(teamDtos);
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<TeamResponseDto>> Get(string id)
    {
        var team = await _teamService.Get(team => team.Id == id);
        if (team == null)
        {
            return NotFound(Constants.TeamMessage.NOT_FOUND);
        }
        var user = await _userService.Get(user => user.Id == team.LeadId);
        var hackathon = await _hackathonService.Get(hackathon => hackathon.Id == team.HackathonId);

        return Ok(new TeamResponseDto(team, hackathon, user));
    }

    [HttpPost]
    public async Task<ActionResult<TeamResponseDto>> Create(CreateTeamDto createTeamDto)
    {
        var hackathon = await _hackathonService.Get(hackathon => hackathon.Id == createTeamDto.HackathonId);
        if (hackathon == null)
        {
            return NotFound(Constants.HackathonMessage.NOT_FOUND);
        }

        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var team = await _teamService.Create(userId!, createTeamDto);
        return CreatedAtAction(
            nameof(Get),
            new { id = team.Id },
            new TeamResponseDto(team, hackathon));

    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<TeamResponseDto>> Update(string id, UpdateTeamDto updateTeamDto)
    {
        var team = await _teamService.Get(team => team.Id == id);
        if (team == null)
        {
            return NotFound(Constants.TeamMessage.NOT_FOUND);
        }

        var user = await _userService.Get(user => user.Id == team.LeadId);
        var updatedTeam = await _teamService.Update(team => team.Id == id, updateTeamDto);
        var hackathon = await _hackathonService.Get(hackathon => hackathon.Id == updatedTeam.HackathonId);
        
        return Ok(new TeamResponseDto(updatedTeam, hackathon, user));
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