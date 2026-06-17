import { useEffect, useState } from 'react'
import api from '../services/api'

function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([])

  useEffect(() => {
    api.get('/enrollments').then(res => setEnrollments(res.data.data))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Enrollments</h1>
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-left">Grade</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map(e => (
            <tr key={e.id} className="border-t">
              <td className="p-3">{e.studentName}</td>
              <td className="p-3">{e.courseName}</td>
              <td className="p-3">{e.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EnrollmentsPage