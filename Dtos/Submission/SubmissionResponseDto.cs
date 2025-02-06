using hackateam.Dtos.User;

namespace hackateam.Dtos.Submission
{
    public class SubmissionResponseDto
    {
        public SubmissionResponseDto(hackateam.Models.Submission submission, hackateam.Models.User user = null!)
        {
            Id = submission.Id;
            Status = submission.SubmissionStatus.ToString();
            SOP = submission.SOP;
            RequirementId = submission.RequirementId;
            User = user != null ? new UserResponseDto(user) : submission.UserId;
            CreatedAt = submission.CreatedAt;
        }

        public string? Id { get; set; }
        
        public string? Status { get; set; }

        public string? SOP { get; set; }

        public string? RequirementId { get; set; }

        public object? User { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}