import { useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const kpis = [
  {
    title: 'Average GPA',
    value: '3.14',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8c-2.21 0-4 .9-4 2v4c0 1.1 1.79 2 4 2s4-.9 4-2v-4c0-1.1-1.79-2-4-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 8V6a4 4 0 118 0v2" />
      </svg>
    ),
    accent: 'bg-blue-50 text-blue-700',
  },
  {
    title: 'Pass Rate',
    value: '91.2%',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
      </svg>
    ),
    accent: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'At-Risk Count',
    value: '347',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0021 17.07V8.93A2 2 0 0019.07 7H4.93A2 2 0 003 8.93v8.14A2 2 0 005.07 19z" />
      </svg>
    ),
    accent: 'bg-amber-50 text-amber-700',
  },
  {
    title: 'Dropout Rate',
    value: '3.8%',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l2 2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20.334 15.334A9 9 0 1112 3v3" />
      </svg>
    ),
    accent: 'bg-rose-50 text-rose-700',
  },
]

const gpaTrend = [
  { semester: 'Fall 2022', avgGpa: 3.02 },
  { semester: 'Spring 2023', avgGpa: 3.08 },
  { semester: 'Fall 2023', avgGpa: 3.12 },
  { semester: 'Spring 2024', avgGpa: 3.16 },
  { semester: 'Fall 2024', avgGpa: 3.18 },
  { semester: 'Spring 2025', avgGpa: 3.14 },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role') ?? 'Administrator'

  function handleLogout() {
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Kyçur si <span className="font-semibold text-violet-600">{role}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          Dilni
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${kpi.accent}`}>
              {kpi.icon}
            </div>
            <p className="mt-5 text-sm font-medium text-gray-500">{kpi.title}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">GPA Trend</h2>
            <p className="mt-1 text-sm text-gray-500">Realist mock data for average GPA across six semesters.</p>
          </div>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Fall 2022 – Spring 2025
          </div>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gpaTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="semester" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[2.8, 3.4]} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
              <Line type="monotone" dataKey="avgGpa" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
