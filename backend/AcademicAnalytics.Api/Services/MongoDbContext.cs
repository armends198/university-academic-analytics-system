using MongoDB.Driver;
using Microsoft.Extensions.Options;
using AcademicAnalytics.Api.Settings;
using AcademicAnalytics.Api.Models;

namespace AcademicAnalytics.Api.Services
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IMongoClient mongoClient, IOptions<MongoSettings> settings)
        {
            _database = mongoClient.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<Student> Students =>
            _database.GetCollection<Student>("students");

        public IMongoCollection<Course> Courses =>
            _database.GetCollection<Course>("courses");

        public IMongoCollection<Enrollment> Enrollments =>
            _database.GetCollection<Enrollment>("enrollments");

        public IMongoCollection<PerformanceSnapshot> PerformanceSnapshots =>
            _database.GetCollection<PerformanceSnapshot>("performance_snapshots");

        public IMongoCollection<User> Users =>
            _database.GetCollection<User>("users");
    }
}