import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Spinner } from './ui'
import './space.css'

const NAV = [
  { to: '/space', label: 'OVERVIEW', end: true },
  { to: '/space/clients', label: 'CLIENTS' },
  { to: '/space/leads', label: 'LEADS' },
  { to: '/space/projects', label: 'PROJECTS' },
]

export function RequireAuth({ children }) {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) {
    return (
      <div className="space-theme min-h-screen bg-[#131313] flex items-center justify-center">
        <Spinner label="VERIFYING SESSION..." />
      </div>
    )
  }
  if (!user) {
    return (
      <div className="space-theme min-h-screen bg-[#131313] text-[#e5e2e1] flex items-center justify-center px-4">
        <div className="border border-[#353534] bg-[#1c1b1b] px-8 py-10 text-center max-w-sm">
          <div className="font-mono text-[12px] text-[#c0f500] tracking-[0.2em]">[ LOCKED ]</div>
          <h1 className="font-jersey text-5xl uppercase mt-2">Restricted area</h1>
          <p className="text-[13px] text-[#a8b09a] mt-2">
            Area khusus operator. Masuk lewat pintu rahasia, bukan URL langsung.
          </p>
          <Link
            to="/"
            state={{ from: location.pathname }}
            className="inline-flex mt-6 px-5 py-2.5 border border-[#353534] font-mono text-[12px] tracking-wider text-[#e5e2e1] hover:border-[#c0f500] hover:text-[#c0f500] transition-colors"
          >
            ← BACK TO SITE
          </Link>
        </div>
      </div>
    )
  }
  return children
}

function NavItems({ onNav }) {
  return (
    <>
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          onClick={onNav}
          className={({ isActive }) =>
            `flex items-center justify-between px-4 py-2.5 border-l-2 font-mono text-[12px] tracking-wider transition-colors ${
              isActive
                ? 'border-[#c0f500] bg-[#c0f500]/10 text-[#c0f500] font-bold'
                : 'border-transparent text-[#a8b09a] hover:text-[#e5e2e1] hover:bg-white/[0.03]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>[ {n.label} ]</span>
              {isActive && <span className="w-1.5 h-1.5 bg-[#c0f500]" />}
            </>
          )}
        </NavLink>
      ))}
    </>
  )
}

export default function SpaceShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const out = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="space-theme min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#2a2a2a] bg-[#0e0e0e] min-h-screen sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-[#2a2a2a]">
          <div className="font-jersey text-3xl uppercase leading-none">IamFit Space</div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-[#c0f500] mt-1">OPERATOR CONSOLE</div>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          <NavItems />
        </nav>
        <div className="mt-auto p-4 border-t border-[#2a2a2a] flex flex-col gap-3">
          <div className="font-mono text-[11px] text-[#a8b09a]">
            LOGIN AS <span className="text-[#e5e2e1] font-bold">{user?.username || '—'}</span>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="flex-1 text-center px-3 py-2 border border-[#353534] font-mono text-[11px] tracking-wider text-[#a8b09a] hover:text-[#e5e2e1] hover:border-[#a8b09a] transition-colors"
            >
              ← SITE
            </Link>
            <button
              onClick={out}
              className="flex-1 px-3 py-2 border border-[#353534] font-mono text-[11px] tracking-wider text-[#ffb4ab] hover:border-[#ffb4ab] transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden border-b border-[#2a2a2a] bg-[#0e0e0e] sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="font-jersey text-2xl uppercase leading-none">IamFit Space</div>
            <div className="font-mono text-[9px] tracking-[0.2em] text-[#c0f500]">OPERATOR CONSOLE</div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="px-3 py-2 border border-[#353534] font-mono text-[11px] text-[#a8b09a]"
            >
              SITE
            </Link>
            <button
              onClick={out}
              className="px-3 py-2 border border-[#353534] font-mono text-[11px] text-[#ffb4ab]"
            >
              OUT
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto sp-scroll px-3 pb-3">
          <NavItems />
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
