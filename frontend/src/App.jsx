import { Navigate, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AtRiskStudentsPage from './pages/AtRiskStudentsPage'
import StudentSearchPage from './pages/StudentSearchPage'
import StudentDetailPage from './pages/StudentDetailPage'
import SemesterComparisonPage from './pages/SemesterComparisonPage'

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
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/at-risk" element={<AppLayout><AtRiskStudentsPage /></AppLayout>} />
      <Route path="/student-search" element={<AppLayout><StudentSearchPage /></AppLayout>} />
      <Route path="/students/:id" element={<AppLayout><StudentDetailPage /></AppLayout>} />
      <Route path="/semester-comparison" element={<AppLayout><SemesterComparisonPage /></AppLayout>} />
    </Routes>
  )
}

export default App