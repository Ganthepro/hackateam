using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Team
{
    public class CreateTeamDto
    {
        [Required(ErrorMessage = "Team name is required")]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Hackathon Name is required")]
        public string HackathonName { get; set; }

        [Required(ErrorMessage = "Hackathon Description is required")]
        public string HackathonDescription { get; set; }

        [Required(ErrorMessage = "Expiration date is required")]
        public DateTime ExpiredAt { get; set; }
    }
}