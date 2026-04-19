import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const STORAGE_KEY = 'sparrowcart_users'
const SESSION_KEY = 'sparrowcart_session'

const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users))

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY))
      if (session?.rememberMe) return session
      // session-only login (no rememberMe) — clear on fresh load if tab was closed
      return session
    } catch { return null }
  })
  const [authModal, setAuthModal] = useState(false)
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null)

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
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

  const loginWithPhone = ({ phone }) => {
    // OTP login — find or create user by phone
    const users = getUsers()
    let found = users.find(u => u.phone === phone)
    if (!found) {
      found = { id: Date.now(), name: 'User', email: '', phone, password: '', createdAt: new Date().toISOString() }
      saveUsers([...users, found])
    }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    setAuthModal(false)
    return { success: true }
  }

  const logout = () => setUser(null)

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
