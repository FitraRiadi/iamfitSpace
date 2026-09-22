import { useEffect, useRef, useState } from 'react'
import { VscEdit, VscTrash } from 'react-icons/vsc'
import { apiGet, apiPatch } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useTasks } from '../lib/tasks'
import { setAvatar, clearAvatar, useAvatar } from '../lib/profile'
import { PageHead, Btn, Field, TInput, ErrorBox, SpinnerCircle, Toast } from './ui'
import AvatarCrop from './AvatarCrop'

export default function Settings() {
  const { updateUser } = useAuth()
  const { track } = useTasks()
  const [form, setForm] = useState({ first_name: '', last_name: '', username: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const [cropSrc, setCropSrc] = useState(null)
  const fileRef = useRef(null)
  const avatar = useAvatar()
  const showToast = (message, kind) => setToast({ message, kind: kind || 'ok' })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const me = await apiGet('/api/auth/me/')
        if (!alive) return
        setForm({
          first_name: me.first_name || '',
          last_name: me.last_name || '',
          username: me.username || '',
          email: me.email || '',
        })
        updateUser({ username: me.username })
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const me = await track(apiPatch('/api/auth/me/', {
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username.trim(),
        email: form.email.trim(),
      }), 'UPDATE PROFILE')
      updateUser({ username: me.username })
      showToast('PROFILE UPDATED. Changes are live.')
    } catch (err) {
      const d = err.data
      setError(
        (d && typeof d === 'object' && (d.username?.[0] || d.email?.[0] || d.detail)) || err.message
      )
    } finally {
      setBusy(false)
    }
  }

  const onFile = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (!f.type.startsWith('image/')) {
      showToast('Please choose an image file.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result)
    reader.readAsDataURL(f)
  }

  const fullName = `${form.first_name} ${form.last_name}`.trim() || '—'

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <SpinnerCircle size={52} label="LOADING PROFILE" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <PageHead
        code="// OPS // SETTINGS"
        title="Settings"
        desc="Operator identity. Changes apply immediately across the console."
      />

      <ErrorBox message={error} />

      {/* Avatar + name */}
      <div className="border border-[#2a2a2a] bg-[#1c1b1b] p-5 flex items-center gap-5">
        <div className="relative shrink-0">
          <img
            src={avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-[#353534]"
          />
          <button
            onClick={() => fileRef.current?.click()}
            title="Change photo"
            aria-label="Change photo"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#c0f500] text-[#161f00] flex items-center justify-center border-2 border-[#0e0e0e] hover:bg-[#d4ff4d] transition-colors"
          >
            <VscEdit size={15} />
          </button>
          <button
            onClick={() => { clearAvatar(); showToast('PHOTO REMOVED. Back to default.') }}
            title="Remove photo"
            aria-label="Remove photo"
            className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[#201f1f] text-[#ffb4ab] flex items-center justify-center border-2 border-[#0e0e0e] hover:border-[#ffb4ab] transition-colors"
          >
            <VscTrash size={15} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-mono text-[11px] tracking-[0.15em] text-[#a8b09a] uppercase">
            Operator
          </span>
          <span className="font-jersey text-4xl uppercase leading-none truncate">{fullName}</span>
          <span className="font-mono text-[12px] text-[#c0f500]">@{form.username || '—'}</span>
        </div>
      </div>

      {/* Identity form */}
      <form onSubmit={submit} className="border border-[#2a2a2a] bg-[#1c1b1b] p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name">
            <TInput value={form.first_name} onChange={set('first_name')} placeholder="Fitra" />
          </Field>
          <Field label="Last name">
            <TInput value={form.last_name} onChange={set('last_name')} placeholder="Riadi" />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Username *">
            <TInput required value={form.username} onChange={set('username')} />
          </Field>
          <Field label="Email">
            <TInput type="email" value={form.email} onChange={set('email')} />
          </Field>
        </div>
        <Btn type="submit" disabled={busy}>
          {busy ? 'SAVING...' : 'SAVE CHANGES'}
        </Btn>
      </form>

      {/* Password (later) */}
      <div className="border border-dashed border-[#353534] p-5 flex flex-col gap-2 opacity-70">
        <span className="font-mono text-[11px] tracking-[0.15em] text-[#a8b09a] uppercase">
          Change password
        </span>
        <p className="text-[13px] text-[#a8b09a]">
          Coming soon. For now, rotate it via Django admin or{' '}
          <span className="font-mono text-[12px] text-[#e5e2e1]">manage.py changepassword</span>.
        </p>
        <Btn variant="secondary" disabled>
          DISABLED
        </Btn>
      </div>

      {cropSrc && (
        <AvatarCrop
          image={cropSrc}
          onCancel={() => setCropSrc(null)}
          onDone={(url) => {
            setAvatar(url)
            setCropSrc(null)
            showToast('PROFILE PHOTO UPDATED.')
          }}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
