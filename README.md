# University Academic Analytics System

A full-stack web application that enables academic institutions to monitor student performance, detect at-risk students, compare academic performance across semesters, and view institutional KPIs.

Built as a Software Engineering course project, developed using Agile/Scrum practices with full traceability from requirements (User Stories) → GitHub Issues → Feature Branches → Pull Requests → Merged code.

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Recharts

**Backend**
- ASP.NET Core Web API (.NET 10)
- JWT Authentication
- Role-Based Authorization (Administrator / Faculty)
- BCrypt password hashing

**Database**
- MongoDB Atlas
- Seeded with realistic academic data via a Python (`pymongo`) seed script

---

## Project Structure

```
university-academic-analytics-system/
├── backend/
│   └── AcademicAnalytics.Api/
│       ├── Models/          # MongoDB document models (Student, Course, Enrollment, PerformanceSnapshot, User)
│       ├── DTOs/             # Request/response shapes for API endpoints
│       ├── Services/         # Business logic (AuthService, StudentService, AnalyticsService, MongoDbContext)
│       ├── Settings/         # Strongly-typed config classes (MongoSettings, JwtSettings)
│       └── Program.cs        # App entry point, service registration, route definitions
├── frontend/
│   └── src/
│       ├── pages/             # Login, Dashboard, StudentSearch, AtRiskStudents, StudentDetail, SemesterComparison
│       ├── components/        # Shared UI (Navbar, etc.)
│       └── services/          # API client (api.js)
├── database/
│   ├── seed/                  # Seed data as JSON (users, students, courses, enrollments, performance_snapshots)
│   └── seed.py                # Script to load seed data into MongoDB
├── docs/                      # Project Proposal, Use Case Diagram, Class Diagram, status docs
└── tests/                     # Backend and frontend tests
```

---

## Getting Started

### Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (10.0 or later)
- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3](https://www.python.org/) with `pymongo` (for seeding the database)
- A MongoDB Atlas connection string (ask the Backend Lead for shared project credentials)

### 1. Clone the repository

```bash
git clone https://github.com/armends198/university-academic-analytics-system.git
cd university-academic-analytics-system
```

### 2. Backend setup

```bash
cd backend/AcademicAnalytics.Api
```

Create a local `appsettings.Development.json` file (this is gitignored — never committed) with your MongoDB and JWT configuration:

```json
{
  "MongoSettings": {
    "ConnectionString": "<your-mongodb-atlas-connection-string>",
    "DatabaseName": "academic_analytics"
  },
  "JwtSettings": {
    "SecretKey": "<a-long-random-string-at-least-32-characters>",
    "Issuer": "AcademicAnalyticsApi",
    "Audience": "AcademicAnalyticsClient",
    "ExpiryMinutes": 60
  }
}
```

Run the API:

```bash
dotnet run
```

The API will be available at `http://localhost:5272`.

Verify the database connection:

```bash
curl http://localhost:5272/api/ping
```

### 3. Seed the database

From the `database/` folder:

```bash
export MONGO_URI="<your-mongodb-atlas-connection-string>"
python3 seed.py
```

This populates 5 collections: `users`, `students`, `courses`, `enrollments`, `performance_snapshots`.

### 4. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## API Reference

All endpoints are served from `http://localhost:5272`. Fields are camelCase; IDs are plain strings (e.g. `"STU-001"`).

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/ping` | No | Health check — confirms MongoDB connectivity |
| `POST` | `/auth/login` | No | Authenticates a user, returns a JWT |
| `GET` | `/students/search` | Administrator | Search/filter students by name, program, GPA range |
| `GET` | `/students/{id}/history` | Any authenticated user | Per-semester GPA and risk history for one student |
| `GET` | `/students/at-risk` | Any authenticated user | Students currently at medium/high risk |
| `GET` | `/analytics/dashboard` | Any authenticated user | Institution-wide KPIs (avg GPA, pass rate, at-risk count, dropout rate) |
| `GET` | `/analytics/comparison` | Administrator | Compares average GPA and pass rate between two semesters |

For full request/response examples, see [`docs/BACKEND_HANDOFF.md`](docs/BACKEND_HANDOFF.md).

### Authentication

Send the JWT returned from `/auth/login` as a Bearer token on protected routes:

```bash
curl http://localhost:5272/students/at-risk -H "Authorization: Bearer <token>"
```

---

## Development Workflow

This project follows a strict Agile workflow:

```
User Story → GitHub Issue → Feature Branch → Commits → Pull Request → Review → Merge
```

No direct commits to `main`. Every feature has a corresponding closed Issue and merged PR for traceability.

---

## Team

| Name | Role | Responsibilities |
|---|---|---|
| Armend Sejfullai | Backend Lead / Scrum Master | ASP.NET Core API, MongoDB integration, authentication, sprint coordination |
| Besnik | Frontend Lead | React application, UI/UX, dashboard visualizations |
| Arian | Full Stack / QA | Data seeding, integration, testing, deployment |

---

## Project Status

See [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) for a detailed, up-to-date breakdown of completed work and remaining tasks per team member.