using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Requirement;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class RequirementController : Controller
{
    private readonly RequirementService _requirementService;
    private readonly TeamService _teamService;
    private readonly SkillService _skillService;
    private readonly SubmissionService _submissionService;

    public RequirementController(RequirementService requirementService, TeamService teamService, SkillService skillService, SubmissionService submissionService)
    {
        _requirementService = requirementService;
        _teamService = teamService;
        _skillService = skillService;
        _submissionService = submissionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<RequirementResponseDto>>> Get()
    {
        var requirements = await _requirementService.GetAll();

        var requirementDto = new List<RequirementResponseDto>();
        foreach (var requirement in requirements)
        {
            var team = await _teamService.Get(team => team.Id == requirement.TeamId);
            var skill = await _skillService.Get(skill => skill.Id == requirement.SkillId);
            requirementDto.Add(new RequirementResponseDto(requirement, team, skill));
        }
        return Ok(requirementDto);
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<RequirementResponseDto>> Get(string id)
    {
        var requirement = await _requirementService.Get(requirement => requirement.Id == id);
        if (requirement == null)
        {
            return NotFound(Constants.RequirementMessage.NOT_FOUND);
        }

        var team = await _teamService.Get(team => team.Id == requirement.TeamId);
        var skill = await _skillService.Get(skill => skill.Id == requirement.SkillId);

        return Ok(new RequirementResponseDto(requirement, team, skill));
    }

    [HttpPost]
    public async Task<ActionResult<RequirementResponseDto>> Create(CreateRequirementDto createRequirementDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var team = await _teamService.Get(team => team.Id == createRequirementDto.TeamId);
        if (team == null)
        {
            return NotFound(Constants.TeamMessage.NOT_FOUND);
        }

        if (team.LeadId != userId)
        {
            return NotFound(Constants.TeamMessage.NO_PERMISSION);
        }

        var skill = await _skillService.Get(skill => skill.Id == createRequirementDto.SkillId);
        if (skill == null)
        {
            return NotFound(Constants.SkillMessage.NOT_FOUND);
        }

        var requirement = await _requirementService.Create(createRequirementDto);
        return CreatedAtAction(
            nameof(Get),
            new { id = team.Id },
            new RequirementResponseDto(requirement, team, skill));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<RequirementResponseDto>> Update(string id, UpdateRequirementDto updateRequirementDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var requirement = await _requirementService.Get(requirement => requirement.Id == id);
        if (requirement == null)
        {
            return NotFound(Constants.RequirementMessage.NOT_FOUND);
        }

        var skill = await _skillService.Get(skill => skill.Id == updateRequirementDto.SkillId);
        if (skill == null)
        {
            return NotFound(Constants.SkillMessage.NOT_FOUND);
        }

        var updatedRequirement = await _requirementService.Update(requirement => requirement.Id == id, updateRequirementDto);
        var team = await _teamService.Get(team => team.Id == updatedRequirement.TeamId);

        if (team.LeadId != userId)
        {
            return NotFound(Constants.TeamMessage.NO_PERMISSION);
        }

        return Ok(new RequirementResponseDto(updatedRequirement, team, skill));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deletedRequirement = await _requirementService.Delete(id);

        if (deletedRequirement == null)
        {
            return NotFound(Constants.RequirementMessage.NOT_FOUND);
        }

        await _submissionService.RemoveAll(submission => submission.RequirementId == id);

        return NoContent();
    }
}