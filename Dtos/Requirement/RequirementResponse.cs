using hackateam.Dtos.Team;
using hackateam.Dtos.Skill;

namespace hackateam.Dtos.Requirement
{
    public class RequirementResponseDto
    {
        public RequirementResponseDto(hackateam.Models.Requirement requirement, hackateam.Models.Team team = null!, hackateam.Models.Skill skill = null!)
        {
            Id = requirement.Id;
            Team = team != null ? new TeamResponseDto(team) : requirement.TeamId;
            RoleName = requirement.RoleName;
            MaxSeat = requirement.MaxSeat;
            Skill = skill != null ? new SkillResponseDto(skill) : requirement.SkillId; 
        }

        public string? Id { get; set; }
        public object? Team { get; set; }
        public string RoleName { get; set; }
        public int MaxSeat { get; set; }
        public object? Skill { get; set; }

    }
}