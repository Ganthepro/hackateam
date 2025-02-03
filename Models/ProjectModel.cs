using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace hackateam.Models
{
    public class Project
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRequired]
        public string? Title { get; set; }

        [BsonRequired]
        public string? Description { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? UserId { get; set; }
        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? SkillId { get; set; }
    }
}