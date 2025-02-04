namespace hackateam.Dtos.Submission
{
    public class SubmissionResponseDto
    {
        public SubmissionResponseDto(hackateam.Models.Submission submission)
        {
            Id = submission.Id;
            Status = submission.SubmissionStatus.ToString();
            SOP = submission.SOP;
        }

        public string? Id { get; set; }
        
        public string? Status { get; set; }

        public string? SOP { get; set; }

        public string? RequirementId { get; set; }

        public string? UserId { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}