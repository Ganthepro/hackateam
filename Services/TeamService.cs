using System.Net;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Linq.Expressions;
using hackateam.Dtos.Team;
namespace hackateam.Services;

public class TeamService
{
    private readonly IMongoCollection<Team> _teams;

    public TeamService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _teams = database.GetCollection<Team>("Teams");
    }

    public async Task<List<Team>> GetAll() =>
        await _teams.Find(team => true).ToListAsync();

    public async Task<Team> Get(Expression<Func<Team, bool>> filter)
    {
        var team = await _teams.Find(filter).FirstOrDefaultAsync();
        if (team == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.TeamMessage.NOT_FOUND);
        }
        return team;
    }

    public async Task<Team> Create(CreateTeamDto createTeamDto)
    {
        try
        {
            // Validate if team name is unique for this hackathon
            var existingTeam = await _teams.Find(t => 
                t.Name == createTeamDto.Name && 
                t.HackathonId == createTeamDto.HackathonId
            ).AnyAsync();

            if (existingTeam)
            {
                throw new HttpResponseException((int)HttpStatusCode.Conflict, 
                    Constants.TeamMessage.ALREADY_EXISTS);
            }

            var team = new Team
            {
                Name = createTeamDto.Name,
                LeadId = createTeamDto.LeadId,
                Status = TeamStatus.Opened,
                HackathonId = createTeamDto.HackathonId,
                ExpiredAt = createTeamDto.ExpiredAt // Ensure value is provided
            };

            await _teams.InsertOneAsync(team);
            return team;
        }
        catch (MongoWriteException ex) when (ex.WriteError.Category == ServerErrorCategory.DuplicateKey)
        {
            throw new HttpResponseException((int)HttpStatusCode.Conflict, 
                Constants.TeamMessage.ALREADY_EXISTS);
        }
    }


    public async Task<Team> Update(Expression<Func<Team, bool>> filter, UpdateTeamDto updateTeamDto)
    {
        var updateDefinitionBuilder = Builders<Team>.Update;
        var updateDefinitions = new List<UpdateDefinition<Team>>();
        foreach(var property in updateTeamDto.GetType().GetProperties())
        {
            if (property.GetValue(updateTeamDto) != null)
            {
                var updateDefinition = updateDefinitionBuilder.Set(property.Name, property.GetValue(updateTeamDto));
                updateDefinitions.Add(updateDefinition);
            }
        }
        updateDefinitions.Add(updateDefinitionBuilder.Set(t => t.UpdatedAt, DateTime.UtcNow));

        var update = updateDefinitionBuilder.Combine(updateDefinitions);
        
        var team = await _teams.FindOneAndUpdateAsync<Team>(filter, update, new FindOneAndUpdateOptions<Team>{
            ReturnDocument = ReturnDocument.After
        });
        if (team == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.TeamMessage.NOT_FOUND);
        }
        return team;
    }

    public async Task<Team?> Delete(string id)
    {
        return await _teams.FindOneAndDeleteAsync(
            Builders<Team>.Filter.Eq(h => h.Id, id)
        );
    }
}