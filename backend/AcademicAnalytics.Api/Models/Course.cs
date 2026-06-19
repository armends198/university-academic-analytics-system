using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AcademicAnalytics.Api.Models
{
    public class Course
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Program { get; set; } = string.Empty;
        public int Credits { get; set; }
        public string Semester { get; set; } = string.Empty;
    }
}
