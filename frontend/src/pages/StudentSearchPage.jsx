import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

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

export default function StudentSearchPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState('All')
  const [minGpa, setMinGpa] = useState('')
  const [maxGpa, setMaxGpa] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)
      setPage(1)

      const params = {}
      if (searchQuery.trim()) params.name = searchQuery.trim()
      if (programFilter !== 'All') params.program = programFilter
      if (minGpa !== '') params.minGpa = minGpa
      if (maxGpa !== '') params.maxGpa = maxGpa

      api
        .get('/students/search', { params })
        .then((res) => {
          setStudents(
            res.data.map((s) => ({
              id: s.id,
              name: `${s.firstName} ${s.lastName}`,
              program: s.program,
              gpa: s.gpa,
            }))
          )
        })
        .catch(() => {
          setError('Nuk u mundësua kërkimi i studentëve. Provo përsëri.')
        })
        .finally(() => setLoading(false))
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery, programFilter, minGpa, maxGpa])

  function handleFilterChange(setter) {
    return (value) => setter(value)
  }

  const pageSize = 5
  const pageCount = Math.max(1, Math.ceil(students.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleStudents = students.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kërko Studentë</h1>
          <p className="mt-2 text-sm text-gray-500">Gjej dhe filtro studentët me GPA dhe program.</p>
        </div>
        <div className="w-full md:w-1/3">
          <label className="sr-only" htmlFor="student-search-input">Search students</label>
          <input
            id="student-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name"
            className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
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
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        {loading && (
          <p className="py-10 text-center text-sm text-slate-500">Duke ngarkuar...</p>
        )}

        {error && (
          <p className="py-10 text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">GPA</th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-900">
                      <Link
                        to={`/students/${student.id}`}
                        state={{ from: '/student-search' }}
                        className="text-slate-900 hover:text-violet-600"
                      >
                        {student.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">{student.program}</td>
                    <td className="px-4 py-4">{student.gpa.toFixed(2)}</td>
                  </tr>
                ))}
                {visibleStudents.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-6 text-center text-sm text-slate-500">
                      No students match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              {students.length} students found
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
              <span className="text-sm text-slate-500">
                {currentPage} / {pageCount}
              </span>
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
        )}
      </div>
    </div>
  )
}
