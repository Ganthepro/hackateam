using System.Net;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using hackateam.Dtos.Hackathon;
using System.Linq.Expressions;

namespace hackateam.Services;

public class HackathonService
{
    private readonly IMongoCollection<Hackathon> _hackathons;

    public HackathonService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _hackathons = database.GetCollection<Hackathon>("Hackathons");
    }

    public async Task<List<Hackathon>> GetAll() =>
        await _hackathons.Find(h => true).ToListAsync();

    public async Task<Hackathon> GetByIdAsync(string id) =>
        await _hackathons.Find(h => h.Id == id).FirstOrDefaultAsync();

    public async Task<Hackathon> Get(Expression<Func<Hackathon, bool>> filter)
    {
        var hackathon = await _hackathons.Find(filter).FirstOrDefaultAsync();
        if (hackathon == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.HackathonMessage.NOT_FOUND);
        }
        return hackathon;
    }

    public async Task<Hackathon> Create(CreateHackathonDto createHackathonDto)
    {
        try
        {
            var hackathon = new Hackathon
            {
                Name = createHackathonDto.Name,
                Location = createHackathonDto.Location,
                Description = createHackathonDto.Description,
            };
            await _hackathons.InsertOneAsync(hackathon);
            return hackathon;
        }
        catch
        {
            throw new HttpResponseException((int)HttpStatusCode.BadRequest, Constants.HackathonMessage.BAD_REQUEST);
        }
    }

    public async Task<Hackathon> Update(Expression<Func<Hackathon, bool>> filter, UpdateHackathonDto updateHackathonDto)
    {
        var updateDefinitionBuilder = Builders<Hackathon>.Update;
        var updateDefinitions = new List<UpdateDefinition<Hackathon>>();
        foreach(var property in updateHackathonDto.GetType().GetProperties())
        {
            if (property.GetValue(updateHackathonDto) != null)
            {
                updateDefinitions.Add(updateDefinitionBuilder.Set(property.Name, property.GetValue(updateHackathonDto)));
            }
        }
        var update = updateDefinitionBuilder.Combine(updateDefinitions);
        var project = await _hackathons.FindOneAndUpdateAsync(filter, update, new FindOneAndUpdateOptions<Hackathon> { ReturnDocument = ReturnDocument.After });
        if (project == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.HackathonMessage.NOT_FOUND);
        }
        return project;
    }

    public async Task<Hackathon?> Delete(string id)
    {
        return await _hackathons.FindOneAndDeleteAsync(
            Builders<Hackathon>.Filter.Eq(h => h.Id, id)
        );
    }
}
