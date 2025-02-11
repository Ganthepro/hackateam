using hackateam.Dtos.Skill;
using hackateam.Dtos.User;

namespace hackateam.Dtos.Project
{
    public class ProjectResponseDto
    {
        public ProjectResponseDto(hackateam.Models.Project project, hackateam.Models.Skill skill, hackateam.Models.User user)
        {
            Id = project.Id;
            Title = project.Title;
            Description = project.Description;
            UserResponse = new UserResponseDto(user);
            SkillResponse = new SkillResponseDto(skill);
        }

        public string? Id { get; set; }
        
        public string? Title { get; set; }
        
        public string? Description { get; set; }

        public UserResponseDto? UserResponse { get; set; }

        public SkillResponseDto? SkillResponse { get; set; }
    }
}