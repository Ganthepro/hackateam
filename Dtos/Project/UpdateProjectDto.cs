using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Project
{
    public class UpdateProjectDto
    {
        public string? Title { get; set; }
        
        public string? Description { get; set; }

        public string? SkillId { get; set; }
    }
}