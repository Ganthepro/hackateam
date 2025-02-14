using System.Net;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.IO;
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
    public async Task<List<Team>> GetAll(TeamQueryDto teamQueryDto)
    {
        var pipeline = new List<BsonDocument>();

        pipeline.Add(new BsonDocument("$lookup", new BsonDocument
            {
                { "from", "Users" },
                { "localField", "LeadId" },
                { "foreignField", "_id" },
                { "as", "Lead" }
            }));

        pipeline.Add(new BsonDocument("$lookup", new BsonDocument
            {
                { "from", "Hackathons" },
                { "localField", "HackathonId" },
                { "foreignField", "_id" },
                { "as", "Hackathon" }
            }));

        pipeline.Add(new BsonDocument("$unwind", new BsonDocument("path", "$Lead")));
        pipeline.Add(new BsonDocument("$unwind", new BsonDocument("path", "$Hackathon")));

        var filters = new List<BsonDocument>();

        if (!string.IsNullOrEmpty(teamQueryDto.Name))
        {
            filters.Add(new BsonDocument("Name", new BsonDocument("$regex", teamQueryDto.Name).Add("$options", "i")));
        }

        if (!string.IsNullOrEmpty(teamQueryDto.LeadName))
        {
            filters.Add(new BsonDocument("Lead.FullName", new BsonDocument("$regex", teamQueryDto.LeadName).Add("$options", "i")));
        }

        if (!string.IsNullOrEmpty(teamQueryDto.HackathonName))
        {
            filters.Add(new BsonDocument("Hackathon.Name", new BsonDocument("$regex", teamQueryDto.HackathonName).Add("$options", "i")));
        }

        if (teamQueryDto.Status.HasValue)
        {
            filters.Add(new BsonDocument("Status", teamQueryDto.Status.Value.ToString()));
        }

        if (filters.Count > 0)
        {
            pipeline.Add(new BsonDocument("$match", new BsonDocument("$and", new BsonArray(filters))));
        }

        pipeline.Add(new BsonDocument("$skip", (teamQueryDto.Page - 1) * teamQueryDto.Limit));
        pipeline.Add(new BsonDocument("$limit", teamQueryDto.Limit));

        var results = await _teams.Aggregate<Team>(pipeline).ToListAsync();
        return results;

    }

    public async Task<Team> Get(Expression<Func<Team, bool>> filter)
    {
        var team = await _teams.Find(filter).FirstOrDefaultAsync();
        if (team == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.TeamMessage.NOT_FOUND);
        }
        return team;
    }

    public async Task<Team> Create(string id, CreateTeamDto createTeamDto)
    {
        try
        {

            if (createTeamDto.ExpiredAt <= DateTime.UtcNow)
            {
                throw new HttpResponseException((int)HttpStatusCode.BadRequest,
                    Constants.TeamMessage.EXPIRE_DATE_CONFLICT);
            }

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
                LeadId = id,
                Status = TeamStatus.Opened,
                HackathonId = createTeamDto.HackathonId,
                ExpiredAt = createTeamDto.ExpiredAt
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

    public async void UpdateBanner(string id, string fileName)
    {
        var team = await Get(team => team.Id == id);
        team.Banner = fileName;
        await _teams.ReplaceOneAsync(team => team.Id == id, team);
    }

    public async Task<Team> Update(Expression<Func<Team, bool>> filter, UpdateTeamDto updateTeamDto)
    {

        if (updateTeamDto.ExpiredAt <= DateTime.UtcNow)
        {
            throw new HttpResponseException((int)HttpStatusCode.BadRequest,
                Constants.TeamMessage.EXPIRE_DATE_CONFLICT);
        }

        var updateDefinitionBuilder = Builders<Team>.Update;
        var updateDefinitions = new List<UpdateDefinition<Team>>();
        foreach (var property in updateTeamDto.GetType().GetProperties())
        {
            if (property.GetValue(updateTeamDto) != null)
            {
                var updateDefinition = updateDefinitionBuilder.Set(property.Name, property.GetValue(updateTeamDto));
                updateDefinitions.Add(updateDefinition);
            }
        }
        updateDefinitions.Add(updateDefinitionBuilder.Set(t => t.UpdatedAt, DateTime.UtcNow));

        var update = updateDefinitionBuilder.Combine(updateDefinitions);

        var team = await _teams.FindOneAndUpdateAsync<Team>(filter, update, new FindOneAndUpdateOptions<Team>
        {
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