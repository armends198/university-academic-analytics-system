using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AcademicAnalytics.Api.Models
{
    public class PerformanceSnapshot
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("studentId")]
        public string StudentId { get; set; } = string.Empty;

        [BsonElement("semester")]
        public string Semester { get; set; } = string.Empty;

        [BsonElement("gpa")]
        public double Gpa { get; set; }

        [BsonElement("passedCourses")]
        public int PassedCourses { get; set; }

        [BsonElement("failedCourses")]
        public int FailedCourses { get; set; }

        [BsonElement("absenceRate")]
        public double AbsenceRate { get; set; }

        [BsonElement("riskScore")]
        public double RiskScore { get; set; }

        [BsonElement("riskLevel")]
        public string RiskLevel { get; set; } = string.Empty;
    }
}
