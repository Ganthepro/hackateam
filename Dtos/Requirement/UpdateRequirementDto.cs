using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Requirement
{
    public class UpdateRequirementDto
    {
        public string? RoleName { get; set; }

        [Range(1, 99, ErrorMessage = "MaxSeat must be greater than 0 and not more than 99")]
        public int? MaxSeat { get; set; }
        public string? SkillId { get; set; }
    }
}