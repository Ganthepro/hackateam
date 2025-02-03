using System.ComponentModel.DataAnnotations;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Annotations;

namespace hackateam.Dtos.Project
{
    public class CreateProjectDto
    {
        [Required]
        
        public string? Title { get; set; }

        [Required]
        public string? Description { get; set; }


        [Required]
        public string? SkillId { get; set; }
    }
}