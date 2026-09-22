// Batched deletes for the dashboard.
// Rows vanish instantly; DELETE requests queue up (persisted in localStorage)
// and flush on manual sync or page leave. Items leave the queue ONLY after
// the server confirms — so a failed/refresh never loses track.

const KEY = 'iamfit_delqueue_v1'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function writeAll(q) {
  try {
    localStorage.setItem(KEY, JSON.stringify(q))
  } catch {
    // storage full/blocked — queue stays in memory only
  }
}

export function getQueue(entity) {
  return readAll()[entity] || []
}

export function enqueueDelete(entity, item) {
  // item: { id, label }
  const q = readAll()
  const list = q[entity] || []
  if (!list.some((r) => r.id === item.id)) list.push({ id: item.id, label: item.label || `#${item.id}` })
  q[entity] = list
  writeAll(q)
  return list
}

export function dropFromQueue(entity, ids) {
  const q = readAll()
  const set = new Set(ids)
  q[entity] = (q[entity] || []).filter((r) => !set.has(r.id))
  writeAll(q)
  return q[entity]
}

export function clearQueue(entity) {
  const q = readAll()
  q[entity] = []
  writeAll(q)
  return []
}

function friendlyError(e, fallback) {
  if (!e) return fallback
  if (e.status === 404) return null // already gone server-side -> treat as done
  const d = e.data
  if (d && typeof d === 'object' && typeof d.detail === 'string') return d.detail
  return e.message || fallback
}

export async function flushQueue(entity, deleteFn, keepalive = false) {
  // Returns { ok, failed: [{id,label,error,data}] }. Failed stay queued.
  // keepalive:true lets the batch survive tab close/refresh (beforeunload).
  const pending = getQueue(entity)
  const failed = []
  const doneIds = []
  let ok = 0
  for (const item of pending) {
    try {
      await deleteFn(item.id, keepalive ? { keepalive: true } : undefined)
      ok++
      doneIds.push(item.id)
    } catch (e) {
      const msg = friendlyError(e, 'Delete failed')
      if (msg === null) {
        ok++
        doneIds.push(item.id) // 404 = already gone, count as done
      } else {
        failed.push({ ...item, error: msg, data: e?.data || null })
      }
    }
  }
  if (doneIds.length) dropFromQueue(entity, doneIds)
  return { ok, failed }
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { apiDelete } from './api'
import { useTasks } from './tasks'

// One hook per entity per page. Handles: optimistic queue, manual sync,
// auto-flush on mount (pending from last session), on unmount (page leave),
// and on tab close/refresh (keepalive). Items leave the queue ONLY on
// confirmed delete, so nothing is ever lost silently.
export function useDeleteQueue(entity, load) {
  const [queued, setQueued] = useState(() => getQueue(entity))
  const [failed, setFailed] = useState([])
  const [syncing, setSyncing] = useState(false)
  const tasksApi = useTasks()
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Stable refs: progress ticks recreate context value — flush effects
  // must NOT resubscribe on every tick (would double-flush).
  const tasksRef = useRef(null)
  tasksRef.current = tasksApi
  const loadRef = useRef(null)
  loadRef.current = load

  const doFlush = useCallback(
    async (keepalive) => {
      const pending = getQueue(entity)
      if (!pending.length) return { ok: 0, failed: [] }
      const api = tasksRef.current
      const label = `SYNC DELETE — ${entity.toUpperCase()} (${pending.length})`
      const tid = api.push(label, 'running')
      api.set(tid, { progress: 0 })
      let done = 0
      const res = await flushQueue(
        entity,
        async (id, o) => {
          try {
            await apiDelete(`/api/${entity}/${id}/`, o)
          } finally {
            done++
            api.set(tid, { progress: done / pending.length })
          }
        },
        keepalive
      )
      api.set(tid, {
        status: res.failed.length ? 'failed' : 'done',
        progress: 1,
      })
      if (mountedRef.current) {
        setFailed(res.failed)
        setQueued(getQueue(entity))
        await loadRef.current()
      }
      return res
    },
    [entity]
  )

  const syncNow = useCallback(async () => {
    setSyncing(true)
    try {
      await doFlush(false)
    } finally {
      if (mountedRef.current) setSyncing(false)
    }
  }, [doFlush])

  const queueOne = useCallback(
    (item) => {
      setQueued(enqueueDelete(entity, item))
    },
    [entity]
  )

  const undoQueued = useCallback(() => {
    clearQueue(entity)
    setQueued([])
    setFailed([])
    load()
  }, [entity, load])

  const dismissFailed = useCallback(() => {
    clearQueue(entity)
    setQueued([])
    setFailed([])
    load()
  }, [entity, load])

  // Auto-flush leftovers on page enter.
  const syncRef = useRef(null)
  syncRef.current = syncNow
  useEffect(() => {
    if (getQueue(entity).length) syncRef.current()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity])

  // Flush on page leave (fire-and-forget).
  useEffect(() => {
    const flag = { current: false }
    return () => {
      if (flag.current) return
      flag.current = true
      doFlush(false).catch(() => {})
    }
  }, [doFlush])

  // Flush on tab close/refresh (keepalive request survives unload).
  useEffect(() => {
    const onUnload = () => {
      doFlush(true).catch(() => {})
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [doFlush])

  const hideIds = useMemo(() => new Set(queued.map((q) => q.id)), [queued])
  return { queued, failed, syncing, syncNow, queueOne, undoQueued, dismissFailed, hideIds, setQueued }
}
