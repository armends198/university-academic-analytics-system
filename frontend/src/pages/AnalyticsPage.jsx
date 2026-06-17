import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import api, { analyticsApi } from '../services/api'

function AnalyticsPage() {
  const [atRisk, setAtRisk] = useState([])
  const [difficulty, setDifficulty] = useState([])

  const [trends, setTrends] = useState([])
  const [trendProgram, setTrendProgram] = useState('')

  const [sem1, setSem1] = useState('')
  const [sem2, setSem2] = useState('')
  const [comparison, setComparison] = useState(null)
  const [compError, setCompError] = useState('')

  const [snapshotSem, setSnapshotSem] = useState('')
  const [snapshotResult, setSnapshotResult] = useState(null)

  const [recalcSem, setRecalcSem] = useState('')
  const [recalcResult, setRecalcResult] = useState(null)

  useEffect(() => {
    api.get('/analytics/at-risk').then(res => setAtRisk(res.data)).catch(() => {})
    api.get('/analytics/course-difficulty').then(res => setDifficulty(res.data)).catch(() => {})
    analyticsApi.trends().then(res => setTrends(res.data.data)).catch(() => {})
  }, [])

  function loadTrends() {
    analyticsApi.trends(trendProgram || undefined)
      .then(res => setTrends(res.data.data))
      .catch(() => {})
  }

  function compare() {
    setCompError('')
    setComparison(null)
    analyticsApi.comparison(sem1, sem2)
      .then(res => setComparison(res.data))
      .catch(err => setCompError(err.response?.data?.error ?? 'Request failed'))
  }

  function takeSnapshot() {
    analyticsApi.snapshot(snapshotSem)
      .then(res => setSnapshotResult(res.data))
      .catch(() => setSnapshotResult({ error: 'Failed' }))
  }

  function recalcRisk() {
    analyticsApi.recalculateRisk(recalcSem)
      .then(res => setRecalcResult(res.data))
      .catch(() => setRecalcResult({ error: 'Failed' }))
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Course Difficulty Ranking</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={difficulty}>
            <XAxis dataKey="courseName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="averageGrade" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">At-Risk Students</h2>
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">GPA</th>
              <th className="p-3 text-left">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {atRisk.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.gpa}</td>
                <td className="p-3 text-red-500">{s.riskLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">GPA &amp; Pass-Rate Trends</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded px-3 py-1 text-sm"
            placeholder="Program (optional)"
            value={trendProgram}
            onChange={e => setTrendProgram(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            onClick={loadTrends}
          >
            Load
          </button>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trends}>
            <XAxis dataKey="semester" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgGpa" stroke="#3b82f6" name="Avg GPA" dot={false} />
            <Line type="monotone" dataKey="passRate" stroke="#22c55e" name="Pass Rate" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Semester Comparison</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded px-3 py-1 text-sm"
            placeholder="Semester 1 (e.g. Fall 2024)"
            value={sem1}
            onChange={e => setSem1(e.target.value)}
          />
          <input
            className="border rounded px-3 py-1 text-sm"
            placeholder="Semester 2 (e.g. Spring 2025)"
            value={sem2}
            onChange={e => setSem2(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            onClick={compare}
          >
            Compare
          </button>
        </div>
        {compError && <p className="text-red-500 text-sm mb-2">{compError}</p>}
        {comparison && (
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">{comparison.sem1.label}</th>
                <th className="p-2 text-left">{comparison.sem2.label}</th>
                <th className="p-2 text-left">Delta</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">Avg GPA</td>
                <td className="p-2">{comparison.sem1.avgGpa?.toFixed(2)}</td>
                <td className="p-2">{comparison.sem2.avgGpa?.toFixed(2)}</td>
                <td className={`p-2 font-medium ${comparison.delta.avgGpa >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {comparison.delta.avgGpa >= 0 ? '+' : ''}{comparison.delta.avgGpa?.toFixed(2)}
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Pass Rate</td>
                <td className="p-2">{comparison.sem1.passRate?.toFixed(1)}%</td>
                <td className="p-2">{comparison.sem2.passRate?.toFixed(1)}%</td>
                <td className={`p-2 font-medium ${comparison.delta.passRate >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {comparison.delta.passRate >= 0 ? '+' : ''}{comparison.delta.passRate?.toFixed(1)}%
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-2">At-Risk Count</td>
                <td className="p-2">{comparison.sem1.atRiskCount}</td>
                <td className="p-2">{comparison.sem2.atRiskCount}</td>
                <td className={`p-2 font-medium ${comparison.delta.atRiskCount <= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {comparison.delta.atRiskCount >= 0 ? '+' : ''}{comparison.delta.atRiskCount}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Save Snapshot</h2>
        <div className="flex gap-2 mb-3">
          <input
            className="border rounded px-3 py-1 text-sm"
            placeholder="Semester (e.g. Spring 2025)"
            value={snapshotSem}
            onChange={e => setSnapshotSem(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            onClick={takeSnapshot}
          >
            Save Snapshot
          </button>
        </div>
        {snapshotResult && (
          <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(snapshotResult, null, 2)}
          </pre>
        )}
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Recalculate Risk Scores</h2>
        <div className="flex gap-2 mb-3">
          <input
            className="border rounded px-3 py-1 text-sm"
            placeholder="Semester (e.g. Spring 2025)"
            value={recalcSem}
            onChange={e => setRecalcSem(e.target.value)}
          />
          <button
            className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
            onClick={recalcRisk}
          >
            Recalculate
          </button>
        </div>
        {recalcResult && (
          <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(recalcResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

export default AnalyticsPage
