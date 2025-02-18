using System.Net;
using hackateam.Dtos.User;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace hackateam.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _users = database.GetCollection<User>("Users");

        var indexKeys = Builders<User>.IndexKeys.Ascending(u => u.Email);
        var indexOptions = new CreateIndexOptions { Unique = true };
        var indexModel = new CreateIndexModel<User>(indexKeys, indexOptions);
        _users.Indexes.CreateOne(indexModel);
    }

    public async Task<List<User>> GetAll(UserQueryDto userQueryDto)
    {
        var filters = new List<FilterDefinition<User>>();

        if (!string.IsNullOrEmpty(userQueryDto.Email))
            filters.Add(Builders<User>.Filter.Eq(user => user.Email, userQueryDto.Email));
        if (!string.IsNullOrEmpty(userQueryDto.FullName))
            filters.Add(Builders<User>.Filter.Eq(user => user.FullName, userQueryDto.FullName));
        if (!string.IsNullOrEmpty(userQueryDto.Tel))
            filters.Add(Builders<User>.Filter.Eq(user => user.Tel, userQueryDto.Tel));
    
        var filter = filters.Any() ? Builders<User>.Filter.Or(filters) : Builders<User>.Filter.Empty;

        return await _users.Find(filter)
            .Skip((userQueryDto.Page - 1) * userQueryDto.Limit)
            .Limit(userQueryDto.Limit)
            .ToListAsync();
    }

    public async Task<User> Get(Expression<Func<User, bool>> filter)
    {
        var user = await _users.Find(filter).FirstOrDefaultAsync();
        if (user == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "User not found");
        }
        return user;
    }

    public async Task<User> GetByEmail(string email) =>
        await _users.Find(user => user.Email == email).FirstOrDefaultAsync();


    public async Task<User> Create(CreateUserDto createUserDto)
    {
        try
        {
            var user = new User
            {
                Email = createUserDto.Email,
                Password = createUserDto.Password,
                FullName = createUserDto.FullName,
                Header = createUserDto.Header,
                Tel = createUserDto.Tel
            };
            await _users.InsertOneAsync(user);
            return user;
        }
        catch
        {
            throw new HttpResponseException((int)HttpStatusCode.Conflict, "User already exists");
        }
    }

    public async void UpdateAvatar(string id, string fileName)
    {
        var user = await Get(user => user.Id == id);
        user.Avatar = fileName;
        await _users.ReplaceOneAsync(user => user.Id == id, user);
    }

    public async Task<User> Update(Expression<Func<User, bool>> filter, UpdateUserDto updateUserDto)
    {
        var updateDefinitionBuilder = Builders<User>.Update;
        var updateDefinitions = new List<UpdateDefinition<User>>();
        foreach (var property in updateUserDto.GetType().GetProperties())
        {
            if (property.GetValue(updateUserDto) != null)
            {
                var updateDefinition = updateDefinitionBuilder.Set(property.Name, property.GetValue(updateUserDto));
                updateDefinitions.Add(updateDefinition);
            }
        }
        var update = updateDefinitionBuilder.Combine(updateDefinitions);
        var user = await _users.FindOneAndUpdateAsync<User>(filter, update, new FindOneAndUpdateOptions<User>
        {
            ReturnDocument = ReturnDocument.After
        });
        if (user == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "User not found");
        }
        return user;
    }

    public async Task<User> Remove(Expression<Func<User, bool>> filter)
    {
        var user = await _users.FindOneAndDeleteAsync(filter);
        if (user == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "User not found");
        }
        return user;
    }
}