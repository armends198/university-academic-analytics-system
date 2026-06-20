import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { studentSearchData } from '../data/students'

const studentData = studentSearchData

const programOptions = [
  'All',
  'Computer Science',
  'Business Administration',
  'Law',
  'Data Analytics',
  'Cybersecurity',
  'Information Systems',
  'Software Engineering',
  'Economics',
  'Public Health',
]

const semesterOptions = ['All', 'Fall 2023', 'Spring 2024', 'Fall 2024', 'Spring 2025']
const riskOptions = ['All', 'High', 'Medium', 'Low']

const badgeStyles = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-orange-100 text-orange-700',
  Low: 'bg-emerald-100 text-emerald-700',
}

export default function StudentSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState('All')
  const [semesterFilter, setSemesterFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [minGpa, setMinGpa] = useState('')
  const [maxGpa, setMaxGpa] = useState('')
  const [page, setPage] = useState(1)

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return studentData.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(normalizedSearch)
      const matchesProgram = programFilter === 'All' || student.program === programFilter
      const matchesSemester = semesterFilter === 'All' || student.semester === semesterFilter
      const matchesRisk = riskFilter === 'All' || student.riskLevel === riskFilter
      const matchesMin = minGpa === '' || student.gpa >= parseFloat(minGpa)
      const matchesMax = maxGpa === '' || student.gpa <= parseFloat(maxGpa)

      return matchesSearch && matchesProgram && matchesSemester && matchesRisk && matchesMin && matchesMax
    })
  }, [searchQuery, programFilter, semesterFilter, riskFilter, minGpa, maxGpa])

  const pageSize = 5
  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleFilterChange(setter) {
    return (value) => {
      setter(value)
      setPage(1)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kërko Studentë</h1>
          <p className="mt-2 text-sm text-gray-500">Gjej dhe filtro studentët me GPA, program, semestër dhe risk level.</p>
        </div>
        <div className="w-full md:w-1/3">
          <label className="sr-only" htmlFor="student-search-input">Search students</label>
          <input
            id="student-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search by name"
            className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="space-y-2 text-sm text-slate-700">
            Program
            <select
              value={programFilter}
              onChange={(e) => handleFilterChange(setProgramFilter)(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              {programOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Semester
            <select
              value={semesterFilter}
              onChange={(e) => handleFilterChange(setSemesterFilter)(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              {semesterOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Min GPA
            <input
              type="number"
              min="0"
              max="4"
              step="0.01"
              value={minGpa}
              onChange={(e) => handleFilterChange(setMinGpa)(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Max GPA
            <input
              type="number"
              min="0"
              max="4"
              step="0.01"
              value={maxGpa}
              onChange={(e) => handleFilterChange(setMaxGpa)(e.target.value)}
              placeholder="4.00"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>
        </div>

        <div className="mt-4 lg:mt-6 grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Risk Level
            <select
              value={riskFilter}
              onChange={(e) => handleFilterChange(setRiskFilter)(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              {riskOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <div className="flex items-end justify-between gap-3">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{visibleStudents.length}</span> of <span className="font-semibold text-slate-900">{filteredStudents.length}</span> students
            </div>
            <div className="text-sm text-slate-500">Page {currentPage} of {pageCount}</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">GPA</th>
                <th className="px-4 py-3">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">
                    <Link to={`/students/${student.id}`} state={{ from: '/student-search' }} className="text-slate-900 hover:text-violet-600">{student.name}</Link>
                  </td>
                  <td className="px-4 py-4">{student.program}</td>
                  <td className="px-4 py-4">{student.semester}</td>
                  <td className="px-4 py-4">{student.gpa.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[student.riskLevel]}`}>
                      {student.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
              {visibleStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-sm text-slate-500">
                    No students match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            {filteredStudents.length} students found
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-slate-400"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= pageCount}
              onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-slate-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
