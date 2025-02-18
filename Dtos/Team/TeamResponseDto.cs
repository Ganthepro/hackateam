using hackateam.Models;
using hackateam.Dtos.User;

namespace hackateam.Dtos.Team
{
    public class TeamResponseDto
    {
        public TeamResponseDto(hackateam.Models.Team team, hackateam.Models.User user = null!)
        {
            Id = team.Id;
            Name = team.Name;
            LeadResponse = user != null ? new UserResponseDto(user) : team.LeadId;
            Status = team.Status;
            HackathonName = team.HackathonName;
            HackathonDescription = team.HackathonDescription;
            CreatedAt = team.CreatedAt;
            UpdatedAt = team.UpdatedAt;
            ExpiredAt = team.ExpiredAt;
        }

        public string? Id { get; set; }
        public string Name { get; set; }
        public object? LeadResponse { get; set; }
        public TeamStatus Status { get; set; }
        public string HackathonName { get; set; }
        public string HackathonDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime ExpiredAt { get; set; }
    }
}
