using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Submission
{
    public class UpdateSubmissionStatusDto
    {
        [Required, EnumDataType(typeof(Models.Submission.Status))]
        public hackateam.Models.Submission.Status? Status { get; set; }
    }
}