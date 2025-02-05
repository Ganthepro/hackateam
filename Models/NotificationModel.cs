using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace hackateam.Models
{
    public enum Type
    {
        Approved,
        Rejected,
    }


    public class Notification
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRequired]
        public Type? Type { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? UserId { get; set; }
    }
}