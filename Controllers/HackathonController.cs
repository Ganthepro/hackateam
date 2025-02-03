using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Hackathon;
using Microsoft.AspNetCore.Authorization;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class HackathonController : ControllerBase
{
    private readonly HackathonService _hackathonService;

    public HackathonController(HackathonService hackathonService)
    {
        _hackathonService = hackathonService;
    }

    [HttpGet]
    public async Task<ActionResult<List<HackathonResponseDto>>> Get()
    {
        var hackathons = await _hackathonService.GetAll();
        return await Task.FromResult(hackathons.Select(hackathon => new HackathonResponseDto(hackathon)).ToList());
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<HackathonResponseDto>> Get(string id)
    {
        return await Task.FromResult(Ok(new HackathonResponseDto(await _hackathonService.Get(project => project.Id == id))));
    }

    [HttpPost]
    public async Task<ActionResult<HackathonResponseDto>> Create(CreateHackathonDto createHackathonDto)
    {
        var hackathon = await _hackathonService.Create(createHackathonDto);
        return await Task.FromResult(CreatedAtAction(nameof(Get), new { id = hackathon.Id }, new HackathonResponseDto(hackathon)));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<HackathonResponseDto>> Update(string id, UpdateHackathonDto updateHackathonDto)
    {

        var hackathon = await _hackathonService.Get(hackathon => hackathon.Id == id);
        if (hackathon == null)
        {
            return await Task.FromResult(NotFound(Constants.HackathonMessage.NOT_FOUND));
        }

        hackathon = await _hackathonService.Update(hackathon => hackathon.Id == id, updateHackathonDto);
        return await Task.FromResult(Ok(new HackathonResponseDto(hackathon)));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deletedHackathon = await _hackathonService.Delete(id);

        if (deletedHackathon == null)
        {
            return NotFound(Constants.HackathonMessage.NOT_FOUND);
        }

        return NoContent();
    }
}

