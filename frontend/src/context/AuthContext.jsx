import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('graminsetu_user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load stored user', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem('graminsetu_user', JSON.stringify(userData))
    } catch (e) {
      console.error('Failed to persist user', e)
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('graminsetu_user')
    } catch (e) {
      console.error('Failed to clear user', e)
    }
  }

  const value = { user, loading, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
