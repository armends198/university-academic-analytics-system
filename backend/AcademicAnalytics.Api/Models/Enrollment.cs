using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AcademicAnalytics.Api.Models
{
    public class Enrollment
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("studentId")]
        public string StudentId { get; set; } = string.Empty;

        [BsonElement("courseId")]
        public string CourseId { get; set; } = string.Empty;

        [BsonElement("semester")]
        public string Semester { get; set; } = string.Empty;

        [BsonElement("grade")]
        public double Grade { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = string.Empty;
    }
}
