using Microsoft.AspNetCore.Mvc;
using hackateam.Models;
using hackateam.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
public class HackathonController : ControllerBase
{
    private readonly HackathonService _hackathonService;

    public HackathonController(HackathonService hackathonService)
    {
        _hackathonService = hackathonService;
    }

    // GET: api/hackathon
    [HttpGet]
    public async Task<ActionResult<List<Hackathon>>> Get()
    {
        var hackathons = await _hackathonService.GetAllAsync();
        return Ok(hackathons);
    }

    // GET: api/hackathon/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Hackathon>> Get(string id)
    {
        var hackathon = await _hackathonService.GetByIdAsync(id);

        if (hackathon == null)
        {
            return NotFound();
        }

        return Ok(hackathon);
    }

    // POST: api/hackathon
    [HttpPost]
    public async Task<ActionResult> Create(Hackathon hackathon)
    {
        await _hackathonService.CreateAsync(hackathon);
        return CreatedAtAction(nameof(Get), new { id = hackathon.Id }, hackathon);
    }

    // PUT: api/hackathon/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Hackathon hackathon)
    {
        var existingHackathon = await _hackathonService.GetByIdAsync(id);
        if (existingHackathon == null)
        {
            return NotFound();
        }

        await _hackathonService.UpdateAsync(id, hackathon);
        return NoContent();
    }

    // DELETE: api/hackathon/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var hackathon = await _hackathonService.GetByIdAsync(id);
        if (hackathon == null)
        {
            return NotFound();
        }

        await _hackathonService.DeleteAsync(id);
        return NoContent();
    }
}

