using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AcademicAnalytics.Api.Models
{
    public class Student
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Program { get; set; } = string.Empty;
        public int EnrollmentYear { get; set; }
        public string Status { get; set; } = string.Empty;
        public double Gpa { get; set; }
        public double PrevGpa { get; set; }
        public int Absences { get; set; }
        public int TotalClasses { get; set; }
    }
}
