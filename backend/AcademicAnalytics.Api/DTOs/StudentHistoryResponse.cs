namespace AcademicAnalytics.Api.DTOs
{
    public class StudentHistoryResponse
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Program { get; set; } = string.Empty;
        public double CurrentGpa { get; set; }
        public List<SemesterSnapshot> History { get; set; } = new();
    }

    public class SemesterSnapshot
    {
        public string Semester { get; set; } = string.Empty;
        public double Gpa { get; set; }
        public int PassedCourses { get; set; }
        public int FailedCourses { get; set; }
        public double RiskScore { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
    }
}
