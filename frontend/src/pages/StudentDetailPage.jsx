import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import api from '../services/api'

function badgeClasses(level) {
  if (level === 'High') return 'bg-red-100 text-red-700'
  if (level === 'Medium') return 'bg-orange-100 text-orange-700'
  return 'bg-emerald-100 text-emerald-700'
}

function capitalize(str) {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function StudentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)

  const backPath = location.state?.from || '/student-search'

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setError(false)
    setData(null)

    api
      .get(`/students/${id}/history`)
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true)
        } else {
          setError(true)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">Duke ngarkuar...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Studenti nuk u gjet</h1>
        <p className="mt-3 text-sm text-gray-500">ID-ja e kërkuar nuk ekziston.</p>
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="mt-6 inline-flex rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Kthehu
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Gabim</h1>
        <p className="mt-3 text-sm text-red-600">Nuk u mundësua ngarkimi i të dhënave. Provo përsëri.</p>
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="mt-6 inline-flex rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Kthehu
        </button>
      </div>
    )
  }

  const name = `${data.firstName} ${data.lastName}`
  const history = data.history.map((h) => ({
    ...h,
    riskLevel: capitalize(h.riskLevel),
  }))
  const latest = history[history.length - 1]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {data.program}{latest ? ` | Semester: ${latest.semester}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="inline-flex items-center justify-center rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          Kthehu
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Current GPA</p>
          <p className="mt-3 text-4xl font-semibold text-gray-900">{data.currentGpa.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Risk Level</p>
          {latest ? (
            <span className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${badgeClasses(latest.riskLevel)}`}>
              {latest.riskLevel}
            </span>
          ) : (
            <p className="mt-3 text-4xl font-semibold text-gray-900">N/A</p>
          )}
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Risk Score</p>
          <p className="mt-3 text-4xl font-semibold text-gray-900">
            {latest?.riskScore?.toFixed(2) ?? 'N/A'}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">GPA History</h2>
            <p className="text-sm text-gray-500">Trend across semesters.</p>
          </div>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">Student details</div>
        </div>

        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="semester" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[1.5, 4]} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
              <Line type="monotone" dataKey="gpa" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900">Semester history</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">GPA</th>
                  <th className="px-4 py-3">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {history.map((snapshot) => (
                  <tr key={snapshot.semester} className="border-b border-gray-100 hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-900">{snapshot.semester}</td>
                    <td className="px-4 py-4">{snapshot.gpa.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(snapshot.riskLevel)}`}>
                        {snapshot.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-6 text-center text-sm text-slate-500">
                      Nuk ka të dhëna historike.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
