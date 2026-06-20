import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex gap-6">
      <Link to="/" className="font-bold text-blue-600">Analytics</Link>
      <Link to="/students" className="text-gray-600 hover:text-blue-600">Students</Link>
      <Link to="/at-risk" className="text-gray-600 hover:text-blue-600">At-Risk</Link>
      <Link to="/student-search" className="text-gray-600 hover:text-blue-600">Student Search</Link>
      <Link to="/courses" className="text-gray-600 hover:text-blue-600">Courses</Link>
      <Link to="/enrollments" className="text-gray-600 hover:text-blue-600">Enrollments</Link>
    </nav>
  )
}

export default Navbar