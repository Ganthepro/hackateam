using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace hackateam.Models;

using System.ComponentModel.DataAnnotations;

public class Hackathon
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [Required]
    [BsonRequired]
    public string Name { get; set; }

    [Required]
    [BsonRequired]
    public string Description { get; set; }
}