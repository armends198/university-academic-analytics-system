import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { atRiskStudents } from '../data/students'

const studentData = atRiskStudents

function getBadgeClasses(level) {
  if (level === 'High') return 'bg-red-100 text-red-700'
  if (level === 'Medium') return 'bg-orange-100 text-orange-700'
  return 'bg-emerald-100 text-emerald-700'
}

export default function AtRiskStudentsPage() {
  const [riskFilter, setRiskFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortDirection, setSortDirection] = useState('desc')

  const filteredStudents = useMemo(() => {
    return studentData
      .filter((student) => {
        const matchesFilter = riskFilter === 'All' || student.riskLevel === riskFilter
        const normalizedSearch = searchQuery.trim().toLowerCase()
        const matchesSearch =
          student.name.toLowerCase().includes(normalizedSearch) ||
          student.program.toLowerCase().includes(normalizedSearch)

        return matchesFilter && matchesSearch
      })
      .sort((a, b) => {
        const delta = a.riskScore - b.riskScore
        return sortDirection === 'asc' ? delta : -delta
      })
  }, [riskFilter, searchQuery, sortDirection])

  const sortArrow = sortDirection === 'asc' ? '▲' : '▼'

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">At-Risk Students</h1>
          <p className="mt-2 text-sm text-gray-500">
            Monitoroni studentët me risk të lartë dhe mesatar me filtrime të shpejta.
          </p>
        </div>
        <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          {filteredStudents.length} results
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {['All', 'High', 'Medium', 'Low'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setRiskFilter(level)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  riskFilter === level
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-80">
            <label className="sr-only" htmlFor="search-students">
              Search students
            </label>
            <input
              id="search-students"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or program"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">GPA</th>
                <th
                  className="px-4 py-3 cursor-pointer select-none"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  Risk Score <span className="font-semibold text-slate-900">{sortArrow}</span>
                </th>
                <th className="px-4 py-3">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">
                    <Link to={`/students/${student.id}`} state={{ from: '/at-risk' }} className="text-slate-900 hover:text-violet-600">{student.name}</Link>
                  </td>
                  <td className="px-4 py-4">{student.program}</td>
                  <td className="px-4 py-4">{student.gpa.toFixed(2)}</td>
                  <td className="px-4 py-4">{student.riskScore.toFixed(1)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClasses(student.riskLevel)}`}>
                      {student.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
