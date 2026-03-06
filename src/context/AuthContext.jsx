import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get('/auth/status')
      if (response.data.authenticated) {
        setUser(response.data.user)
        setAuthenticated(true)
      } else {
        setUser(null)
        setAuthenticated(false)
      }
    } catch (error) {
      // Network error means backend is not running — treat as unauthenticated
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
        console.error('Auth check failed:', error.message)
      }
      setUser(null)
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const login = () => {
    window.location.href = '/auth/google'
  }

  const logout = async () => {
    try {
      await api.get('/auth/logout')
      setUser(null)
      setAuthenticated(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const value = {
    user,
    loading,
    authenticated,
    login,
    logout,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
