using MongoDB.Driver;
using AcademicAnalytics.Api.DTOs;

namespace AcademicAnalytics.Api.Services
{
    public class AnalyticsService
    {
        private readonly MongoDbContext _db;

        public AnalyticsService(MongoDbContext db)
        {
            _db = db;
        }

        public async Task<DashboardResponse> GetDashboardAsync()
        {
            var students = await _db.Students.Find(_ => true).ToListAsync();
            var enrollments = await _db.Enrollments.Find(_ => true).ToListAsync();
            var snapshots = await _db.PerformanceSnapshots.Find(_ => true).ToListAsync();

            double averageGpa = students.Count > 0
                ? students.Average(s => s.Gpa)
                : 0;

            double passRate = enrollments.Count > 0
                ? (double)enrollments.Count(e => e.Status == "passed") / enrollments.Count * 100
                : 0;

            var latestSnapshotPerStudent = snapshots
                .GroupBy(s => s.StudentId)
                .Select(g => g.OrderByDescending(s => s.Semester).First())
                .ToList();

            int atRiskCount = latestSnapshotPerStudent
                .Count(s => s.RiskLevel == "medium" || s.RiskLevel == "high");

            double dropoutRate = students.Count > 0
                ? (double)students.Count(s => s.Status == "dropped") / students.Count * 100
                : 0;

            return new DashboardResponse
            {
                AverageGpa = Math.Round(averageGpa, 2),
                PassRate = Math.Round(passRate, 2),
                AtRiskCount = atRiskCount,
                DropoutRate = Math.Round(dropoutRate, 2)
            };
        }
        public async Task<ComparisonResponse> GetComparisonAsync(string semesterA, string semesterB)
{
    return new ComparisonResponse
    {
        SemesterA = await GetSemesterStatsAsync(semesterA),
        SemesterB = await GetSemesterStatsAsync(semesterB)
    };
}

private async Task<SemesterStats> GetSemesterStatsAsync(string semester)
{
    var snapshots = await _db.PerformanceSnapshots
        .Find(s => s.Semester == semester)
        .ToListAsync();

    var enrollments = await _db.Enrollments
        .Find(e => e.Semester == semester)
        .ToListAsync();

    double averageGpa = snapshots.Count > 0
        ? snapshots.Average(s => s.Gpa)
        : 0;

    double passRate = enrollments.Count > 0
    ? (double)enrollments.Count(e => e.Status == "passed") / enrollments.Count * 100
    : 0;

    return new SemesterStats
    {
        Semester = semester,
        AverageGpa = Math.Round(averageGpa, 2),
        PassRate = Math.Round(passRate, 2)
    };
}
    }
}
