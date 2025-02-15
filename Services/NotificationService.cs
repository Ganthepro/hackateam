using System.Net;
using hackateam.Dtos.Notification;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Linq.Expressions;
using MongoDB.Bson;

namespace hackateam.Services;

public class NotificationService
{
    private readonly IMongoCollection<Notification> _notifications;

    public NotificationService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _notifications = database.GetCollection<Notification>("Notifications");

        var indexKeys = Builders<Notification>.IndexKeys.Ascending(n => n.Type);
        var indexOptions = new CreateIndexOptions { Unique = true };
        var indexModel = new CreateIndexModel<Notification>(indexKeys, indexOptions);
        _notifications.Indexes.CreateOne(indexModel);
    }

    public async Task<List<Notification>> GetAll(NotificationQueryDto notificationQueryDto, string userId)
    {
        var pipeline = new List<BsonDocument>();

        pipeline.Add(new BsonDocument("$lookup", new BsonDocument
    {
        {"from", "Teams"},
        {"localField", "TeamId"},
        {"foreignField", "_id"},
        {"as", "Team"}
    }));

        pipeline.Add(new BsonDocument("$unwind", new BsonDocument("path", "$Team")));

        var matchConditions = new List<BsonDocument>();


        if (notificationQueryDto.Type.HasValue)
        {
            matchConditions.Add(new BsonDocument("Type", notificationQueryDto.Type.ToString()));
        }

        if (!string.IsNullOrEmpty(notificationQueryDto.TeamName))
        {
            matchConditions.Add(new BsonDocument("Team.Name",
                new BsonDocument("$regex", notificationQueryDto.TeamName)
                .Add("$options", "i")));
        }

        if (matchConditions.Any())
        {
            pipeline.Add(new BsonDocument("$match",
                new BsonDocument("$and", new BsonArray(matchConditions))));
        }

        if (notificationQueryDto.Page > 0 && notificationQueryDto.Limit > 0)
        {
            pipeline.Add(new BsonDocument("$skip", (notificationQueryDto.Page - 1) * notificationQueryDto.Limit));
            pipeline.Add(new BsonDocument("$limit", notificationQueryDto.Limit));
        }

        var notifications = await _notifications.Aggregate<Notification>(pipeline).ToListAsync();

        var results = notifications.Where(notification => notification.UserId == userId).ToList();

        return results;
    }

    public async Task<Notification> Get(Expression<Func<Notification, bool>> filter)
    {
        var notification = await _notifications.Find(filter).FirstOrDefaultAsync();
        if (notification == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.NotificationMessage.NOT_FOUND);
        }
        return notification;
    }

    public async Task<Notification> Create(CreateNotificationDto createNotificationDto)
    {
        try
        {
            var notification = new Notification
            {
                Type = createNotificationDto.Type,
                UserId = createNotificationDto.UserId,
                TeamId = createNotificationDto.TeamId
            };
            await _notifications.InsertOneAsync(notification);
            return notification;
        }
        catch
        {
            throw new HttpResponseException((int)HttpStatusCode.BadRequest, Constants.NotificationMessage.ALREADY_EXISTS);
        }
    }

    public async Task<Notification> Update(Expression<Func<Notification, bool>> filter, UpdateNotificationDto updateNotificationDto)
    {
        var updateDefinitionBuilder = Builders<Notification>.Update;
        var updateDefinitions = new List<UpdateDefinition<Notification>>();
        foreach (var property in updateNotificationDto.GetType().GetProperties())
        {
            if (property.GetValue(updateNotificationDto) != null)
            {
                updateDefinitions.Add(updateDefinitionBuilder.Set(property.Name, property.GetValue(updateNotificationDto)));
            }
        }
        var update = updateDefinitionBuilder.Combine(updateDefinitions);
        var notification = await _notifications.FindOneAndUpdateAsync(filter, update);
        if (notification == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.NotificationMessage.NOT_FOUND);
        }
        return notification;
    }

    public async Task Remove(Expression<Func<Notification, bool>> filter)
    {
        var notification = await _notifications.Find(filter).FirstOrDefaultAsync();
        if (notification == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.NotificationMessage.NOT_FOUND);
        }
        await _notifications.DeleteOneAsync(filter);
    }

}