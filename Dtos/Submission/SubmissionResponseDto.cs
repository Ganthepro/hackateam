using hackateam.Dtos.User;

namespace hackateam.Dtos.Submission
{
    public class SubmissionResponseDto
    {
        public SubmissionResponseDto(hackateam.Models.Submission submission, hackateam.Models.User user)
        {
            Id = submission.Id;
            Status = submission.SubmissionStatus.ToString();
            SOP = submission.SOP;
            RequirementId = submission.RequirementId;
            UserId = new UserResponseDto(user);
            CreatedAt = submission.CreatedAt;
        }

        public string? Id { get; set; }
        
        public string? Status { get; set; }

        public string? SOP { get; set; }

        public string? RequirementId { get; set; }

        public UserResponseDto? UserId { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}