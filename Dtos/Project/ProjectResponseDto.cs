namespace hackateam.Dtos.Project
{
    public class ProjectResponseDto
    {
        public ProjectResponseDto(hackateam.Models.Project project)
        {
            Id = project.Id;
            Title = project.Title;
            Description = project.Description;
            UserId = project.UserId;
        }

        public string? Id { get; set; }
        
        public string? Title { get; set; }
        
        public string? Description { get; set; }

        public string? UserId { get; set; }

        public string? SkillId { get; set; }
    }
}