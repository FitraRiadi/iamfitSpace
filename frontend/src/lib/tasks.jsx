import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const TasksCtx = createContext(null)
let nextId = 1

const MAX_VISIBLE = 6

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    setTasks((ts) => ts.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const push = useCallback(
    (label, status = 'running') => {
      const id = nextId++
      const task = { id, label, status, progress: undefined, at: Date.now() }
      setTasks((ts) => [task, ...ts].slice(0, MAX_VISIBLE + 4))
      // Done tasks linger 1s so the check reads, then the stack swipes them out.
      if (status === 'done' || status === 'failed') {
        if (status === 'done') {
          timers.current[id] = setTimeout(() => remove(id), 1000)
        }
      }
      return id
    },
    [remove]
  )

  const set = useCallback(
    (id, patch) => {
      setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)))
      if (patch.status === 'done') {
        if (timers.current[id]) clearTimeout(timers.current[id])
        timers.current[id] = setTimeout(() => remove(id), 1000)
      }
    },
    [remove]
  )

  // Wrap a promise: running -> done/failed with the result rethrown.
  const track = useCallback(
    async (promise, label) => {
      const id = push(label, 'running')
      try {
        const res = await promise
        set(id, { status: 'done' })
        return res
      } catch (e) {
        set(id, { status: 'failed' })
        throw e
      }
    },
    [push, set]
  )

  const value = useMemo(
    () => ({ tasks, push, set, remove, track }),
    [tasks, push, set, remove, track]
  )
  return <TasksCtx.Provider value={value}>{children}</TasksCtx.Provider>
}

export function useTasks() {
  const ctx = useContext(TasksCtx)
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider')
  return ctx
}
