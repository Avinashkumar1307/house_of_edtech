import { useState, useEffect } from 'react'
import { User } from '@/types'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to get stored token
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  // Helper function to store token
  const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  // Helper function to remove token
  const removeToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  const checkSession = async () => {
    try {
      const token = getToken()
      
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const { user } = await response.json()
        setUser(user)
      } else {
        // Token is invalid, remove it
        removeToken()
        setUser(null)
      }
    } catch (error) {
      console.error('Session check failed:', error)
      removeToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store the token
        setToken(data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store the token
        setToken(data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const logout = async () => {
    try {
      const token = getToken()
      
      if (token) {
        await fetch('/api/auth/sign-out', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
      
      // Always clear local state and token
      removeToken()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      // Still clear local state even if API call fails
      removeToken()
      setUser(null)
    }
  }

  const refreshUser = async () => {
    setLoading(true)
    await checkSession()
  }

  useEffect(() => {
    checkSession()
  }, [])

  return {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  }
}