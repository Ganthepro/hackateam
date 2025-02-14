using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Team;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace hackateam.Controllers;
using hackateam.Shared;
using System.Net;

[ApiController]
[Route("[controller]")]
public class TeamController : Controller
{
    private readonly TeamService _teamService;
    private readonly HackathonService _hackathonService;
    private readonly UserService _userService;
    private readonly FileService _fileService;

    public TeamController(TeamService teamService, HackathonService hackathonService, UserService userService, FileService fileService)
    {
        _teamService = teamService;
        _hackathonService = hackathonService;
        _userService = userService;
        _fileService = fileService;
    }

    [HttpPut("banner")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateBanner(string id, IFormFile file)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var team = await _teamService.Get(team => team.Id == id);
        if (team.LeadId != userId)
        {
            return NotFound(Constants.TeamMessage.NO_PERMISSION);
        }

        var fileName = await _fileService.UpdateFile(team.Id + Path.GetExtension(file.FileName), FileService.FolderName.Teams, file);
        _teamService.UpdateBanner(team.Id!, fileName!);
        return await Task.FromResult(NoContent());
    }

    [HttpGet("{id:length(24)}/banner")]
    public async Task<FileStreamResult> GetAvatar(string id)
    {
        var team = await _teamService.Get(team => team.Id == id);
        if (team.Banner == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Banner not found");
        }
        var stream = _fileService.Get(team.Banner!, FileService.FolderName.Teams);
        return await Task.FromResult(File(stream, "image/jpeg"));
    }

    [HttpGet]
    [Authorize]
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
    [Authorize]
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
    [Authorize]
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
    [Authorize]
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
    [Authorize]
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