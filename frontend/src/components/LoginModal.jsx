import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { EASE } from '../lib/anim'

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setError('')
    setPassword('')
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await login(username.trim(), password)
      onClose()
      navigate('/space')
    } catch (err) {
      setError(err.message || 'Login gagal.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Operator login"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="w-full max-w-sm bg-surface-container-lowest border-2 border-primary-container shadow-brutal-lime"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-surface-container-high px-5 py-3">
              <span className="font-hud-code text-hud-code text-primary-container font-bold">
                {'// RESTRICTED // OPERATOR LOGIN'}
              </span>
              <button
                onClick={onClose}
                className="font-hud-code text-on-surface-variant hover:text-primary text-lg leading-none"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-2">
                <label className="font-hud-code text-hud-code text-primary uppercase font-bold">
                  OPERATOR_ID
                </label>
                <input
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="fitra"
                  autoComplete="username"
                  className="bg-surface-container-low border-2 border-surface-container-highest px-4 py-3 font-hud-code text-primary placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-hud-code text-hud-code text-primary uppercase font-bold">
                  PASSPHRASE
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="bg-surface-container-low border-2 border-surface-container-highest px-4 py-3 font-hud-code text-primary placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
              {error && (
                <div className="font-hud-code text-[13px] text-error border border-error px-3 py-2">
                  [!] {error}
                </div>
              )}
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center bg-primary-container text-on-primary-fixed font-hud-label text-hud-label uppercase py-3.5 border-2 border-primary-container shadow-brutal-dark hover:bg-primary transition-colors disabled:opacity-60 font-bold"
              >
                {busy ? 'VERIFYING...' : 'AUTHENTICATE →'}
              </button>
              <p className="font-hud-code text-[11px] text-on-surface-variant text-center">
                UNAUTHORIZED ACCESS IS LOGGED
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
