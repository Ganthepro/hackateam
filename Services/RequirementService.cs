using System.Net;
using hackateam.Dtos.Requirement;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace hackateam.Services;

public class RequirementService
{
    private readonly IMongoCollection<Requirement> _requirement;

    public RequirementService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _requirement = database.GetCollection<Requirement>("Requirements");
    }

    public async Task<List<Requirement>> GetAll() =>
        await _requirement.Find(requirement => true).ToListAsync();

    public async Task<Requirement> Get(Expression<Func<Requirement, bool>> filter)
    {
        var requirement = await _requirement.Find(filter).FirstOrDefaultAsync();
        if (requirement == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.RequirementMessage.NOT_FOUND);
        }
        return requirement;
    }

    public async Task<Requirement> Create(CreateRequirementDto createRequirementDto)
    {
        try
        {

            // Validate if role name is unique for this team
            var existingRole = await _requirement.Find(t => 
                t.RoleName == createRequirementDto.RoleName && 
                t.TeamId == createRequirementDto.TeamId
            ).AnyAsync();

            if (existingRole)
            {
                throw new HttpResponseException((int)HttpStatusCode.Conflict, 
                    Constants.RequirementMessage.ALREADY_EXISTS);
            }

            var requirement = new Requirement
            {
                TeamId = createRequirementDto.TeamId,
                RoleName = createRequirementDto.RoleName,
                MaxSeat = createRequirementDto.MaxSeat,
                SkillId = createRequirementDto.SkillId
            };
            await _requirement.InsertOneAsync(requirement);
            return requirement;
        }
        catch
        {
            throw new HttpResponseException((int)HttpStatusCode.BadRequest, Constants.RequirementMessage.ALREADY_EXISTS);
        }
    }

    public async Task<Requirement> Update(Expression<Func<Requirement, bool>> filter, UpdateRequirementDto updateRequirementDto)
    {
        var updateDefinitionBuilder = Builders<Requirement>.Update;
        var updateDefinitions = new List<UpdateDefinition<Requirement>>();
        foreach(var property in updateRequirementDto.GetType().GetProperties())
        {
            if (property.GetValue(updateRequirementDto) != null)
            {
                var updateDefinition = updateDefinitionBuilder.Set(property.Name, property.GetValue(updateRequirementDto));
                updateDefinitions.Add(updateDefinition);
            }
        }
        var update = updateDefinitionBuilder.Combine(updateDefinitions);
        var skill = await _requirement.FindOneAndUpdateAsync<Requirement>(filter, update, new FindOneAndUpdateOptions<Requirement>{
            ReturnDocument = ReturnDocument.After
        });
        if (skill == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.SkillMessage.NOT_FOUND);
        }
        return skill;
    }

    public async Task<Requirement?> Delete(string id)
    {
        return await _requirement.FindOneAndDeleteAsync(
            Builders<Requirement>.Filter.Eq(h => h.Id, id)
        );
    }
}