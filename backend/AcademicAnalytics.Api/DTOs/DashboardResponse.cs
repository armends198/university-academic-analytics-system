namespace AcademicAnalytics.Api.DTOs
{
    public class DashboardResponse
    {
        public double AverageGpa { get; set; }
        public double PassRate { get; set; }
        public int AtRiskCount { get; set; }
        public double DropoutRate { get; set; }
    }
}
