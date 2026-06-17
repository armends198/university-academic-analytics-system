import { useEffect, useState } from 'react'
import api, { studentsApi } from '../services/api'

function StudentsPage() {
  const [students, setStudents] = useState([])
  const [atRisk, setAtRisk] = useState([])

  const [historyId, setHistoryId] = useState('')
  const [history, setHistory] = useState(null)
  const [historyError, setHistoryError] = useState('')

  useEffect(() => {
    api.get('/students').then(res => setStudents(res.data.data))
    studentsApi.atRisk().then(res => setAtRisk(res.data.data)).catch(() => {})
  }, [])

  function loadHistory() {
    setHistory(null)
    setHistoryError('')
    studentsApi.history(historyId)
      .then(res => setHistory(res.data))
      .catch(err => setHistoryError(err.response?.data?.error ?? 'Not found'))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Students</h1>
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">GPA</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.gpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">At-Risk Students ({atRisk.length})</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Program</th>
              <th className="p-3 text-left">Risk Score</th>
              <th className="p-3 text-left">Risk Level</th>
              <th className="p-3 text-left">GPA Drop</th>
              <th className="p-3 text-left">Absence Rate</th>
              <th className="p-3 text-left">Failed Units</th>
            </tr>
          </thead>
          <tbody>
            {atRisk.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.program}</td>
                <td className="p-3">{s.riskScore?.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    s.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                    s.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {s.riskLevel}
                  </span>
                </td>
                <td className="p-3">{s.signals?.gpaDrop?.toFixed(2)}</td>
                <td className="p-3">{s.signals?.absenceRate?.toFixed(1)}%</td>
                <td className="p-3">{s.signals?.failedUnits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Student History</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded px-3 py-1 text-sm"
            placeholder="Student ID"
            value={historyId}
            onChange={e => setHistoryId(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            onClick={loadHistory}
          >
            Load
          </button>
        </div>
        {historyError && <p className="text-red-500 text-sm mb-2">{historyError}</p>}
        {history && (
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Semester</th>
                <th className="p-3 text-left">GPA</th>
                <th className="p-3 text-left">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {history.snapshots.map((snap, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{snap.semester}</td>
                  <td className="p-3">{snap.gpa?.toFixed(2)}</td>
                  <td className="p-3">{snap.riskLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default StudentsPage
