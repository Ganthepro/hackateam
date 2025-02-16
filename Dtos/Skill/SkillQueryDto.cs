using System.ComponentModel.DataAnnotations;
using hackateam.Dtos.Utils;
using Microsoft.AspNetCore.Mvc;

namespace hackateam.Dtos.Skill;

public class SkillQueryDto : PaginationQueryDto
{
    [FromQuery, RegularExpression(@"^[a-zA-Z\s]*$", ErrorMessage = "Only letters and spaces are allowed")]
    public string? Title { get; set; } = null!;
}