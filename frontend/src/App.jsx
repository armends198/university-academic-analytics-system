import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import AtRiskStudentsPage from './pages/AtRiskStudentsPage'
import StudentSearchPage from './pages/StudentSearchPage'
import CoursesPage from './pages/CoursesPage'
import EnrollmentsPage from './pages/EnrollmentsPage'
import AnalyticsPage from './pages/AnalyticsPage'

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/" element={<AppLayout><AnalyticsPage /></AppLayout>} />
      <Route path="/students" element={<AppLayout><StudentsPage /></AppLayout>} />
      <Route path="/at-risk" element={<AppLayout><AtRiskStudentsPage /></AppLayout>} />
      <Route path="/student-search" element={<AppLayout><StudentSearchPage /></AppLayout>} />
      <Route path="/courses" element={<AppLayout><CoursesPage /></AppLayout>} />
      <Route path="/enrollments" element={<AppLayout><EnrollmentsPage /></AppLayout>} />
    </Routes>
  )
}

export default App