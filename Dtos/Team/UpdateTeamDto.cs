using hackateam.Models;

namespace hackateam.Dtos.Team
{
    public class UpdateTeamDto
    {
        public string? Name { get; set; }
        public string? HackathonName { get; set; }
        public string? HackathonDescription { get; set; }
        public TeamStatus? Status { get; set; }
        public DateTime? ExpiredAt { get; set; }
    }
}