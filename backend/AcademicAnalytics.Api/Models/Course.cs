using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AcademicAnalytics.Api.Models
{
    public class Course
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("code")]
        public string Code { get; set; } = string.Empty;

        [BsonElement("program")]
        public string Program { get; set; } = string.Empty;

        [BsonElement("credits")]
        public int Credits { get; set; }

        [BsonElement("semester")]
        public string Semester { get; set; } = string.Empty;
    }
}
