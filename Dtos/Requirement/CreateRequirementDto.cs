using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Requirement
{
    public class CreateRequirementDto
    {

        [Required]
        public string? TeamId { get; set; }

        [Required]
        public string? RoleName { get; set; }

        [Required]
        [Range(1, 99, ErrorMessage = "MaxSeat must be greater than 0 and not more than 99")]
        public int MaxSeat { get; set; }

        [Required]
        public string? SkillId { get; set; }
    }
}