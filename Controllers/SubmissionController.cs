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

    public SubmissionController(SubmissionService submissionService)
    {
        _submissionService = submissionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SubmissionResponseDto>>> Get()
    {
        var submissions = await _submissionService.GetAll();
        return await Task.FromResult(submissions.Select(submission => new SubmissionResponseDto(submission)).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<SubmissionResponseDto>> Create(CreateSubmissionDto createSubmissionDto)
    {
        Console.WriteLine("Create submission");
        var submission = await _submissionService.Create(createSubmissionDto);
        return CreatedAtAction(nameof(Get), new { id = submission.Id }, new SubmissionResponseDto(submission));
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<SubmissionResponseDto>> Get(string id) =>
        await Task.FromResult(Ok(new SubmissionResponseDto(await _submissionService.Get(submission => submission.Id == id))));


    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<SubmissionResponseDto>> Update(string id, UpdateSubmissionDto updateSubmissionDto)
    {
        var submission = await _submissionService.Get(submission => submission.Id == id);
        submission = await _submissionService.Update(submission => submission.Id == id, updateSubmissionDto);
        return await Task.FromResult(Ok(new SubmissionResponseDto(submission)));
    }

    [HttpDelete]
    public async Task<ActionResult> Delete()
    {
        var id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _submissionService.Remove(submission => submission.Id == id);
        return NoContent();
    }
}