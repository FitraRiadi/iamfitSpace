import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { loginRequest, tokenStore, api } from './api'

const AuthCtx = createContext(null)

function decodeUser() {
  const token = tokenStore.access
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return { id: payload.user_id, username: payload.username || '' }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => decodeUser())
  const [ready, setReady] = useState(false)

  // Validate stored session once on boot (refresh if needed).
  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!tokenStore.access) {
        if (alive) setReady(true)
        return
      }
      try {
        await api('/api/clients/', { method: 'GET' }, true)
        if (alive) setUser(decodeUser())
      } catch {
        tokenStore.clear()
        if (alive) setUser(null)
      } finally {
        if (alive) setReady(true)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const login = useCallback(async (username, password) => {
    await loginRequest(username, password)
    setUser(decodeUser())
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  const updateUser = useCallback((patch) => {
    setUser((u) => ({ ...(u || {}), ...patch }))
  }, [])

  return <AuthCtx.Provider value={{ user, ready, login, logout, updateUser }}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
