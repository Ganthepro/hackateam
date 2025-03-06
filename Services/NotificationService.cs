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
    }

    public async Task<List<Notification>> GetAll(NotificationQueryDto notificationQueryDto, string userId)
    {
        var filters = new List<FilterDefinition<Notification>>();

        if (notificationQueryDto.Type != null)
            filters.Add(Builders<Notification>.Filter.Eq(notification => notification.Type, notificationQueryDto.Type));

        if (!string.IsNullOrEmpty(notificationQueryDto.TeamId))
            filters.Add(Builders<Notification>.Filter.Eq(notification => notification.TeamId, notificationQueryDto.TeamId));

        filters.Add(Builders<Notification>.Filter.Eq(notification => notification.UserId, userId));

        var filter = filters.Any() ? Builders<Notification>.Filter.And(filters) : Builders<Notification>.Filter.Empty;

        return await _notifications.Find(filter)
            .Skip((notificationQueryDto.Page - 1) * notificationQueryDto.Limit)
            .Limit(notificationQueryDto.Limit)
            .ToListAsync();
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

    public async Task RemoveAll(Expression<Func<Notification, bool>> filter)
    {
        await _notifications.DeleteManyAsync(filter);
    }
}