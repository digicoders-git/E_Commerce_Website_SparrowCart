import { createContext, useContext, useState, useEffect } from 'react'
import { sendOtp, verifyOtp } from '../api/api'

const AuthContext = createContext()

const STORAGE_KEY = 'sparrowcart_users'
const SESSION_KEY = 'sparrowcart_session'
const TOKEN_KEY = 'authToken'

const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users))

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      // Check for JWT token first
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        // If JWT token exists, try to get user from session
        const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
        return session
      }
      
      // Fallback to old session system
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
      if (session?.rememberMe) return session
      return session
    } catch { return null }
  })
  const [authModal, setAuthModal] = useState(false)
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null)

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else {
      localStorage.removeItem(SESSION_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [user])

  const register = ({ name, email, phone, password }) => {
    const users = getUsers()
    if (users.find(u => u.email === email)) return { error: 'Email already registered' }
    const newUser = { id: Date.now(), name, email, phone, password, createdAt: new Date().toISOString() }
    saveUsers([...users, newUser])
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    setAuthModal(false)
    return { success: true }
  }

  const login = ({ email, password, rememberMe }) => {
    const users = getUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { error: 'Invalid email or password' }
    const { password: _, ...safeUser } = found
    const sessionUser = { ...safeUser, rememberMe: !!rememberMe }
    setUser(sessionUser)
    setAuthModal(false)
    return { success: true }
  }

  const loginWithPhone = async ({ phone }) => {
    try {
      // First send OTP
      const otpResult = await sendOtp(phone)
      if (!otpResult.success) {
        return { error: otpResult.message || 'Failed to send OTP' }
      }
      
      // For demo, auto-verify with dummy OTP (remove in production)
      const verifyResult = await verifyOtp(phone, '123456')
      if (!verifyResult.success) {
        return { error: verifyResult.message || 'OTP verification failed' }
      }
      
      // Set user from backend response
      const { password: _, ...safeUser } = verifyResult.user || { phone, name: 'User' }
      setUser(safeUser)
      setAuthModal(false)
      return { success: true }
    } catch (error) {
      console.error('Login with phone error:', error)
      return { error: 'Login failed. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(SESSION_KEY)
  }

  const updateUser = (data) => {
    const updated = { ...user, ...data }
    setUser(updated)
    // also update in users list
    const users = getUsers()
    saveUsers(users.map(u => u.id === updated.id ? { ...u, ...data } : u))
  }

  const openAuthModal = (redirectTo = null) => {
    setRedirectAfterLogin(redirectTo)
    setAuthModal(true)
  }

  const closeAuthModal = () => {
    setAuthModal(false)
    setRedirectAfterLogin(null)
  }

  return (
    <AuthContext.Provider value={{
      user, login, register, loginWithPhone, logout, updateUser,
      authModal, openAuthModal, closeAuthModal, redirectAfterLogin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
