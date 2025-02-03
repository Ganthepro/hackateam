using hackateam.Models;

namespace hackateam.Dtos.Team
{
    public class TeamResponseDto
    {
        public TeamResponseDto(hackateam.Models.Team team)
        {
            Id = team.Id;
            Name = team.Name;
            LeadId = team.LeadId;
            CrewId = team.CrewId;
            Status = team.Status;
            HackathonId = team.HackathonId;
            CreatedAt = team.CreatedAt;
            UpdatedAt = team.UpdatedAt;
            ExpiredAt = team.ExpiredAt;
        }

        public string? Id { get; set; }
        public string Name { get; set; }
        public string LeadId { get; set; }
        public List<string> CrewId { get; set; }
        public TeamStatus Status { get; set; }
        public string HackathonId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime ExpiredAt { get; set; }
    }
}
