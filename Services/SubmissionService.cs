using System.Net;
using hackateam.Dtos.Submission;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Linq.Expressions;
using System.Security.Claims;
using hackateam.Dtos.Utils;

namespace hackateam.Services;

public class SubmissionService
{
    private readonly IMongoCollection<Submission> _submissions;
    private readonly RequirementService _requirementService;
    private readonly TeamService _teamService;

    public SubmissionService(IOptions<DatabaseSettings> settings, RequirementService requirementService, TeamService teamService)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _submissions = database.GetCollection<Submission>("Submissions");
        _requirementService = requirementService;
        _teamService = teamService;
    }

    public async Task<List<Submission>> GetAll(string userId, PaginationQueryDto query) =>
        await _submissions.Find(submission => submission.UserId == userId).Skip(query.Page - 1).Limit(query.Limit).ToListAsync();

    public async Task<Submission> Get(Expression<Func<Submission, bool>> filter)
    {
        var submission = await _submissions.Find(filter).FirstOrDefaultAsync();
        if (submission == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Submission not found");
        }
        return submission;
    }

    public async Task<List<Submission>> GetAllByRequirementIds(List<string> requirementIds)
    {
        if (requirementIds == null || !requirementIds.Any())
        {
            throw new HttpResponseException((int)HttpStatusCode.BadRequest, "RequirementIds list cannot be null or empty.");
        }

        return await _submissions.Find(Submission => requirementIds.Contains(Submission.RequirementId)).ToListAsync();
    }
    public async Task<Submission> Create(string id, CreateSubmissionDto createSubmissionDto)
    {
        try
        {
            var requirement = await _requirementService.Get(requirement => requirement.Id == createSubmissionDto.RequirementId);
            var team = await _teamService.Get(team => team.Id == requirement.TeamId);
            if (team.LeadId == id)
                throw new HttpResponseException((int)HttpStatusCode.Forbidden, "Team lead cannot submit");
            var submission = new Submission
            {
                UserId = id!,
                RequirementId = createSubmissionDto.RequirementId!,
                SOP = createSubmissionDto.SOP,
            };
            await _submissions.InsertOneAsync(submission);
            return submission;
        }
        catch (Exception e)
        {
            switch (e.GetType().ToString())
            {
                case "BsonSerializationException":
                    throw new HttpResponseException((int)HttpStatusCode.Conflict, "Submission already exists");
                default:
                    throw new HttpResponseException((int)HttpStatusCode.InternalServerError, "Internal server error");
            }
        }
    }

    public async Task<Submission> UpdateStatus(Expression<Func<Submission, bool>> filter, UpdateSubmissionStatusDto updateSubmissionStatusDto)
    {
        var submission = await _submissions.FindOneAndUpdateAsync<Submission>(filter, Builders<Submission>.Update.Set("SubmissionStatus", updateSubmissionStatusDto.Status), new FindOneAndUpdateOptions<Submission>
        {
            ReturnDocument = ReturnDocument.After
        });
        if (submission == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Submission not found");
        }
        return submission;
    }

    public async Task<Submission> Update(Expression<Func<Submission, bool>> filter, UpdateSubmissionDto updateSubmissionDto)
    {
        var updateDefinitionBuilder = Builders<Submission>.Update;
        var updateDefinitions = new List<UpdateDefinition<Submission>>();
        foreach (var property in updateSubmissionDto.GetType().GetProperties())
        {
            if (property.GetValue(updateSubmissionDto) != null)
            {
                var updateDefinition = updateDefinitionBuilder.Set(property.Name, property.GetValue(updateSubmissionDto));
                updateDefinitions.Add(updateDefinition);
            }
        }
        var update = updateDefinitionBuilder.Combine(updateDefinitions);
        var submission = await _submissions.FindOneAndUpdateAsync<Submission>(filter, update, new FindOneAndUpdateOptions<Submission>
        {
            ReturnDocument = ReturnDocument.After
        });
        if (submission == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Submission not found");
        }
        return submission;
    }

    public async Task<Submission> Remove(Expression<Func<Submission, bool>> filter)
    {
        var submission = await _submissions.FindOneAndDeleteAsync(filter);
        if (submission == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Submission not found");
        }
        return submission;
    }
    public async Task RemoveAll(Expression<Func<Submission, bool>> filter)
    {
        await _submissions.DeleteManyAsync(filter);
    }
}