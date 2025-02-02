using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace hackateam.Models;

public class User
{
    public enum Role
    {
        Admin,
        User
    }
    
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRequired]
    public string? Email { get; set; }

    [BsonRequired]
    public string? Password { get; set; }

    [BsonRequired]
    public string? FullName { get; set; }

    public string? Header { get; set; }

    [BsonElement("Role")]
    [BsonRequired]
    public Role? UserRole { get; set; } = Role.User;

    [BsonRequired]
    public string? Tel { get; set; }
}
