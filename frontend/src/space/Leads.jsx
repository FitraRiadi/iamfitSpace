import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiGet, apiPost, apiPatch } from '../lib/api'
import { useDeleteQueue } from '../lib/deleteQueue'
import { PageHead, Btn, Modal, Field, inputCls, ErrorBox, SpinnerCircle, Badge, PendingBar, FailedBox, fmtIDR, fmtDate } from './ui'

const STATUSES = [
  { value: 'new', label: 'NEW LEAD', color: 'gray' },
  { value: 'contacted', label: 'CONTACTED', color: 'blue' },
  { value: 'discussion', label: 'DISCUSSION', color: 'blue' },
  { value: 'proposal_sent', label: 'PROPOSAL', color: 'amber' },
  { value: 'negotiation', label: 'DEALING', color: 'amber' },
  { value: 'won', label: 'WON', color: 'lime' },
  { value: 'lost', label: 'LOST', color: 'red' },
]

const emptyForm = {
  title: '',
  contact: '',
  client: '',
  value_estimate: '',
  status: 'new',
  follow_up_date: '',
  notes: '',
}

function LeadForm({ initial, clients, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(initial || {}),
    client: initial?.client || '',
    value_estimate: initial?.value_estimate ?? '',
    follow_up_date: initial?.follow_up_date || '',
  }))
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (!initial?.id) return
    let alive = true
    apiGet('/api/lead-logs/', { lead: initial.id, page_size: 20 })
      .then((d) => {
        if (alive) setLogs(d.results || [])
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [initial])

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const payload = {
      ...form,
      client: form.client || null,
      value_estimate: form.value_estimate === '' ? 0 : form.value_estimate,
      follow_up_date: form.follow_up_date || null,
    }
    try {
      if (initial?.id) await apiPatch(`/api/leads/${initial.id}/`, payload)
      else await apiPost('/api/leads/', payload)
      onSaved()
      onClose()
    } catch (err) {
      setError(err.data?.title?.[0] || err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Lead title *">
        <input required value={form.title} onChange={set('title')} className={inputCls} placeholder="e.g. Company profile + CMS" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Contact">
          <input value={form.contact} onChange={set('contact')} className={inputCls} />
        </Field>
        <Field label="Linked client">
          <select value={form.client} onChange={set('client')} className={inputCls}>
            <option value="">— no client —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Estimated value (Rp)">
          <input
            type="number"
            min="0"
            value={form.value_estimate}
            onChange={set('value_estimate')}
            className={inputCls}
          />
        </Field>
        <Field label="Follow-up">
          <input type="date" value={form.follow_up_date} onChange={set('follow_up_date')} className={inputCls} />
        </Field>
      </div>
      <Field label="Status">
        <select value={form.status} onChange={set('status')} className={inputCls}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Notes">
        <textarea rows={3} value={form.notes} onChange={set('notes')} className={`${inputCls} resize-none`} />
      </Field>
      {logs.length > 0 && (
        <div className="border border-[#2a2a2a] bg-[#0e0e0e] px-3 py-2">
          <div className="font-mono text-[10px] tracking-[0.15em] text-[#a8b09a] mb-1.5">STATUS HISTORY</div>
          <ul className="flex flex-col gap-1 font-mono text-[11px] text-[#a8b09a]">
            {logs.map((g) => (
              <li key={g.id}>
                {g.from_status || '—'} → <span className="text-[#c0f500]">{g.to_status}</span> · {fmtDate(g.created_at)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <ErrorBox message={error} />}
      <Btn type="submit" disabled={busy}>
        {busy ? 'SAVING...' : initial?.id ? 'SAVE CHANGES' : '+ ADD LEAD'}
      </Btn>
    </form>
  )
}

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const [dragId, setDragId] = useState(null)
  const [overCol, setOverCol] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [l, c] = await Promise.all([
        apiGet('/api/leads/', { page_size: 200, ordering: '-updated_at' }),
        apiGet('/api/clients/', { page_size: 200, ordering: 'name' }),
      ])
      setLeads(l.results || [])
      setClients(c.results || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const dq = useDeleteQueue('leads', load)
  const { queued, failed, syncing } = dq

  const move = async (id, status) => {
    const prev = leads
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)))
    setSelectedId(null)
    setOverCol(null)
    try {
      await apiPatch(`/api/leads/${id}/`, { status })
    } catch (e) {
      setLeads(prev)
      setError(e.message)
    }
  }

  const queueDel = () => {
    if (!confirmDel) return
    dq.queueOne({ id: confirmDel.id, label: confirmDel.title })
    setConfirmDel(null)
  }

  const visibleLeads = useMemo(() => leads.filter((l) => !dq.hideIds.has(l.id)), [leads, dq.hideIds])
  const byStatus = (s) => visibleLeads.filter((l) => l.status === s)
  const totalPipeline = visibleLeads
    .filter((l) => !['won', 'lost'].includes(l.status))
    .reduce((a, l) => a + Number(l.value_estimate || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        code="// CRM // LEAD PIPELINE"
        title="Leads"
        desc="Drag cards across columns (desktop) or tap a card → tap the target column (mobile). Moves are logged automatically."
        actions={<Btn onClick={() => setModal({ mode: 'add' })}>+ Lead</Btn>}
      />

      <div className="flex items-center gap-2 font-mono text-[12px]">
        <Badge color="amber">{fmtIDR(totalPipeline)} OPEN PIPELINE</Badge>
        <Badge color="gray">{visibleLeads.length} LEADS</Badge>
      </div>

      <ErrorBox message={error} onRetry={load} />
      <PendingBar count={queued.length} syncing={syncing} onSync={dq.syncNow} onUndo={dq.undoQueued} />
      <FailedBox failed={failed} onRetry={dq.syncNow} onDismiss={dq.dismissFailed} />

      {loading ? (
        <div className="py-24 flex justify-center">
          <SpinnerCircle size={52} label="LOADING PIPELINE" />
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto sp-scroll pb-4 items-start" data-lenis-prevent>
          {STATUSES.map((s) => {
            const cards = byStatus(s.value)
            const colTotal = cards.reduce((a, l) => a + Number(l.value_estimate || 0), 0)
            const isOver = overCol === s.value
            return (
              <div
                key={s.value}
                data-over={isOver}
                onDragOver={(e) => {
                  e.preventDefault()
                  setOverCol(s.value)
                }}
                onDragLeave={() => setOverCol((c) => (c === s.value ? null : c))}
                onDrop={(e) => {
                  e.preventDefault()
                  const id = Number(e.dataTransfer.getData('text/lead-id'))
                  if (id) move(id, s.value)
                }}
                className="sp-kanban-col shrink-0 w-[270px] border border-[#2a2a2a] bg-[#0e0e0e] flex flex-col max-h-[70vh] transition-colors"
              >
                <div className="px-3 py-2.5 border-b border-[#2a2a2a] bg-[#1c1b1b] sticky top-0">
                  <div className="flex items-center justify-between">
                    <Badge color={s.color}>{s.label}</Badge>
                    <span className="font-mono text-[11px] text-[#a8b09a]">{cards.length}</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#a8b09a] mt-1">{fmtIDR(colTotal)}</div>
                  {selectedId && (
                    <button
                      onClick={() => move(selectedId, s.value)}
                      className="mt-2 w-full font-mono text-[11px] py-1.5 border border-dashed border-[#c0f500] text-[#c0f500] hover:bg-[#c0f500]/10"
                    >
                      ↓ MOVE HERE
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2 p-2.5 overflow-y-auto sp-scroll" data-lenis-prevent>
                  {cards.map((l) => (
                    <div
                      key={l.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/lead-id', String(l.id))
                        setDragId(l.id)
                      }}
                      onDragEnd={() => {
                        setDragId(null)
                        setOverCol(null)
                      }}
                      onClick={() => setSelectedId((s_) => (s_ === l.id ? null : l.id))}
                      className={`border bg-[#1c1b1b] p-3 cursor-grab active:cursor-grabbing transition-colors ${
                        dragId === l.id
                          ? 'sp-card-drag border-[#353534]'
                          : selectedId === l.id
                            ? 'border-[#c0f500]'
                            : 'border-[#2a2a2a] hover:border-[#a8b09a]'
                      }`}
                    >
                      <div className="text-[13px] font-bold leading-snug">{l.title}</div>
                      <div className="font-mono text-[12px] text-[#c0f500] mt-1">{fmtIDR(l.value_estimate)}</div>
                      <div className="flex items-center justify-between mt-2 font-mono text-[11px] text-[#a8b09a]">
                        <span className="truncate">{l.client_name || l.contact || '—'}</span>
                        <span>{l.follow_up_date ? fmtDate(l.follow_up_date) : ''}</span>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setModal({ mode: 'edit', row: l })
                          }}
                          className="font-mono text-[11px] text-[#a8c7fa] hover:underline"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setConfirmDel(l)
                          }}
                          className="font-mono text-[11px] text-[#ffb4ab] hover:underline"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <div className="font-mono text-[11px] text-[#a8b09a]/60 text-center py-6 border border-dashed border-[#2a2a2a]">
                      drop here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? `EDIT LEAD #${modal?.row?.id}` : 'ADD LEAD'} wide>
        {modal && (
          <LeadForm
            initial={modal.mode === 'edit' ? modal.row : null}
            clients={clients}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
      </Modal>

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="DELETE LEAD?">
        {confirmDel && (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] text-[#a8b09a]">
              Delete <span className="text-[#e5e2e1] font-bold">{confirmDel.title}</span> with its history?
              Queued first — sent on sync or page leave.
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="secondary" onClick={() => setConfirmDel(null)}>
                CANCEL
              </Btn>
              <Btn variant="primary" onClick={queueDel} className="!bg-[#ffb4ab] !border-[#ffb4ab] !text-[#161f00]">
                YES, DELETE
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
