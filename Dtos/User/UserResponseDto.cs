namespace hackateam.Dtos.User;
public class UserResponseDto
{
    public UserResponseDto(hackateam.Models.User user)
    {
        Id = user.Id;
        Email = user.Email;
        FullName = user.FullName;
        Header = user.Header;
        Tel = user.Tel;
    }

    public string? Id { get; set; }
    
    public string? Email { get; set; }

    public string? FullName { get; set; }

    public string? Header { get; set; }

    public string? Tel { get; set; }
}
