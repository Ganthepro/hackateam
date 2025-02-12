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

        // This should match the structure of the Lead document
        public User Lead { get; set; } // 'Lead' is now a complex object

        // This should match the structure of the Hackathon document
        public Hackathon Hackathon { get; set; } // 'Hackathon' is a complex object
    }
}