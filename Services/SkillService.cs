using System.Net;
using hackateam.Dtos.Skill;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace hackateam.Services;

public class SkillService
{
    private readonly IMongoCollection<Skill> _skills;

    public SkillService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _skills = database.GetCollection<Skill>("Skills");

        var indexKeys = Builders<Skill>.IndexKeys.Ascending(s => s.Title);
        var indexOptions = new CreateIndexOptions { Unique = true };
        var indexModel = new CreateIndexModel<Skill>(indexKeys, indexOptions);
        _skills.Indexes.CreateOne(indexModel);
    }

    public async Task<List<Skill>> GetAll() =>
        await _skills.Find(skill => true).ToListAsync();

    public async Task<Skill> Get(Expression<Func<Skill, bool>> filter)
    {
        var skill = await _skills.Find(filter).FirstOrDefaultAsync();
        if (skill == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Skill not found");
        }
        return skill;
    }

    public async Task<Skill> Create(CreateSkillDto createSkillDto)
    {
        try
        {
            var skill = new Skill
            {
                Title = createSkillDto.Title
            };
            await _skills.InsertOneAsync(skill);
            return skill;
        }
        catch
        {
            throw new HttpResponseException((int)HttpStatusCode.BadRequest, "Skill already exists");
        }
    }

    public async Task<Skill> Update(Expression<Func<Skill, bool>> filter, UpdateSkillDto updateSkillDto)
    {
        var updateDefinitionBuilder = Builders<Skill>.Update;
        var updateDefinitions = new List<UpdateDefinition<Skill>>();
        foreach(var property in updateSkillDto.GetType().GetProperties())
        {
            if (property.GetValue(updateSkillDto) != null)
            {
                var updateDefinition = updateDefinitionBuilder.Set(property.Name, property.GetValue(updateSkillDto));
                updateDefinitions.Add(updateDefinition);
            }
        }
        var update = updateDefinitionBuilder.Combine(updateDefinitions);
        var skill = await _skills.FindOneAndUpdateAsync<Skill>(filter, update, new FindOneAndUpdateOptions<Skill>{
            ReturnDocument = ReturnDocument.After
        });
        if (skill == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Skill not found");
        }
        return skill;
    }

    public async Task<Skill> Remove(Expression<Func<Skill, bool>> filter)
    {
        var skill = await _skills.FindOneAndDeleteAsync(filter);
        if (skill == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Skill not found");
        }
        return skill;
    }
}