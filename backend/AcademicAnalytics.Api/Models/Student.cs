using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AcademicAnalytics.Api.Models
{
    public class Student
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("firstName")]
        public string FirstName { get; set; } = string.Empty;

        [BsonElement("lastName")]
        public string LastName { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("program")]
        public string Program { get; set; } = string.Empty;

        [BsonElement("enrollmentYear")]
        public int EnrollmentYear { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = string.Empty;

        [BsonElement("gpa")]
        public double Gpa { get; set; }

        [BsonElement("prevGpa")]
        public double PrevGpa { get; set; }

        [BsonElement("absences")]
        public int Absences { get; set; }

        [BsonElement("totalClasses")]
        public int TotalClasses { get; set; }
    }
}
