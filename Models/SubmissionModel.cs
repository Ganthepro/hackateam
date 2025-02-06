using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace hackateam.Models;

public class Submission
{
    public enum Status
    {
        Approved,
        Rejected,
        Pending,
    }
    
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("Status")]
    [BsonRequired]
    public Status? SubmissionStatus { get; set; } = Status.Pending;

    [BsonRequired]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? UserId { get; set; }

    [BsonRequired]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? RequirementId { get; set; }

    public string? SOP { get; set; }

    [BsonRequired]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
}
