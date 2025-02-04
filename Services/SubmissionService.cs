using System.Net;
using hackateam.Dtos.Submission;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Linq.Expressions;
using MongoDB.Bson;

namespace hackateam.Services;

public class SubmissionService
{
    private readonly IMongoCollection<Submission> _submissions;

    public SubmissionService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _submissions = database.GetCollection<Submission>("Submissions");
    }

    public async Task<List<Submission>> GetAll() =>
        await _submissions.Find(submission => true).ToListAsync();

    public async Task<Submission> Get(Expression<Func<Submission, bool>> filter)
    {
        var submission = await _submissions.Find(filter).FirstOrDefaultAsync();
        if (submission == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Submission not found");
        }
        return submission;
    }

    public async Task<Submission> Create(CreateSubmissionDto createSubmissionDto)
    {
        try
        {
            var submission = new Submission
            {
                UserId = createSubmissionDto.UserId!,
                RequirementId = createSubmissionDto.RequirementId!,
                SOP = createSubmissionDto.SOP,
            };
            await _submissions.InsertOneAsync(submission);
            return submission;
        }
        catch (Exception e)
        {
            switch (e.GetType().ToString()) {
                case "BsonSerializationException":
                    throw new HttpResponseException((int)HttpStatusCode.Conflict, "Submission already exists");
                default:
                    throw new HttpResponseException((int)HttpStatusCode.InternalServerError, "Internal server error");
            }
        }
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
}