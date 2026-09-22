import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { VscEye, VscEyeClosed } from 'react-icons/vsc'
import { useAuth } from '../lib/auth'
import { EASE } from '../lib/anim'
import meImg from '../assets/me.png'
import brandLogo from '../assets/iamfit-brand.png'

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
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
      setError(err.message || 'Login failed.')
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
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="w-full max-w-3xl bg-surface-container-lowest border-2 border-primary-container shadow-brutal-lime grid grid-cols-1 md:grid-cols-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEFT — lime identity panel */}
            <div className="relative bg-primary-container text-on-primary-fixed flex flex-col items-center justify-center gap-3 px-6 py-8 md:py-10 overflow-hidden">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(0,0,0,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.55) 1px, transparent 1px)',
                  backgroundSize: '26px 26px',
                }}
              />
              <div className="relative font-hud-code text-[11px] font-bold tracking-[0.2em] border-2 border-on-primary-fixed px-3 py-1">
                {'// RESTRICTED'}
              </div>
              <img
                src={meImg}
                alt="Operator portrait"
                className="relative h-44 md:h-56 w-auto object-cover border-2 border-on-primary-fixed shadow-brutal-dark"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="relative text-center">
                <div className="font-jersey text-4xl uppercase leading-none">Fitra Riadi</div>
                <div className="font-hud-code text-[11px] font-bold tracking-[0.2em] mt-1">
                  OPERATOR // FULL ACCESS
                </div>
              </div>
            </div>

            {/* RIGHT — sign-in form */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b-2 border-surface-container-high px-5 py-3">
                <span className="font-hud-code text-hud-code text-primary-container font-bold">
                  SECURE CHANNEL
                </span>
                <span className="flex items-center gap-1.5 font-hud-code text-[11px] text-on-surface-variant">
                  <span className="w-2 h-2 bg-primary-container animate-pulse" />
                  <button
                    onClick={onClose}
                    className="font-hud-code hover:text-primary text-lg leading-none ml-1"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </span>
              </div>
              <form onSubmit={submit} className="flex flex-col gap-4 p-5 sm:p-6 flex-1">
                <img src={brandLogo} alt="IamFit" className="h-8 w-auto mx-auto" />
                <h2 className="font-jersey text-4xl text-primary uppercase leading-none text-center">
                  Operator login
                </h2>
                <div className="flex flex-col gap-2">
                  <label className="font-hud-code text-hud-code text-primary uppercase font-bold">
                    OPERATOR_ID
                  </label>
                  <input
                    autoFocus
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    autoComplete="username"
                    className="bg-surface-container-low border-2 border-surface-container-highest px-4 py-3 font-hud-code text-primary placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-hud-code text-hud-code text-primary uppercase font-bold">
                    PASSPHRASE
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                      autoComplete="current-password"
                      className="bg-surface-container-low border-2 border-surface-container-highest px-4 py-3 pr-12 font-hud-code text-primary placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container transition-all w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary-container transition-colors"
                    >
                      {showPw ? <VscEyeClosed size={18} /> : <VscEye size={18} />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="font-hud-code text-[13px] text-error border border-error px-3 py-2">
                    [!] {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center justify-center bg-primary-container text-on-primary-fixed font-hud-label text-hud-label uppercase py-3.5 border-2 border-primary-container shadow-brutal-dark hover:bg-primary transition-colors disabled:opacity-60 font-bold mt-auto"
                >
                  {busy ? 'VERIFYING...' : 'AUTHENTICATE →'}
                </button>
                <p className="font-hud-code text-[11px] text-on-surface-variant text-center">
                  UNAUTHORIZED ACCESS IS LOGGED
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
