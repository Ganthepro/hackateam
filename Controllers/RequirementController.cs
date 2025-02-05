using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Requirement;
using Microsoft.AspNetCore.Authorization;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class RequirementController : Controller
{
    private readonly RequirementService _requirementService;

    public RequirementController(RequirementService requirementService)
    {
        _requirementService = requirementService;
    }

    [HttpGet]
    public async Task<ActionResult<List<RequirementResponseDto>>> Get()
    {
        var requirements = await _requirementService.GetAll();
        return await Task.FromResult(requirements.Select(requirement => new RequirementResponseDto(requirement)).ToList());
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<RequirementResponseDto>> Get(string id)
    {
        return await Task.FromResult(Ok(new RequirementResponseDto(await _requirementService.Get(requirement => requirement.Id == id))));
    }

    [HttpPost]
    public async Task<ActionResult<RequirementResponseDto>> Create(CreateRequirementDto createRequirementDto)
    {
        var requirement = await _requirementService.Create(createRequirementDto);
        return await Task.FromResult(CreatedAtAction(nameof(Get), new { id = requirement.Id }, new RequirementResponseDto(requirement)));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<RequirementResponseDto>> Update(string id, UpdateRequirementDto updateRequirementDto)
    {
        var requirement = await _requirementService.Update(requirement => requirement.Id == id, updateRequirementDto);
        return await Task.FromResult(Ok(new RequirementResponseDto(requirement)));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deletedRequirement = await _requirementService.Delete(id);

        if (deletedRequirement == null)
        {
            return NotFound(Constants.RequirementMessage.NOT_FOUND);
        }

        return NoContent();
    }
}