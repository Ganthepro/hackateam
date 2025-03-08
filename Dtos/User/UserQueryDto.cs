using System.ComponentModel.DataAnnotations;
using hackateam.Dtos.Utils;
using Microsoft.AspNetCore.Mvc;

namespace hackateam.Dtos.User;

public class UserQueryDto : PaginationQueryDto
{
    [FromQuery, EmailAddress]
    public string? Email { get; set; } = null!;

    [FromQuery, RegularExpression(@"^[a-zA-Z\s]*$", ErrorMessage = "Only letters and spaces are allowed")]
    public string? FullName { get; set; } = null!;

    [FromQuery, Phone]
    public string? Tel { get; set; } = null!;
}