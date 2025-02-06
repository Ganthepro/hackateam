using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Submission
{
    public class CreateSubmissionDto
    {
        [Required, Length(24, 24)]
        public string? RequirementId { get; set; }

        public string? SOP { get; set; }
    }
}