using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Submission;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using hackateam.Dtos.Utils;
using hackateam.Shared;
using System.Net;
using hackateam.Models;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class SubmissionController : Controller
{
    private readonly SubmissionService _submissionService;
    private readonly UserService _userServices;
    private readonly RequirementService _requirementService;
    private readonly TeamService _teamService;

    public SubmissionController(SubmissionService submissionService, UserService userServices, RequirementService requirementService, TeamService teamService)
    {
        _submissionService = submissionService;
        _userServices = userServices;
        _requirementService = requirementService;
        _teamService = teamService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SubmissionResponseDto>>> Get(PaginationQueryDto query)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var submissions = await _submissionService.GetAll(userId, query);
        var user = await _userServices.Get(user => user.Id == userId);

        return await Task.FromResult(submissions.Select(submission => new SubmissionResponseDto(submission, user)).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<SubmissionResponseDto>> Create(CreateSubmissionDto createSubmissionDto)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var requirement = await _requirementService.Get(requirement => requirement.Id == createSubmissionDto.RequirementId);
        var team = await _teamService.Get(team => team.Id == requirement.TeamId);
        if (team.LeadId == userId)
        {
            throw new HttpResponseException((int)HttpStatusCode.Forbidden, "Team lead cannot submit");
        }
        if (team.Status === TeamStatus.Closed || team.Status === TeamStatus.Cancelled)
        {
            throw new HttpResponseException((int)HttpStatusCode.Forbidden, "Team is closed or cancelled");
        }
        var submission = await _submissionService.Create(userId!, createSubmissionDto);
        var user = await _userServices.Get(user => user.Id == submission.UserId);
        return CreatedAtAction(nameof(Get), new { id = submission.Id }, new SubmissionResponseDto(submission, user, requirement));
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<SubmissionResponseDto>> Get(string id)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var submission = await _submissionService.Get(submission => submission.Id == id && submission.UserId == userId);
        var user = await _userServices.Get(user => user.Id == submission.UserId);
        var requirement = await _requirementService.Get(requirement => requirement.Id == submission.RequirementId);
        return await Task.FromResult(Ok(new SubmissionResponseDto(submission, user, requirement)));
    }


    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<SubmissionResponseDto>> Update(string id, UpdateSubmissionDto updateSubmissionDto)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var submission = await _submissionService.Update(submission => submission.Id == id && submission.UserId == userId, updateSubmissionDto);
        var user = await _userServices.Get(user => user.Id == submission.UserId);
        var requirement = await _requirementService.Get(requirement => requirement.Id == submission.RequirementId);
        return await Task.FromResult(Ok(new SubmissionResponseDto(submission, user, requirement)));
    }

    [HttpPatch("{id:length(24)}/status")]
    public async Task<ActionResult<SubmissionResponseDto>> UpdateStatus(string id, UpdateSubmissionStatusDto updateSubmissionStatusDto)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var submission = await _submissionService.Get(submission => submission.Id == id);
        var requirement = await _requirementService.Get(requirement => requirement.Id == submission.RequirementId);
        var team = await _teamService.Get(team => team.Id == requirement.TeamId);
        if (team.LeadId != userId)
        {
            throw new HttpResponseException((int)HttpStatusCode.Forbidden, "You are not allowed to update this submission");
        }
        submission = await _submissionService.UpdateStatus(submission => submission.Id == id, updateSubmissionStatusDto);
        var user = await _userServices.Get(user => user.Id == submission.UserId);
        return await Task.FromResult(Ok(new SubmissionResponseDto(submission, user, requirement)));
    }

    [HttpDelete]
    public async Task<ActionResult> Delete()
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _submissionService.Remove(submission => submission.Id == userId);
        return NoContent();
    }
}