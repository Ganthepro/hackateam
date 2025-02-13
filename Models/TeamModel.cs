// Team.cs (updated model)
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace hackateam.Models
{
    public enum TeamStatus
    {
        Opened,
        Closed,
        Cancelled
    }

    public class Team
    {
        public Team()
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            Status = TeamStatus.Opened;
        }
        
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRequired]
        public string Name { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string LeadId { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.String)]
        public TeamStatus Status { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string HackathonId { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; private set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; }

        [BsonRequired]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime ExpiredAt { get; set; }
        public User Lead { get; set; }
        public Hackathon Hackathon { get; set; }
    }
}