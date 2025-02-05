namespace hackateam.Dtos.Notification
{
    public class NotificationResponseDto
    {
        public NotificationResponseDto(hackateam.Models.Notification notification)
        {
            Id = notification.Id;
            Type = notification.Type;
            UserId = notification.UserId;
        }

        public string? Id { get; set; }
        
        public Models.Type? Type { get; set; }
        
        public string? UserId { get; set; }
    }
}