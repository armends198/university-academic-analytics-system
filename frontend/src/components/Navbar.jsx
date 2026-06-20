import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex gap-6">
      <Link to="/dashboard" className="font-bold text-blue-600">Dashboard</Link>
      <Link to="/at-risk" className="text-gray-600 hover:text-blue-600">At-Risk</Link>
      <Link to="/student-search" className="text-gray-600 hover:text-blue-600">Student Search</Link>
      <Link to="/semester-comparison" className="text-gray-600 hover:text-blue-600">Semester Comparison</Link>
    </nav>
  )
}

export default Navbar