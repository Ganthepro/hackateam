namespace hackateam.Dtos.Requirement
{
    public class RequirementResponseDto
    {
        public RequirementResponseDto(hackateam.Models.Requirement requirement)
        {
            Id = requirement.Id;
            TeamId = requirement.TeamId;
            RoleName = requirement.RoleName;
            MaxSeat = requirement.MaxSeat;
            SkillId = requirement.SkillId;
        }

        public string? Id { get; set; }
        public string TeamId { get; set; }
        public string RoleName { get; set; }
        public int MaxSeat { get; set; }
        public string SkillId { get; set; }

    }
}