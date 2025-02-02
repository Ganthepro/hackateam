using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.User;

public class CreateUserDto
{
    [Required, EmailAddress]
    public string? Email { get; set; }

    [Required, MinLength(8)]
    public string? Password { get; set; }

    [Required, RegularExpression(@"^[a-zA-Z\s]*$", ErrorMessage = "Only letters and spaces are allowed")]
    public string? FullName { get; set; }

    public string? Header { get; set; }

    [Required, Phone]
    public string? Tel { get; set; }
}