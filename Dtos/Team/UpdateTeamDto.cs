using hackateam.Models;

namespace hackateam.Dtos.Team
{
    public class UpdateTeamDto
    {
        public string? Name { get; set; }
        // public List<string>? CrewId { get; set; }
        public TeamStatus? Status { get; set; }
        public DateTime? ExpiredAt { get; set; }
    }
}