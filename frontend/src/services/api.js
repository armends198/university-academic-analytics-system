import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5272/api'
})

export const analyticsApi = {
  comparison: (sem1, sem2) => api.get('/analytics/comparison', { params: { sem1, sem2 } }),
  trends: (program) => api.get('/analytics/trends', { params: program ? { program } : {} }),
  snapshot: (semester) => api.post('/analytics/snapshot', { semester }),
  recalculateRisk: (semester) => api.post('/analytics/recalculate-risk', { semester }),
}

export const studentsApi = {
  atRisk: (params) => api.get('/students/at-risk', { params }),
  history: (id) => api.get(`/students/${id}/history`),
}

export const coursesApi = {
  difficulty: (params) => api.get('/courses/difficulty', { params }),
  grades: (id) => api.get(`/courses/${id}/grades`),
}

export default api
