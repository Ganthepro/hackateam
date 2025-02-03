using System.Net;
using hackateam.Dtos.Project;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace hackateam.Services;

public class ProjectService
{
    private readonly IMongoCollection<Project> _projects;

    public ProjectService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _projects = database.GetCollection<Project>("Projects");

        var indexKeys = Builders<Project>.IndexKeys.Ascending(p => p.Title);
        var indexOptions = new CreateIndexOptions { Unique = true };
        var indexModel = new CreateIndexModel<Project>(indexKeys, indexOptions);
        _projects.Indexes.CreateOne(indexModel);
    }

    public async Task<List<Project>> GetAll() =>
        await _projects.Find(project => true).ToListAsync();

    public async Task<Project> Get(Expression<Func<Project, bool>> filter)
    {
        var project = await _projects.Find(filter).FirstOrDefaultAsync();
        if (project == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Project not found");
        }
        return project;
    }

    public async Task<Project> Create(string userId,CreateProjectDto createProjectDto)
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
            throw new HttpResponseException((int)HttpStatusCode.BadRequest, "Project already exists");
        }
    }

    public async Task<Project> Update(Expression<Func<Project, bool>> filter, UpdateProjectDto updateProjectDto)
    {
        var updateDefinitionBuilder = Builders<Project>.Update;
        var updateDefinitions = new List<UpdateDefinition<Project>>();
        foreach(var property in updateProjectDto.GetType().GetProperties())
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
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Project not found");
        }
        return project;
    }

    public async Task Remove(Expression<Func<Project, bool>> filter)
    {
        var project = await _projects.Find(filter).FirstOrDefaultAsync();
        if (project == null)
        {
            throw new HttpResponseException((int)HttpStatusCode.NotFound, "Project not found");
        }
        await _projects.DeleteOneAsync(filter);
    }
}