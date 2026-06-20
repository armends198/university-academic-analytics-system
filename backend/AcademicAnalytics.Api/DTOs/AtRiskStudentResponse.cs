namespace AcademicAnalytics.Api.DTOs
{
    public class AtRiskStudentResponse
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Program { get; set; } = string.Empty;
        public double CurrentGpa { get; set; }
        public double RiskScore { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
        public string Semester { get; set; } = string.Empty;
    }
}
