import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import StudentsPage from './pages/StudentsPage'
import CoursesPage from './pages/CoursesPage'
import EnrollmentsPage from './pages/EnrollmentsPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<AnalyticsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/enrollments" element={<EnrollmentsPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App