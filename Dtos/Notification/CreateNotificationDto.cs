using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Notification
{
    public class CreateNotificationDto
    {
        [Required]
        public Models.Type? Type { get; set; }

        [Required]
        public string? UserId { get; set; }

        [Required]
        public string? TeamId { get; set; }
    }
}