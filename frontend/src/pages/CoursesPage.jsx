import { useEffect, useState } from 'react'
import api, { coursesApi } from '../services/api'

function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [difficulty, setDifficulty] = useState([])

  const [gradesId, setGradesId] = useState('')
  const [grades, setGrades] = useState(null)
  const [gradesError, setGradesError] = useState('')

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data.data))
    coursesApi.difficulty().then(res => setDifficulty(res.data.data)).catch(() => {})
  }, [])

  function loadGrades() {
    setGrades(null)
    setGradesError('')
    coursesApi.grades(gradesId)
      .then(res => setGrades(res.data))
      .catch(err => setGradesError(err.response?.data?.error ?? 'Not found'))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Courses</h1>
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Credits</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.code}</td>
                <td className="p-3">{c.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Difficulty Ranking</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Difficulty Index</th>
              <th className="p-3 text-left">Fail Rate</th>
              <th className="p-3 text-left">Avg Grade</th>
              <th className="p-3 text-left">Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {difficulty.map(c => (
              <tr key={c.courseId} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.difficultyIndex?.toFixed(2)}</td>
                <td className="p-3">{c.failRate?.toFixed(1)}%</td>
                <td className="p-3">{c.avgGrade?.toFixed(2)}</td>
                <td className="p-3">{c.enrolled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Grade Breakdown</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded px-3 py-1 text-sm"
            placeholder="Course ID"
            value={gradesId}
            onChange={e => setGradesId(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            onClick={loadGrades}
          >
            Load
          </button>
        </div>
        {gradesError && <p className="text-red-500 text-sm mb-2">{gradesError}</p>}
        {grades && (
          <div>
            <p className="text-sm text-gray-500 mb-3">{grades.courseName}</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded p-3 text-center">
                <div className="text-xl font-bold">{grades.avgGrade?.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Avg Grade</div>
              </div>
              <div className="bg-green-50 rounded p-3 text-center">
                <div className="text-xl font-bold">{grades.passRate?.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Pass Rate</div>
              </div>
              <div className="bg-gray-50 rounded p-3 text-center">
                <div className="text-xl font-bold">{grades.total}</div>
                <div className="text-xs text-gray-500">Total Students</div>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Grade</th>
                  <th className="p-3 text-left">Count</th>
                </tr>
              </thead>
              <tbody>
                {grades.distribution.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{d.grade}</td>
                    <td className="p-3">{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesPage
