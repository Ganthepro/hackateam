using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.User;

public class UpdateUserDto
{
    [RegularExpression(@"^[a-zA-Z\s]*$", ErrorMessage = "Only letters and spaces are allowed")]
    public string? FullName { get; set; }

    public string? Header { get; set; }

    [Phone]
    public string? Tel { get; set; }
}