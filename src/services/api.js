import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'https://samreen-portfolio.onrender.com')

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access')
    }
    return Promise.reject(error)
  }
)

// API methods
export const projectsApi = {
  // Public
  getAll: () => api.get('/api/projects'),
  
  // Admin
  getAllAdmin: () => api.get('/api/admin/projects'),
  create: (formData) => api.post('/api/admin/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/api/admin/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/admin/projects/${id}`)
}

export const authApi = {
  getStatus: () => api.get('/auth/status'),
  logout: () => api.get('/auth/logout'),
  getGoogleLoginUrl: (redirectUrl) => {
    if (!redirectUrl) {
      return `${API_BASE_URL}/auth/google`
    }
    return `${API_BASE_URL}/auth/google?redirect=${encodeURIComponent(redirectUrl)}`
  }
}

export default api
