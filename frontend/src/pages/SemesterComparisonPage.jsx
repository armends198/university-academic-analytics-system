import { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const semesters = ['Fall 2022', 'Spring 2023', 'Fall 2023', 'Spring 2024', 'Fall 2024', 'Spring 2025']
const programs = ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law']

// mock data per semester per program
const semesterData = {
  'Fall 2022': {
    programs: {
      'Computer Science': { avgGpa: 3.01, passRate: 88, atRiskCount: 20, dropoutRate: 3.2 },
      Engineering: { avgGpa: 2.85, passRate: 84, atRiskCount: 25, dropoutRate: 4.0 },
      Business: { avgGpa: 3.12, passRate: 91, atRiskCount: 12, dropoutRate: 2.8 },
      Medicine: { avgGpa: 3.38, passRate: 95, atRiskCount: 5, dropoutRate: 1.1 },
      Law: { avgGpa: 3.05, passRate: 89, atRiskCount: 10, dropoutRate: 2.5 },
    },
  },
  'Spring 2023': {
    programs: {
      'Computer Science': { avgGpa: 3.05, passRate: 89, atRiskCount: 18, dropoutRate: 3.0 },
      Engineering: { avgGpa: 2.88, passRate: 85, atRiskCount: 24, dropoutRate: 3.8 },
      Business: { avgGpa: 3.15, passRate: 92, atRiskCount: 11, dropoutRate: 2.6 },
      Medicine: { avgGpa: 3.40, passRate: 95, atRiskCount: 4, dropoutRate: 1.0 },
      Law: { avgGpa: 3.07, passRate: 90, atRiskCount: 9, dropoutRate: 2.3 },
    },
  },
  'Fall 2023': {
    programs: {
      'Computer Science': { avgGpa: 3.08, passRate: 90, atRiskCount: 17, dropoutRate: 2.9 },
      Engineering: { avgGpa: 2.92, passRate: 86, atRiskCount: 22, dropoutRate: 3.6 },
      Business: { avgGpa: 3.10, passRate: 91, atRiskCount: 13, dropoutRate: 2.7 },
      Medicine: { avgGpa: 3.42, passRate: 96, atRiskCount: 4, dropoutRate: 0.9 },
      Law: { avgGpa: 3.09, passRate: 90, atRiskCount: 8, dropoutRate: 2.2 },
    },
  },
  'Spring 2024': {
    programs: {
      'Computer Science': { avgGpa: 3.16, passRate: 91, atRiskCount: 15, dropoutRate: 2.6 },
      Engineering: { avgGpa: 2.98, passRate: 87, atRiskCount: 20, dropoutRate: 3.2 },
      Business: { avgGpa: 3.18, passRate: 93, atRiskCount: 10, dropoutRate: 2.4 },
      Medicine: { avgGpa: 3.45, passRate: 96, atRiskCount: 3, dropoutRate: 0.8 },
      Law: { avgGpa: 3.12, passRate: 91, atRiskCount: 7, dropoutRate: 2.0 },
    },
  },
  'Fall 2024': {
    programs: {
      'Computer Science': { avgGpa: 3.18, passRate: 92, atRiskCount: 14, dropoutRate: 2.4 },
      Engineering: { avgGpa: 3.02, passRate: 88, atRiskCount: 18, dropoutRate: 3.0 },
      Business: { avgGpa: 3.20, passRate: 94, atRiskCount: 9, dropoutRate: 2.2 },
      Medicine: { avgGpa: 3.48, passRate: 97, atRiskCount: 3, dropoutRate: 0.7 },
      Law: { avgGpa: 3.15, passRate: 92, atRiskCount: 6, dropoutRate: 1.9 },
    },
  },
  'Spring 2025': {
    programs: {
      'Computer Science': { avgGpa: 3.14, passRate: 91, atRiskCount: 16, dropoutRate: 2.6 },
      Engineering: { avgGpa: 2.99, passRate: 87, atRiskCount: 19, dropoutRate: 3.1 },
      Business: { avgGpa: 3.17, passRate: 93, atRiskCount: 11, dropoutRate: 2.5 },
      Medicine: { avgGpa: 3.46, passRate: 96, atRiskCount: 4, dropoutRate: 0.9 },
      Law: { avgGpa: 3.10, passRate: 90, atRiskCount: 8, dropoutRate: 2.3 },
    },
  },
}

function numberFormat(v, digits = 2) {
  return typeof v === 'number' ? v.toFixed(digits) : 'N/A'
}

export default function SemesterComparisonPage() {
  const [semA, setSemA] = useState('Fall 2024')
  const [semB, setSemB] = useState('Spring 2025')

  const dataA = semesterData[semA]
  const dataB = semesterData[semB]

  const programsComparison = useMemo(() => {
    return programs.map((p) => ({
      program: p,
      aGpa: dataA.programs[p].avgGpa,
      bGpa: dataB.programs[p].avgGpa,
      aPass: dataA.programs[p].passRate,
      bPass: dataB.programs[p].passRate,
    }))
  }, [semA, semB])

  const kpis = useMemo(() => {
    const agg = (d) => {
      const avgGpa = programs.reduce((sum, p) => sum + d.programs[p].avgGpa, 0) / programs.length
      const avgPass = programs.reduce((sum, p) => sum + d.programs[p].passRate, 0) / programs.length
      const atRisk = programs.reduce((sum, p) => sum + d.programs[p].atRiskCount, 0)
      const dropout = programs.reduce((sum, p) => sum + d.programs[p].dropoutRate, 0) / programs.length
      return { avgGpa, avgPass, atRisk, dropout }
    }

    const A = agg(dataA)
    const B = agg(dataB)

    return {
      avgGpa: { a: A.avgGpa, b: B.avgGpa },
      passRate: { a: A.avgPass, b: B.avgPass },
      atRiskCount: { a: A.atRisk, b: B.atRisk },
      dropoutRate: { a: A.dropout, b: B.dropout },
    }
  }, [semA, semB])

  function delta(a, b) {
    const d = b - a
    const sign = d > 0 ? 1 : d < 0 ? -1 : 0
    return { value: d, sign }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Krahasimi i Semestrave</h1>
        <div className="flex gap-3">
          <select value={semA} onChange={(e) => setSemA(e.target.value)} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2">
            {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={semB} onChange={(e) => setSemB(e.target.value)} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2">
            {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 items-center">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center">
          <div className="text-sm text-gray-500">{semA}</div>
          <div className="mt-4 text-4xl font-bold text-gray-900">{numberFormat(kpis.avgGpa.a, 2)}</div>
          <div className="mt-2 text-sm text-gray-500">{programs.length * 40} students</div>
        </div>

        <div className="text-center text-xl font-semibold">VS</div>

        <div className="rounded-3xl border border-gray-200 bg-blue-50 p-6 text-center">
          <div className="text-sm text-blue-700">{semB}</div>
          <div className="mt-4 text-4xl font-bold text-gray-900">{numberFormat(kpis.avgGpa.b, 2)}</div>
          <div className="mt-2 text-sm text-blue-700">{programs.length * 40} students</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { key: 'avgGpa', label: 'Avg GPA', format: (v) => numberFormat(v, 2) },
          { key: 'passRate', label: 'Pass Rate', format: (v) => `${numberFormat(v, 1)}%` },
          { key: 'atRiskCount', label: 'At-Risk Count', format: (v) => `${v}` },
          { key: 'dropoutRate', label: 'Dropout Rate', format: (v) => `${numberFormat(v, 1)}%` },
        ].map((card) => {
          const a = kpis[card.key].a
          const b = kpis[card.key].b
          const d = delta(a, b)
          const improved = d.sign > 0
          const changed = d.value !== 0

          return (
            <div key={card.key} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">{card.label}</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="text-lg font-semibold text-gray-700">{card.format(a)}</div>
                <div className="text-sm text-gray-400">→</div>
                <div className="text-lg font-semibold text-gray-900">{card.format(b)}</div>
                <div className={`ml-3 font-medium ${!changed ? 'text-gray-400' : improved ? 'text-green-600' : 'text-red-600'}`}>
                  {changed ? (d.value > 0 ? `+${numberFormat(d.value, 2)}` : numberFormat(d.value, 2)) : '—'}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">GPA by Program</h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={programsComparison} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="program" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="aGpa" name={semA} fill="#7c3aed" />
              <Bar dataKey="bGpa" name={semB} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pass Rate by Program</h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={programsComparison} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="program" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="aPass" name={semA} fill="#16a34a" />
              <Bar dataKey="bPass" name={semB} fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
