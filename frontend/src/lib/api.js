// API client for the Django/DRF backend.
// Base URL from VITE_API_URL (default local runserver). JWT access token
// attached automatically; on 401 it tries one refresh then retries.

const BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.warn(
    '[iamfit] VITE_API_URL is not set — API calls fall back to http://127.0.0.1:8000 and will fail in production.'
  )
}

const ACCESS_KEY = 'iamfit_access'
const REFRESH_KEY = 'iamfit_refresh'

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS_KEY)
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY)
  },
  set(tokens) {
    if (tokens?.access) localStorage.setItem(ACCESS_KEY, tokens.access)
    if (tokens?.refresh) localStorage.setItem(REFRESH_KEY, tokens.refresh)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

async function raw(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }
  return { res, data }
}

async function refreshAccess() {
  const refresh = tokenStore.refresh
  if (!refresh) return false
  const { res, data } = await raw('/api/auth/refresh/', {
    method: 'POST',
    body: { refresh },
  })
  if (!res.ok || !data?.access) {
    tokenStore.clear()
    return false
  }
  tokenStore.set({ access: data.access })
  return true
}

export async function api(path, options = {}, retry = true) {
  let { res, data } = await raw(path, { ...options, token: tokenStore.access })
  if (res.status === 401 && retry && tokenStore.refresh) {
    const ok = await refreshAccess()
    if (ok) ({ res, data } = await raw(path, { ...options, token: tokenStore.access }))
  }
  if (!res.ok) {
    const err = new Error(data?.detail || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const apiGet = (path, params = {}) => {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.append(k, v)
  })
  const q = qs.toString()
  return api(q ? `${path}?${q}` : path)
}

export const apiPost = (path, body) => api(path, { method: 'POST', body })
export const apiPatch = (path, body) => api(path, { method: 'PATCH', body })
export const apiDelete = (path) => api(path, { method: 'DELETE' })

export async function loginRequest(username, password) {
  const { res, data } = await raw('/api/auth/login/', {
    method: 'POST',
    body: { username, password },
  })
  if (!res.ok) {
    const err = new Error(data?.detail || 'Login gagal. Cek username & password.')
    err.status = res.status
    throw err
  }
  tokenStore.set(data)
  return data
}

// DRF paginated shape -> plain array + total.
export function unwrapList(payload) {
  if (Array.isArray(payload)) return { rows: payload, count: payload.length }
  return { rows: payload?.results || [], count: payload?.count || 0 }
}

export { BASE as API_BASE }
