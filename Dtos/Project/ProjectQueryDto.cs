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
        public string? UserId { get; set; } = null!;

        [FromQuery]
        public string? SkillId { get; set; } = null!;
    }
}