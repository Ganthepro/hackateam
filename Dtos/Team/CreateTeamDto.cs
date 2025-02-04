using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Team
{
    public class CreateTeamDto
    {
        [Required(ErrorMessage = "Team name is required")]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Team lead ID is required")]
        public string LeadId { get; set; }

        [Required(ErrorMessage = "Hackathon ID is required")]
        public string HackathonId { get; set; }

        [Required(ErrorMessage = "Expiration date is required")]
        public DateTime ExpiredAt { get; set; } // Changed to non-nullable
    }
}