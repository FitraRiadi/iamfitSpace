import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiGet, apiPost, apiPatch } from '../lib/api'
import { useDeleteQueue } from '../lib/deleteQueue'
import { useTasks } from '../lib/tasks'
import { PageHead, Btn, Modal, Field, TInput, TTextarea, TSelect, TSelectItem, TSlider, Empty, ErrorBox, SpinnerCircle, Badge, PendingBar, FailedBox, fmtIDR, fmtDate } from './ui'

const STATUS_OPTS = [
  ['planning', 'PLANNING'],
  ['in_progress', 'IN PROGRESS'],
  ['review', 'REVIEW'],
  ['completed', 'COMPLETED'],
  ['archived', 'ARCHIVED'],
]
const BRANCH_OPTS = [
  ['webdev', 'WEBDEV'],
  ['gamedev', 'GAMEDEV'],
  ['store', 'STORE'],
  ['labs', 'LABS'],
  ['other', 'OTHER'],
]
const statusColor = { planning: 'gray', in_progress: 'blue', review: 'amber', completed: 'lime', archived: 'gray' }
const emptyForm = {
  name: '', branch: 'webdev', client: '', status: 'planning', deadline: '',
  contract_value: '', progress: 0, demo_url: '', repo_url: '', description: '', notes: '',
}

function ProjectForm({ initial, clients, onClose, onSaved }) {
  const { track } = useTasks()
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(initial || {}),
    client: initial?.client || '',
    deadline: initial?.deadline || '',
    contract_value: initial?.contract_value ?? '',
  }))
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      client: form.client || null,
      deadline: form.deadline || null,
      contract_value: form.contract_value === '' ? 0 : form.contract_value,
      progress: Number(form.progress) || 0,
    }
    onClose()
    try {
      if (initial?.id) await track(apiPatch(`/api/projects/${initial.id}/`, payload), `UPDATE PROJECT — ${form.name}`)
      else await track(apiPost('/api/projects/', payload), `CREATE PROJECT — ${form.name}`)
      onSaved()
    } catch {
      // failed task stays visible in the stack for retry/dismiss
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Project name *">
        <TInput required value={form.name} onChange={set('name')} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Branch">
          <TSelect value={form.branch} onValueChange={(v) => setForm((f) => ({ ...f, branch: v }))} placeholder="Select branch">
            {BRANCH_OPTS.map(([v, l]) => (
              <TSelectItem key={v} value={v}>{l}</TSelectItem>
            ))}
          </TSelect>
        </Field>
        <Field label="Status">
          <TSelect value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))} placeholder="Select status">
            {STATUS_OPTS.map(([v, l]) => (
              <TSelectItem key={v} value={v}>{l}</TSelectItem>
            ))}
          </TSelect>
        </Field>
        <Field label="Client">
          <TSelect
            value={String(form.client ?? '')}
            onValueChange={(v) => setForm((f) => ({ ...f, client: v === '' ? '' : Number(v) }))}
            placeholder="— no client —"
          >
            <TSelectItem value="">— no client —</TSelectItem>
            {clients.map((c) => (
              <TSelectItem key={c.id} value={String(c.id)}>{c.name}</TSelectItem>
            ))}
          </TSelect>
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Deadline">
          <TInput type="date" value={form.deadline} onChange={set('deadline')} />
        </Field>
        <Field label="Contract value (Rp)">
          <TInput type="number" min="0" value={form.contract_value} onChange={set('contract_value')} />
        </Field>
        <Field label={`Progress — ${form.progress}%`}>
          <TSlider
            min={0}
            max={100}
            step={1}
            value={[Number(form.progress) || 0]}
            onValueChange={([n]) => setForm((f) => ({ ...f, progress: n }))}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Demo URL">
          <TInput value={form.demo_url} onChange={set('demo_url')} placeholder="https://" />
        </Field>
        <Field label="Repo URL">
          <TInput value={form.repo_url} onChange={set('repo_url')} placeholder="https://" />
        </Field>
      </div>
      <Field label="Description">
        <TTextarea rows={2} value={form.description} onChange={set('description')} />
      </Field>
      <Field label="Notes">
        <TTextarea rows={2} value={form.notes} onChange={set('notes')} />
      </Field>
      <Btn type="submit">
        {initial?.id ? 'SAVE CHANGES' : '+ ADD PROJECT'}
      </Btn>
    </form>
  )
}

export default function Projects() {
  const [rows, setRows] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusF, setStatusF] = useState('')
  const [modal, setModal] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [p, c] = await Promise.all([
        apiGet('/api/projects/', { page_size: 100, ordering: '-updated_at', status: statusF || undefined }),
        apiGet('/api/clients/', { page_size: 200, ordering: 'name' }),
      ])
      setRows(p.results || [])
      setClients(c.results || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [statusF])

  useEffect(() => {
    load()
  }, [load])

  // Batched deletes via shared hook (auto-flush on enter/leave/close).
  const dq = useDeleteQueue('projects', load)
  const { queued, failed, syncing } = dq
  const queueDel = () => {
    if (!confirmDel) return
    dq.queueOne({ id: confirmDel.id, label: confirmDel.name })
    setConfirmDel(null)
  }

  const visibleRows = useMemo(() => rows.filter((r) => !dq.hideIds.has(r.id)), [rows, dq.hideIds])
  const activeValue = visibleRows
    .filter((p) => !['completed', 'archived'].includes(p.status))
    .reduce((a, p) => a + Number(p.contract_value || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        code="// OPS // PROJECTS"
        title="Projects"
        desc="Every build in motion: web, game, store, labs."
        actions={<Btn onClick={() => setModal({ mode: 'add' })}>+ Project</Btn>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <TSelect value={statusF} onValueChange={(v) => setStatusF(v)} placeholder="ALL STATUSES" className="w-auto">
          <TSelectItem value="">ALL STATUSES</TSelectItem>
          {STATUS_OPTS.map(([v, l]) => (
            <TSelectItem key={v} value={v}>{l}</TSelectItem>
          ))}
        </TSelect>
        <Badge color="lime">{fmtIDR(activeValue)} ACTIVE VALUE</Badge>
        <Badge color="gray">{visibleRows.length} PROJECTS</Badge>
      </div>

      <ErrorBox message={error} onRetry={load} />
      <PendingBar count={queued.length} syncing={syncing} onSync={dq.syncNow} onUndo={dq.undoQueued} />
      <FailedBox failed={failed} onRetry={dq.syncNow} onDismiss={dq.dismissFailed} />

      {loading ? (
        <div className="py-24 flex justify-center"><SpinnerCircle size={52} label="LOADING PROJECTS" /></div>
      ) : rows.length === 0 ? (
        <Empty title="No projects yet" hint="Hit + Project to start tracking." />
      ) : (
        <div className="border border-[#2a2a2a] bg-[#1c1b1b] overflow-x-auto sp-scroll" data-lenis-prevent>
          <table className="sp-table w-full min-w-[820px]">
            <thead>
              <tr>
                <th>Project</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Deadline</th>
                <th className="!text-right">Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-bold text-[#e5e2e1]">{p.name}</div>
                    <div className="font-mono text-[11px] text-[#a8b09a]">{p.client_name || '—'}</div>
                  </td>
                  <td><span className="font-mono text-[11px] text-[#a8b09a] uppercase">{p.branch_display || p.branch}</span></td>
                  <td><Badge color={statusColor[p.status] || 'gray'}>{p.status_display || p.status}</Badge></td>
                  <td>
                    <div className="flex items-center gap-2 min-w-[110px]">
                      <div className="flex-1 h-1.5 bg-[#2a2a2a]">
                        <div className="h-full bg-[#c0f500]" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="font-mono text-[11px] text-[#c0f500]">{p.progress}%</span>
                    </div>
                  </td>
                  <td><span className="font-mono text-[12px] text-[#a8b09a]">{fmtDate(p.deadline)}</span></td>
                  <td className="!text-right font-mono text-[12px]">{fmtIDR(p.contract_value)}</td>
                  <td>
                    <span className="flex gap-2 justify-end">
                      <button onClick={() => setModal({ mode: 'edit', row: p })} className="font-mono text-[11px] text-[#c0f500] hover:underline">EDIT</button>
                      <button onClick={() => setConfirmDel(p)} className="font-mono text-[11px] text-[#ffb4ab] hover:underline">DELETE</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? `EDIT PROJECT #${modal?.row?.id}` : 'ADD PROJECT'} wide>
        {modal && (
          <ProjectForm
            initial={modal.mode === 'edit' ? modal.row : null}
            clients={clients}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
      </Modal>

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="DELETE PROJECT?">
        {confirmDel && (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] text-[#a8b09a]">
              Delete <span className="text-[#e5e2e1] font-bold">{confirmDel.name}</span>? Linked invoices/transactions will be orphaned.
              Queued first — sent on sync or page leave.
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="secondary" onClick={() => setConfirmDel(null)}>CANCEL</Btn>
              <Btn variant="destructive" onClick={queueDel}>YES, DELETE</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
