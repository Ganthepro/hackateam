using System.Net;
using hackateam.Dtos.Project;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Linq.Expressions;
using MongoDB.Bson;

namespace hackateam.Services;

public class ProjectService
{
    private readonly IMongoCollection<Project> _projects;

    public ProjectService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _projects = database.GetCollection<Project>("Projects");
    }

    public async Task<List<Project>> GetPaginate(ProjectQueryDto projectQueryDto)
    {
        var filters = new List<FilterDefinition<Project>>();

        if (!string.IsNullOrEmpty(projectQueryDto.Title))
            filters.Add(Builders<Project>.Filter.Regex(project => project.Title, new BsonRegularExpression(projectQueryDto.Title, "i")));

        if (!string.IsNullOrEmpty(projectQueryDto.UserId))
            filters.Add(Builders<Project>.Filter.Eq(project => project.UserId, projectQueryDto.UserId));

        if (!string.IsNullOrEmpty(projectQueryDto.SkillId))
            filters.Add(Builders<Project>.Filter.Eq(project => project.SkillId, projectQueryDto.SkillId));

        var filter = filters.Any() ? Builders<Project>.Filter.And(filters) : Builders<Project>.Filter.Empty;

        return await _projects.Find(filter)
            .Skip((projectQueryDto.Page - 1) * projectQueryDto.Limit)
            .Limit(projectQueryDto.Limit)
            .ToListAsync();
    }

    public async Task<List<Project>> GetAll(Expression<Func<Project, bool>> filter)
    {
        return await _projects.Find(filter).ToListAsync();
    }

    public async Task<Project> Get(Expression<Func<Project, bool>> filter)
    {
        var project = await _projects.Find(filter).FirstOrDefaultAsync();
        if (project == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.ProjectMessage.NOT_FOUND);
        }
        return project;
    }

    public async Task<Project> Create(string userId, CreateProjectDto createProjectDto)
    {
        try
        {
            var project = new Project
            {
                Title = createProjectDto.Title,
                Description = createProjectDto.Description,
                UserId = userId,
                SkillId = createProjectDto.SkillId
            };
            await _projects.InsertOneAsync(project);
            return project;
        }
        catch
        {
            throw new HttpResponseException((int)HttpStatusCode.BadRequest, Constants.ProjectMessage.ALREADY_EXISTS);
        }
    }

    public async Task<Project> Update(Expression<Func<Project, bool>> filter, UpdateProjectDto updateProjectDto)
    {
        var updateDefinitionBuilder = Builders<Project>.Update;
        var updateDefinitions = new List<UpdateDefinition<Project>>();
        foreach (var property in updateProjectDto.GetType().GetProperties())
        {
            if (property.GetValue(updateProjectDto) != null)
            {
                updateDefinitions.Add(updateDefinitionBuilder.Set(property.Name, property.GetValue(updateProjectDto)));
            }
        }
        var update = updateDefinitionBuilder.Combine(updateDefinitions);
        var project = await _projects.FindOneAndUpdateAsync(filter, update, new FindOneAndUpdateOptions<Project> { ReturnDocument = ReturnDocument.After });
        if (project == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.ProjectMessage.NOT_FOUND);
        }
        return project;
    }

    public async Task Remove(Expression<Func<Project, bool>> filter)
    {
        var project = await _projects.Find(filter).FirstOrDefaultAsync();
        if (project == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, Constants.ProjectMessage.NOT_FOUND);
        }
        await _projects.DeleteOneAsync(filter);
    }
    public async Task RemoveAll(Expression<Func<Project, bool>> filter)
    {
        await _projects.DeleteManyAsync(filter);
    }
}