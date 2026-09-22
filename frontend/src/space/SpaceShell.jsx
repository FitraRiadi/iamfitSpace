import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  VscGraph,
  VscOrganization,
  VscLayers,
  VscBriefcase,
  VscCreditCard,
  VscTag,
  VscHome,
  VscSignOut,
  VscSettingsGear,
} from 'react-icons/vsc'
import { useAuth } from '../lib/auth'
import { TaskProvider } from '../lib/tasks'
import { SpinnerCircle } from './ui'
import Topbar, { SpaceControls } from './Topbar'
import TaskStack from './TaskStack'
import './space.css'

const NAV = [
  { to: '/space', label: 'OVERVIEW', end: true, Icon: VscGraph },
  { to: '/space/clients', label: 'CLIENTS', Icon: VscOrganization },
  { to: '/space/leads', label: 'LEADS', Icon: VscLayers },
  { to: '/space/projects', label: 'PROJECTS', Icon: VscBriefcase },
  { to: '/space/finance', label: 'FINANCE', Icon: VscCreditCard },
  { to: '/space/products', label: 'PRODUCTS', Icon: VscTag },
  { to: '/space/settings', label: 'SETTINGS', Icon: VscSettingsGear },
]

export function RequireAuth({ children }) {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) {
    return (
      <div className="space-theme min-h-screen bg-[#131313] flex items-center justify-center">
        <SpinnerCircle size={52} label="VERIFYING SESSION" />
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
            Operator-only area. Enter through the secret gate, not by direct URL.
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

function NavItems({ onNav, rail }) {
  return (
    <>
      {NAV.map(({ to, label, end, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNav}
          title={label}
          aria-label={label}
          className={({ isActive }) =>
            `flex items-center justify-center transition-colors relative ${
              rail ? 'w-11 h-11' : 'w-10 h-10 shrink-0'
            } ${
              isActive
                ? 'text-[#c0f500] bg-[#c0f500]/10'
                : 'text-[#a8b09a] hover:text-[#e5e2e1] hover:bg-white/[0.04]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  className={`absolute bg-[#c0f500] ${rail ? 'left-0 top-2 bottom-2 w-[3px]' : 'bottom-0 left-2 right-2 h-[2px]'}`}
                />
              )}
              <Icon size={20} />
            </>
          )}
        </NavLink>
      ))}
    </>
  )
}

export default function SpaceShell() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const out = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <TaskProvider>
    <div className="space-theme min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col">
      {/* Mobile topbar */}
      <div className="md:hidden border-b border-[#2a2a2a] bg-[#0e0e0e] sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link to="/space" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-[#c0f500] text-[#161f00] flex items-center justify-center font-jersey text-base font-bold">
              IF
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#c0f500]">OPERATOR</span>
          </Link>
          <div className="flex items-center gap-0.5">
            <SpaceControls compact />
            <Link
              to="/"
              title="Back to site"
              aria-label="Back to site"
              className="w-10 h-10 flex items-center justify-center text-[#a8b09a]"
            >
              <VscHome size={20} />
            </Link>
            <button
              onClick={out}
              title="Logout"
              aria-label="Logout"
              className="w-10 h-10 flex items-center justify-center text-[#a8b09a]"
            >
              <VscSignOut size={20} />
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto sp-scroll px-3 pb-2.5">
          <NavItems />
        </nav>
      </div>

      {/* Desktop topbar — full width above everything. Direct child of the
          page column so sticky has room to work (a sticky element can only
          stick within its parent's height). */}
      <Topbar />

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Sidebar icon rail (desktop) — sits one layer under the topbar */}
        <aside className="hidden md:flex w-[68px] shrink-0 flex-col items-center border-r border-[#2a2a2a] bg-[#0e0e0e] sticky top-12 h-[calc(100vh-3rem)] py-4 gap-1 self-start">
          <nav className="flex flex-col gap-1">
            <NavItems rail />
          </nav>
          <div className="mt-auto flex flex-col items-center gap-1">
            <Link
              to="/"
              title="Back to site"
              aria-label="Back to site"
              className="w-11 h-11 flex items-center justify-center text-[#a8b09a] hover:text-[#e5e2e1] hover:bg-white/[0.04] transition-colors"
            >
              <VscHome size={20} />
            </Link>
            <button
              onClick={out}
              title="Logout"
              aria-label="Logout"
              className="w-11 h-11 flex items-center justify-center text-[#a8b09a] hover:text-[#ffb4ab] hover:bg-white/[0.04] transition-colors"
            >
              <VscSignOut size={20} />
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-3 sm:px-5 py-5 w-full">
          <Outlet />
        </main>
      </div>
      {/* Activity stack persists across dashboard pages (provider above). */}
      <TaskStack />
    </div>
    </TaskProvider>
  )
}
