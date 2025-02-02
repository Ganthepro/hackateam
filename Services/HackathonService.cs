using System.Net;
using hackateam.Models;
using hackateam.Shared;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace hackateam.Services;

public class HackathonService
{
    private readonly IMongoCollection<Hackathon> _hackathons;

    public HackathonService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _hackathons = database.GetCollection<Hackathon>("hackathon");

        // Create a unique index on the Name field instead of Id (_id)
        var indexKeys = Builders<Hackathon>.IndexKeys.Ascending(h => h.Name);
        var indexOptions = new CreateIndexOptions { Unique = true };
        var indexModel = new CreateIndexModel<Hackathon>(indexKeys, indexOptions);
        _hackathons.Indexes.CreateOne(indexModel);
    }

    public async Task<List<Hackathon>> GetAllAsync() =>
        await _hackathons.Find(h => true).ToListAsync();

    public async Task<Hackathon> GetByIdAsync(string id) =>
        await _hackathons.Find(h => h.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Hackathon hackathon) =>
        await _hackathons.InsertOneAsync(hackathon);

    public async Task UpdateAsync(string id, Hackathon hackathon) =>
        await _hackathons.ReplaceOneAsync(h => h.Id == id, hackathon);

    public async Task DeleteAsync(string id) =>
        await _hackathons.DeleteOneAsync(h => h.Id == id);
}
