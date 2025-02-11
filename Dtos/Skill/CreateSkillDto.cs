using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Skill
{
    public class CreateSkillDto
    {
        [Required]
        public string? Title { get; set; }
    }
}