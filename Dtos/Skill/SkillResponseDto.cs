namespace hackateam.Dtos.Skill
{
    public class SkillResponseDto
    {
        public SkillResponseDto(hackateam.Models.Skill skill)
        {
            Id = skill.Id;
            Title = skill.Title;
        }

        public string? Id { get; set; }
        
        public string? Title { get; set; }
    }
}