using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Skill;
using Microsoft.AspNetCore.Authorization;

namespace hackateam.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class SkillController : Controller
{
    private readonly SkillService _skillService;

    public SkillController(SkillService skillService)
    {
        _skillService = skillService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SkillResponseDto>>> Get(SkillQueryDto skillQueryDto)
    {
        var skills = await _skillService.GetAll(skillQueryDto);
        return await Task.FromResult(skills.Select(skill => new SkillResponseDto(skill)).ToList());
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<SkillResponseDto>> Get(string id)
    {
        return await Task.FromResult(Ok(new SkillResponseDto(await _skillService.Get(skill => skill.Id == id))));
    }

    [HttpPost]
    public async Task<ActionResult<SkillResponseDto>> Create(CreateSkillDto createSkillDto)
    {
        var skill = await _skillService.Create(createSkillDto);
        return await Task.FromResult(CreatedAtAction(nameof(Get), new { id = skill.Id }, new SkillResponseDto(skill)));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<SkillResponseDto>> Update(string id, UpdateSkillDto updateSkillDto)
    {
        var skill = await _skillService.Get(skill => skill.Id == id);
        skill = await _skillService.Update(skill => skill.Id == id, updateSkillDto);
        return await Task.FromResult(Ok(new SkillResponseDto(skill)));
    }

    [Authorize]
    [HttpDelete("{id:length(24)}")]
    public async Task<ActionResult<SkillResponseDto>> Delete(string id)
    {
        var skill = await _skillService.Get(skill => skill.Id == id);
        await _skillService.Remove(skill => skill.Id == id);
        return await Task.FromResult(Ok(new SkillResponseDto(skill)));
    }
}