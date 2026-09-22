import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Spinner({ label = 'LOADING...' }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[12px] text-[#a8b09a]">
      <span className="w-3 h-3 bg-[#c0f500] animate-ping" />
      {label}
    </div>
  )
}

export function SpinnerCircle({ size = 44, label = 'LOADING' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={label}>
      <span
        className="rounded-full border-2 border-[#353534] border-t-[#c0f500] animate-spin"
        style={{ width: size, height: size }}
      />
      <span className="font-mono text-[11px] tracking-[0.2em] text-[#a8b09a]">{label}</span>
    </div>
  )
}

export function Empty({ title = 'No data yet', hint = '' }) {
  return (
    <div className="border border-[#2a2a2a] bg-[#0e0e0e] px-6 py-10 text-center">
      <div className="font-mono text-[13px] text-[#e5e2e1] font-bold">{title}</div>
      {hint && <div className="font-mono text-[12px] text-[#a8b09a] mt-1">{hint}</div>}
    </div>
  )
}

export function PageHead({ title, desc, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a2a2a] pb-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-jersey text-5xl sm:text-6xl text-[#e5e2e1] uppercase leading-none tracking-tight">
          {title}
        </h1>
        {desc && <p className="text-[13px] text-[#a8b09a] max-w-xl">{desc}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

export function Btn({ children, onClick, type = 'button', variant = 'primary', className = '', disabled }) {
  const styles =
    variant === 'primary'
      ? 'bg-[#c0f500] text-[#161f00] border-[#c0f500] hover:bg-[#d4ff4d] font-bold'
      : variant === 'ghost'
        ? 'bg-transparent text-[#a8b09a] border-[#353534] hover:text-[#e5e2e1] hover:border-[#a8b09a]'
        : 'bg-[#201f1f] text-[#e5e2e1] border-[#353534] hover:border-[#c0f500] hover:text-[#c0f500]'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 border font-mono text-[12px] tracking-wider uppercase transition-colors disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] tracking-[0.1em] text-[#a8b09a] uppercase">{label}</span>
      {children}
      {hint && <span className="font-mono text-[11px] text-[#a8b09a]/70">{hint}</span>}
    </label>
  )
}

export const inputCls =
  'sp-focus bg-[#0e0e0e] border border-[#353534] px-3 py-2.5 text-[13px] text-[#e5e2e1] placeholder:text-[#a8b09a]/50 transition-colors w-full'

export function Modal({ open, onClose, title, children, wide }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 px-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} bg-[#1c1b1b] border border-[#353534] max-h-[90vh] overflow-y-auto sp-scroll`}
          >
            <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-3 sticky top-0 bg-[#1c1b1b] z-10">
              <span className="font-mono text-[12px] text-[#c0f500] font-bold tracking-wider">{title}</span>
              <button
                onClick={onClose}
                className="font-mono text-[#a8b09a] hover:text-[#e5e2e1] text-lg leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const badgeColors = {
  lime: 'text-[#c0f500] border-[#c0f500]/40 bg-[#c0f500]/10',
  red: 'text-[#ffb4ab] border-[#ffb4ab]/40 bg-[#ffb4ab]/10',
  amber: 'text-[#ffd791] border-[#ffd791]/40 bg-[#ffd791]/10',
  blue: 'text-[#a8c7fa] border-[#a8c7fa]/40 bg-[#a8c7fa]/10',
  gray: 'text-[#a8b09a] border-[#353534] bg-white/[0.03]',
}

export function Badge({ color = 'gray', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ${badgeColors[color] || badgeColors.gray}`}
    >
      {children}
    </span>
  )
}

export function ErrorBox({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="border border-[#ffb4ab]/50 bg-[#ffb4ab]/5 px-4 py-3 font-mono text-[12px] text-[#ffb4ab] flex items-center justify-between gap-3">
      <span>[!] {message}</span>
      {onRetry && (
        <button onClick={onRetry} className="underline hover:no-underline shrink-0">
          RETRY
        </button>
      )}
    </div>
  )
}

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [toast, onClose])
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className={`fixed bottom-5 right-5 z-[140] max-w-xs border px-4 py-3 font-mono text-[12px] flex items-start gap-3 ${
            toast.kind === 'error'
              ? 'border-[#ffb4ab]/60 bg-[#1c1b1b] text-[#ffb4ab]'
              : 'border-[#c0f500]/60 bg-[#1c1b1b] text-[#e5e2e1]'
          }`}
          role="status"
        >
          <span className={`mt-0.5 w-2 h-2 shrink-0 ${toast.kind === 'error' ? 'bg-[#ffb4ab]' : 'bg-[#c0f500]'}`} />
          <span className="flex-1">{toast.message}</span>
          <button onClick={onClose} className="text-[#a8b09a] hover:text-[#e5e2e1] leading-none" aria-label="Close">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function PendingBar({ count, syncing, onSync, onUndo }) {
  if (!count) return null
  return (
    <div className="border border-[#ffd791]/50 bg-[#ffd791]/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
      <span className="font-mono text-[12px] text-[#ffd791] flex-1">
        [{count} DELETION{count > 1 ? 'S' : ''} QUEUED] — sent on sync or when you leave this page.
      </span>
      <span className="flex gap-2 shrink-0">
        <Btn variant="secondary" onClick={onUndo} disabled={syncing}>
          UNDO
        </Btn>
        <Btn onClick={onSync} disabled={syncing}>
          {syncing ? 'SYNCING...' : `SYNC NOW (${count})`}
        </Btn>
      </span>
    </div>
  )
}

export function FailedBox({ failed, onRetry, onDismiss, actionsFor }) {
  if (!failed || !failed.length) return null
  return (
    <div className="border border-[#ffb4ab]/50 bg-[#ffb4ab]/5 px-4 py-3 flex flex-col gap-2">
      <span className="font-mono text-[12px] text-[#ffb4ab] font-bold">
        [{failed.length} DELETE{failed.length > 1 ? 'S' : ''} REJECTED BY SERVER]
      </span>
      <ul className="flex flex-col gap-1.5">
        {failed.map((f) => (
          <li key={f.id} className="font-mono text-[12px] text-[#e5e2e1] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="flex-1">
              {f.label} — <span className="text-[#ffb4ab]">{f.error}</span>
            </span>
            {actionsFor?.(f)}
          </li>
        ))}
      </ul>
      <span className="flex gap-2">
        <Btn variant="secondary" onClick={onDismiss}>
          DISMISS
        </Btn>
        <Btn onClick={onRetry}>RETRY SYNC</Btn>
      </span>
    </div>
  )
}

export function fmtIDR(n) {
  const v = Number(n || 0)
  return 'Rp ' + v.toLocaleString('id-ID', { maximumFractionDigits: 0 })
}

export function fmtDate(s) {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return s
  }
}
