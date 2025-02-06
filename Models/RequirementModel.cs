using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace hackateam.Models
{
    public class Requirement
    {
        public Requirement()
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }


        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string TeamId { get; set; }


        [BsonRequired]
        public string RoleName { get; set; }

        [BsonRequired]
        public int MaxSeat { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string SkillId { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; private set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; }
    }
}