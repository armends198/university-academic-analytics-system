namespace AcademicAnalytics.Api.DTOs
{
    public class StudentSearchQuery
    {
        public string? Name { get; set; }
        public string? Program { get; set; }
        public double? MinGpa { get; set; }
        public double? MaxGpa { get; set; }
    }
}
