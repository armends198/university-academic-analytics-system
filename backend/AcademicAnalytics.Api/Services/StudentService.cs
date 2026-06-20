using MongoDB.Driver;
using AcademicAnalytics.Api.DTOs;
using AcademicAnalytics.Api.Models;

namespace AcademicAnalytics.Api.Services
{
    public class StudentService
    {
        private readonly MongoDbContext _db;

        public StudentService(MongoDbContext db)
        {
            _db = db;
        }

        public async Task<List<Student>> SearchAsync(StudentSearchQuery query)
        {
            var filterBuilder = Builders<Student>.Filter;
            var filters = new List<FilterDefinition<Student>>();

            if (!string.IsNullOrWhiteSpace(query.Name))
            {
                var nameRegex = new MongoDB.Bson.BsonRegularExpression(query.Name, "i");
                filters.Add(filterBuilder.Or(
                    filterBuilder.Regex(s => s.FirstName, nameRegex),
                    filterBuilder.Regex(s => s.LastName, nameRegex)
                ));
            }

            if (!string.IsNullOrWhiteSpace(query.Program))
            {
                filters.Add(filterBuilder.Eq(s => s.Program, query.Program));
            }

            if (query.MinGpa.HasValue)
            {
                filters.Add(filterBuilder.Gte(s => s.Gpa, query.MinGpa.Value));
            }

            if (query.MaxGpa.HasValue)
            {
                filters.Add(filterBuilder.Lte(s => s.Gpa, query.MaxGpa.Value));
            }

            var finalFilter = filters.Count > 0
                ? filterBuilder.And(filters)
                : filterBuilder.Empty;

            return await _db.Students.Find(finalFilter).ToListAsync();
        }

        public async Task<StudentHistoryResponse?> GetHistoryAsync(string studentId)
        {
            var student = await _db.Students
                .Find(s => s.Id == studentId)
                .FirstOrDefaultAsync();

            if (student is null)
            {
                return null;
            }

            var snapshots = await _db.PerformanceSnapshots
                .Find(p => p.StudentId == studentId)
                .SortBy(p => p.Semester)
                .ToListAsync();

            return new StudentHistoryResponse
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Program = student.Program,
                CurrentGpa = student.Gpa,
                History = snapshots.Select(p => new SemesterSnapshot
                {
                    Semester = p.Semester,
                    Gpa = p.Gpa,
                    PassedCourses = p.PassedCourses,
                    FailedCourses = p.FailedCourses,
                    RiskScore = p.RiskScore,
                    RiskLevel = p.RiskLevel
                }).ToList()
            };
        }
        public async Task<List<AtRiskStudentResponse>> GetAtRiskAsync()
{
    var allSnapshots = await _db.PerformanceSnapshots
        .Find(_ => true)
        .ToListAsync();

    var latestSnapshotPerStudent = allSnapshots
        .GroupBy(s => s.StudentId)
        .Select(g => g.OrderByDescending(s => s.Semester).First())
        .Where(s => s.RiskLevel == "medium" || s.RiskLevel == "high")
        .ToList();

    var result = new List<AtRiskStudentResponse>();

    foreach (var snapshot in latestSnapshotPerStudent)
    {
        var student = await _db.Students
            .Find(s => s.Id == snapshot.StudentId)
            .FirstOrDefaultAsync();

        if (student is null)
        {
            continue;
        }

        result.Add(new AtRiskStudentResponse
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Program = student.Program,
            CurrentGpa = student.Gpa,
            RiskScore = snapshot.RiskScore,
            RiskLevel = snapshot.RiskLevel,
            Semester = snapshot.Semester
        });
    }

    return result.OrderByDescending(r => r.RiskScore).ToList();
}
    }
}
