using hackateam.Dtos.Team;
using hackateam.Dtos.User;

namespace hackateam.Dtos.Notification
{
    public class NotificationResponseDto
    {
        public NotificationResponseDto(hackateam.Models.Notification notification, hackateam.Models.User user, hackateam.Models.Team team)
        {
            Id = notification.Id;
            Type = notification.Type;
            UserResponse = new UserResponseDto(user);
            TeamResponse = new TeamResponseDto(team);
        }

        public string? Id { get; set; }
        
        public Models.Type? Type { get; set; }
        
        public UserResponseDto? UserResponse { get; set; }
        public TeamResponseDto? TeamResponse { get; set; }
    }
}