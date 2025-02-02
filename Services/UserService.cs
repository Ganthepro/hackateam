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

    public async Task<List<User>> GetAll() =>
        await _users.Find(user => true).ToListAsync();

    public async Task<User> Get(string id)
    {
        var user = await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
        if (user == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "User not found");
        }
        return user;
    }

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

    public async Task<User> Update(Expression<Func<User, bool>> filter, User userIn)
    {
        var user = await _users.FindOneAndReplaceAsync<User>(filter, userIn, new FindOneAndReplaceOptions<User, User>
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