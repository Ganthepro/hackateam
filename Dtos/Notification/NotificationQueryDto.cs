using System.ComponentModel.DataAnnotations;
using hackateam.Dtos.Utils;
using Microsoft.AspNetCore.Mvc;

namespace hackateam.Dtos.Notification
{
    public class NotificationQueryDto : PaginationQueryDto
    {
        [FromQuery]
        public Models.Type? Type { get; set; } = null!;

        [FromQuery]
        [RegularExpression(@"^[a-zA-Z0-9\s-]*$")]
        public string? TeamName { get; set; } = null!;
    }
}   