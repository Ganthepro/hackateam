namespace hackateam.Dtos.Auth;

public class JwtPayloadDto
{
    public string Id { get; set; } = null!;

    public hackateam.Models.User.Role Role { get; set; }
}