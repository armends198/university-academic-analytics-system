namespace AcademicAnalytics.Api.DTOs
{
    public class ComparisonResponse
    {
        public SemesterStats SemesterA { get; set; } = new();
        public SemesterStats SemesterB { get; set; } = new();
    }

    public class SemesterStats
    {
        public string Semester { get; set; } = string.Empty;
        public double AverageGpa { get; set; }
        public double PassRate { get; set; }
    }
}
