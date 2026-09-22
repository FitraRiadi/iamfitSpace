import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { VscBell, VscSignOut } from 'react-icons/vsc'
import { apiGet } from '../lib/api'
import { useAvatar } from '../lib/profile'
import { useAuth } from '../lib/auth'

function isOverdue(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr + 'T00:00:00') < today
}

function withinDays(dateStr, n) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr + 'T00:00:00')
  const diff = (d - today) / 86400000
  return diff <= n
}

async function fetchAlerts() {
  const [leads, invoices, projects] = await Promise.all([
    apiGet('/api/leads/', { page_size: 200, ordering: 'follow_up_date' }),
    apiGet('/api/invoices/', { page_size: 200, ordering: 'due_date' }),
    apiGet('/api/projects/', { page_size: 200, ordering: 'deadline' }),
  ])
  const items = []
  for (const l of leads.results || []) {
    if (['won', 'lost'].includes(l.status)) continue
    if (l.follow_up_date && withinDays(l.follow_up_date, 3)) {
      items.push({
        id: `lead-${l.id}`,
        kind: isOverdue(l.follow_up_date) ? 'red' : 'amber',
        text: `Follow up: ${l.title}`,
        to: '/space/leads',
      })
    }
  }
  for (const v of invoices.results || []) {
    if (v.status === 'overdue') {
      items.push({ id: `inv-${v.id}`, kind: 'red', text: `Overdue: ${v.number}`, to: '/space/finance' })
    } else if (v.status === 'sent') {
      items.push({ id: `inv-${v.id}`, kind: 'amber', text: `Awaiting payment: ${v.number}`, to: '/space/finance' })
    }
  }
  for (const p of projects.results || []) {
    if (['completed', 'archived'].includes(p.status)) continue
    if (p.deadline && withinDays(p.deadline, 7)) {
      items.push({
        id: `prj-${p.id}`,
        kind: isOverdue(p.deadline) ? 'red' : 'amber',
        text: `Deadline ${isOverdue(p.deadline) ? 'passed' : 'near'}: ${p.name}`,
        to: '/space/projects',
      })
    }
  }
  return items.slice(0, 12)
}

const dotColor = { red: 'bg-[#ffb4ab]', amber: 'bg-[#ffd791]', lime: 'bg-[#c0f500]' }

export function SpaceControls({ compact }) {
  const avatar = useAvatar()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef(null)

  const load = async () => {
    setLoading(true)
    try {
      setAlerts(await fetchAlerts())
    } catch {
      // silent — bell just shows empty
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!open) return
    load()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ])

  const out = () => {
    logout()
    navigate('/', { replace: true })
  }

  const size = compact ? 'w-10 h-10' : 'w-9 h-9'

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative" ref={boxRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          title="Notifications"
          aria-label="Notifications"
          className={`${size} flex items-center justify-center text-[#a8b09a] hover:text-[#e5e2e1] hover:bg-white/[0.04] transition-colors relative`}
        >
          <VscBell size={19} />
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-[#c0f500] text-[#161f00] font-mono text-[10px] font-bold flex items-center justify-center">
              {alerts.length > 9 ? '9+' : alerts.length}
            </span>
          )}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 max-w-[80vw] bg-[#1c1b1b] border border-[#353534] z-50"
            >
              <div className="px-4 py-2.5 border-b border-[#2a2a2a] font-mono text-[11px] tracking-[0.15em] text-[#a8b09a] flex justify-between">
                <span>NOTIFICATIONS</span>
                <span className="text-[#c0f500]">{alerts.length}</span>
              </div>
              <div className="max-h-72 overflow-y-auto sp-scroll">
                {loading && alerts.length === 0 ? (
                  <div className="px-4 py-6 text-center font-mono text-[12px] text-[#a8b09a]">LOADING...</div>
                ) : alerts.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <div className="font-mono text-[12px] text-[#c0f500] font-bold">ALL CLEAR</div>
                    <div className="font-mono text-[11px] text-[#a8b09a] mt-1">Nothing needs you right now.</div>
                  </div>
                ) : (
                  <ul>
                    {alerts.map((a) => (
                      <li key={a.id} className="border-b border-[#2a2a2a] last:border-0">
                        <Link
                          to={a.to}
                          onClick={() => setOpen(false)}
                          className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-white/[0.03] transition-colors"
                        >
                          <span className={`mt-1.5 w-2 h-2 shrink-0 ${dotColor[a.kind] || dotColor.amber}`} />
                          <span className="text-[13px] leading-snug">{a.text}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link to="/space/settings" title="Settings" aria-label="Settings">
        <img
          src={avatar}
          alt="Operator"
          className={`${compact ? 'w-10 h-10' : 'w-9 h-9'} rounded-full object-cover border border-[#353534] hover:border-[#c0f500] transition-colors`}
        />
      </Link>

      <button
        onClick={out}
        title="Logout"
        aria-label="Logout"
        className={`${size} hidden md:flex items-center justify-center text-[#a8b09a] hover:text-[#ffb4ab] hover:bg-white/[0.04] transition-colors`}
      >
        <VscSignOut size={19} />
      </button>
    </div>
  )
}

export default function Topbar() {
  return (
    <div className="hidden md:flex items-center justify-end h-12 shrink-0 border-b border-[#2a2a2a] bg-[#0e0e0e] px-5 sticky top-0 z-40">
      <SpaceControls />
    </div>
  )
}
