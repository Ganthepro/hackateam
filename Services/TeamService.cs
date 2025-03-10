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
        var filters = new List<FilterDefinition<Team>>();

        if (!string.IsNullOrEmpty(teamQueryDto.Name))
            filters.Add(Builders<Team>.Filter.Regex(team => team.Name, new BsonRegularExpression(teamQueryDto.Name, "i")));

        if (!string.IsNullOrEmpty(teamQueryDto.LeadId))
            filters.Add(Builders<Team>.Filter.Eq(team => team.LeadId, teamQueryDto.LeadId)); // Exact match

        if (!string.IsNullOrEmpty(teamQueryDto.HackathonName))
            filters.Add(Builders<Team>.Filter.Regex(team => team.HackathonName, new BsonRegularExpression(teamQueryDto.HackathonName, "i")));

        if (teamQueryDto.Status.HasValue)
            filters.Add(Builders<Team>.Filter.Eq("Status", teamQueryDto.Status.Value.ToString())); // Enum stored as string

        var filter = filters.Any() ? Builders<Team>.Filter.And(filters) : Builders<Team>.Filter.Empty;

        return await _teams.Find(filter)
            .Skip((teamQueryDto.Page - 1) * teamQueryDto.Limit)
            .Limit(teamQueryDto.Limit)
            .ToListAsync();
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

            var team = new Team
            {
                Name = createTeamDto.Name,
                LeadId = id,
                Status = TeamStatus.Opened,
                HackathonName = createTeamDto.HackathonName,
                HackathonDescription = createTeamDto.HackathonDescription,
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
        var bangkokTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Bangkok");
        var bangkokNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, bangkokTimeZone);
        if (updateTeamDto.ExpiredAt <= bangkokNow)
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

        if (updateTeamDto.ExpiredAt > DateTime.UtcNow)
        {
            updateDefinitions.Add(updateDefinitionBuilder.Set(t => t.Status, Models.TeamStatus.Opened));
        }

        var update = updateDefinitionBuilder.Combine(updateDefinitions);

        var team = await _teams.FindOneAndUpdateAsync<Team>(filter, update, new FindOneAndUpdateOptions<Team>
        {
            ReturnDocument = ReturnDocument.After
        });
        return team;
    }

    public async Task<Team?> Delete(string id)
    {
        return await _teams.FindOneAndDeleteAsync(
            Builders<Team>.Filter.Eq(h => h.Id, id)
        );
    }
}