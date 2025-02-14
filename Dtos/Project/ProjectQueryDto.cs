using System.ComponentModel.DataAnnotations;
using hackateam.Dtos.Utils;
using Microsoft.AspNetCore.Mvc;

namespace hackateam.Dtos.Project
{
    public class ProjectQueryDto : PaginationQueryDto
    {
        [FromQuery]
        public string? Title { get; set; } = null!;

        [FromQuery]
        public string? UserName { get; set; } = null!;

        [FromQuery]
        public string? SkillName { get; set; } = null!;
    }
}