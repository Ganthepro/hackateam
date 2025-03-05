using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Team;
using hackateam.Dtos.Submission;
using hackateam.Dtos.Requirement;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace hackateam.Controllers;

using hackateam.Dtos.Skill;
using hackateam.Models;
using hackateam.Shared;
using System.Net;

[ApiController]
[Route("[controller]")]
public class TeamController : Controller
{
    private readonly TeamService _teamService;
    private readonly UserService _userService;
    private readonly FileService _fileService;
    private readonly ProjectService _projectService;
    private readonly SkillService _skillService;
    private readonly RequirementService _requirementService;
    private readonly SubmissionService _submissionService;

    public TeamController(TeamService teamService, UserService userService, FileService fileService, RequirementService requirementService, SubmissionService submissionService, SkillService skillService, ProjectService projectService)
    {
        _teamService = teamService;
        _userService = userService;
        _fileService = fileService;
        _requirementService = requirementService;
        _submissionService = submissionService;
        _skillService = skillService;
        _projectService = projectService;
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

    [HttpGet("{id:length(24)}/submissions")]
    public async Task<ActionResult<List<SubmissionResponseDto>>> GetAllSubmissionByTeamId(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var team = await _teamService.Get(team => team.Id == id);
        if (team == null)
        {
            return NotFound(Constants.TeamMessage.NOT_FOUND);
        }

        if (team.LeadId != userId)
        {
            return NotFound(Constants.TeamMessage.NO_PERMISSION);
        }

        var requirements = await _requirementService.GetAllByTeamId(id);

        if (requirements == null || !requirements.Any())
        {
            return NotFound(Constants.RequirementMessage.NOT_FOUND);
        }

        var requirementIds = requirements.Select(r => r.Id).ToList();
        var submissions = await _submissionService.GetAllByRequirementIds(requirementIds);

        if (submissions == null || !submissions.Any())
        {
            return NotFound(Constants.SubmissionMessage.NOT_FOUND);
        }

        var userTasks = submissions.Select(async submission =>
        {
            var user = await _userService.Get(u => u.Id == submission.UserId);
            return new SubmissionResponseDto(submission, user);
        });

        var submissionDtos = await Task.WhenAll(userTasks);

        return Ok(submissionDtos);
    }

    [HttpGet("{id:length(24)}/requirements")]
    public async Task<ActionResult<List<RequirementResponseDto>>> GetAllRequirementByTeamId(string id)
    {
        var team = await _teamService.Get(team => team.Id == id);
        if (team == null)
        {
            return NotFound(Constants.TeamMessage.NOT_FOUND);
        }

        var requirements = await _requirementService.GetAllByTeamId(id);

        if (requirements == null || !requirements.Any())
        {
            return NotFound(Constants.RequirementMessage.NOT_FOUND);
        }

        var userTasks = requirements.Select(async requirement =>
        {
            var skill = await _skillService.Get(skill => skill.Id == requirement.SkillId);
            return new RequirementResponseDto(requirement, team, skill);
        });

        var requirementDtos = await Task.WhenAll(userTasks);

        return Ok(requirementDtos);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<TeamResponseDto>>> Get(TeamQueryDto teamQueryDto)
    {
        var teams = await _teamService.GetAll(teamQueryDto);
        var teamDtos = new List<TeamResponseDto>();
        foreach (var team in teams)
        {
            await _teamService.Update(team => team.Id == team.Id && team.ExpiredAt < DateTime.UtcNow, new UpdateTeamDto { Status = Models.TeamStatus.Closed });
            var user = await _userService.Get(user => user.Id == team.LeadId);
            teamDtos.Add(new TeamResponseDto(team, user));
        }
        return Ok(teamDtos);
    }

    [HttpGet("recommend")]
    [Authorize]
    public async Task<ActionResult<List<TeamResponseDto>>> GetRecommend(TeamQueryDto teamQueryDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _userService.Get(user => user.Id == userId);
        var projects = await _projectService.GetAll(project => project.UserId == userId);
        var userSkillIds = new HashSet<string>();
        foreach (var project in projects)
        {
            if (!string.IsNullOrEmpty(project.SkillId))
            {
                userSkillIds.Add(project.SkillId);
            }
        }

        var teams = await _teamService.GetAll(teamQueryDto);
        var teamDtos = new List<TeamResponseDto>();

        foreach (var team in teams)
        {
            if (team.LeadId != userId)
            {
                var leadUser = await _userService.Get(user => user.Id == team.LeadId);
                var requirements = await _requirementService.GetAllByTeamId(team.Id!);

                bool hasMatchingSkill = requirements.Any(requirement => 
                    !string.IsNullOrEmpty(requirement.SkillId) && userSkillIds.Contains(requirement.SkillId));

                if (requirements != null && requirements.Any())
                {
                    var requirementIds = requirements.Select(r => r.Id).ToList();
                    var submissions = await _submissionService.GetAllByRequirementIds(requirementIds);

                    if (submissions == null || !submissions.Any())
                    {
                        bool hasUserSubmitted = submissions.Any(submission => submission.UserId == userId);
                        if (hasMatchingSkill && !hasUserSubmitted)
                        {
                            teamDtos.Add(new TeamResponseDto(team, leadUser));
                        }
                    }

                }
                else if (hasMatchingSkill)
                {
                    teamDtos.Add(new TeamResponseDto(team, leadUser));
                }
            }

        }

        if (teamDtos.Count == 0)
        {
            return NotFound(Constants.TeamMessage.NO_MATCH);
        }

        return Ok(teamDtos);
    }

    [HttpGet("other")]
    [Authorize]
    public async Task<ActionResult<List<TeamResponseDto>>> GetOtherTeam(TeamQueryDto teamQueryDto)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var teams = await _teamService.GetAll(teamQueryDto);
        var teamDtos = new List<TeamResponseDto>();

        foreach (var team in teams)
        {
            if (team.LeadId != userId)
            {
                var leadUser = await _userService.Get(user => user.Id == team.LeadId);
                var requirements = await _requirementService.GetAllByTeamId(team.Id);

                if (requirements == null || !requirements.Any())
                {
                    teamDtos.Add(new TeamResponseDto(team, leadUser));
                    continue;
                }

                var requirementIds = requirements.Select(r => r.Id).ToList();
                var submissions = await _submissionService.GetAllByRequirementIds(requirementIds);

                if (submissions == null || !submissions.Any())
                {
                    teamDtos.Add(new TeamResponseDto(team, leadUser));
                    continue;
                }

                bool hasUserSubmitted = submissions.Any(submission => submission.UserId == userId);
                if (!hasUserSubmitted)
                {
                    teamDtos.Add(new TeamResponseDto(team, leadUser));
                }
            }
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

        return Ok(new TeamResponseDto(team, user));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<TeamResponseDto>> Create(CreateTeamDto createTeamDto)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var team = await _teamService.Create(userId!, createTeamDto);
        var user = await _userService.Get(user => user.Id == team.LeadId);

        return CreatedAtAction(
            nameof(Get),
            new { id = team.Id },
            new TeamResponseDto(team, user));

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

        return Ok(new TeamResponseDto(updatedTeam, user));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(string id)
    {
        var team = await _teamService.Get(team => team.Id == id);
        if (team == null)
        {
            return NotFound(Constants.TeamMessage.NOT_FOUND);
        }

        var requirements = await _requirementService.GetAll();
        var teamRequirements = requirements.Where(req => req.TeamId == id).ToList();

        foreach (var requirement in teamRequirements)
        {
            await _submissionService.RemoveAll(sub => sub.RequirementId == requirement.Id);
            await _requirementService.Delete(requirement.Id!);
        }
        await _teamService.Delete(id);

        return NoContent();
    }
}