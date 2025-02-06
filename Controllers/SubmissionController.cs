using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Submission;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class SubmissionController : Controller
{
    private readonly SubmissionService _submissionService;
    private readonly UserService _userServices;

    public SubmissionController(SubmissionService submissionService, UserService userServices)
    {
        _submissionService = submissionService;
        _userServices = userServices;
    }

    [HttpGet]
    public async Task<ActionResult<List<SubmissionResponseDto>>> Get()
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var submissions = await _submissionService.GetAll();
        var user = await _userServices.Get(user => user.Id == userId);
        return await Task.FromResult(submissions.Select(submission => new SubmissionResponseDto(submission)).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<SubmissionResponseDto>> Create(CreateSubmissionDto createSubmissionDto)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var submission = await _submissionService.Create(userId!, createSubmissionDto);
        var user = await _userServices.Get(user => user.Id == submission.UserId);
        return CreatedAtAction(nameof(Get), new { id = submission.Id }, new SubmissionResponseDto(submission, user));
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<SubmissionResponseDto>> Get(string id)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var submission = await _submissionService.Get(submission => submission.Id == id && submission.UserId == userId);
        var user = await _userServices.Get(user => user.Id == submission.UserId);
        return await Task.FromResult(Ok(new SubmissionResponseDto(submission, user)));
    }


    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<SubmissionResponseDto>> Update(string id, UpdateSubmissionDto updateSubmissionDto)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var submission = await _submissionService.Update(submission => submission.Id == id && submission.UserId == userId, updateSubmissionDto);
        var user = await _userServices.Get(user => user.Id == submission.UserId);
        return await Task.FromResult(Ok(new SubmissionResponseDto(submission, user)));
    }

    [HttpDelete]
    public async Task<ActionResult> Delete()
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _submissionService.Remove(submission => submission.Id == userId);
        return NoContent();
    }
}