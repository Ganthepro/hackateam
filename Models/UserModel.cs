using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace hackateam.Models
{
    public class User
    {
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

        [BsonRequired]
        public string? Tel { get; set; }
    }
}