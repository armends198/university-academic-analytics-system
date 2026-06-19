using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AcademicAnalytics.Api.Models
{
    public class PerformanceSnapshot
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = string.Empty;

        public string StudentId { get; set; } = string.Empty;
        public string Semester { get; set; } = string.Empty;
        public double Gpa { get; set; }
        public int PassedCourses { get; set; }
        public int FailedCourses { get; set; }
        public double AbsenceRate { get; set; }
        public double RiskScore { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
    }
}
