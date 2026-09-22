import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api'
import { useDeleteQueue, enqueueDelete, flushQueue } from '../lib/deleteQueue'
import { PageHead, Btn, Modal, Field, inputCls, Empty, ErrorBox, SpinnerCircle, Badge, PendingBar, FailedBox, fmtDate } from './ui'

const columnHelper = createColumnHelper()
const PAGE_SIZE = 10

const emptyForm = { name: '', company: '', contact: '', email: '', notes: '' }

function ClientForm({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      if (initial?.id) await apiPatch(`/api/clients/${initial.id}/`, form)
      else await apiPost('/api/clients/', form)
      onSaved()
      onClose()
    } catch (err) {
      const d = err.data
      const msg =
        (d && typeof d === 'object' && (d.name?.[0] || d.email?.[0] || d.detail)) || err.message
      setError(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Name *">
        <input required value={form.name} onChange={set('name')} className={inputCls} placeholder="Client / PIC name" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Company / Org">
          <input value={form.company} onChange={set('company')} className={inputCls} />
        </Field>
        <Field label="Contact">
          <input value={form.contact} onChange={set('contact')} className={inputCls} placeholder="WA / @username" />
        </Field>
      </div>
      <Field label="Email">
        <input type="email" value={form.email} onChange={set('email')} className={inputCls} />
      </Field>
      <Field label="Notes">
        <textarea rows={3} value={form.notes} onChange={set('notes')} className={`${inputCls} resize-none`} />
      </Field>
      {error && <ErrorBox message={error} />}
      <Btn type="submit" disabled={busy}>
        {busy ? 'SAVING...' : initial?.id ? 'SAVE CHANGES' : '+ ADD CLIENT'}
      </Btn>
    </form>
  )
}

export default function Clients() {
  const [rows, setRows] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [sorting, setSorting] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | {mode:'add'} | {mode:'edit', row}
  const [confirmDel, setConfirmDel] = useState(null)

  const ordering = sorting.length
    ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}`
    : '-created_at'

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiGet('/api/clients/', {
        page: page + 1,
        page_size: PAGE_SIZE,
        search: q || undefined,
        ordering,
      })
      setRows(data.results || [])
      setCount(data.count || 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [page, q, ordering])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0)
      setQ(search.trim())
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  // Batched deletes via shared hook (auto-flush on enter/leave/close).
  const dq = useDeleteQueue('clients', load)
  const { queued, failed, syncing } = dq
  const queueDel = () => {
    if (!confirmDel) return
    dq.queueOne({ id: confirmDel.id, label: confirmDel.name })
    setConfirmDel(null)
  }

  // FORCE delete: queue the blocking invoices first, sync them away,
  // then the client delete (still queued) succeeds on retry.
  const [forcing, setForcing] = useState(false)
  const forceDeleteClient = async (item) => {
    setForcing(true)
    try {
      const inv = await apiGet('/api/invoices/', { client: item.id, page_size: 100 })
      for (const v of inv.results || []) {
        enqueueDelete('invoices', { id: v.id, label: v.number })
      }
      await flushQueue('invoices', (id, o) => apiDelete(`/api/invoices/${id}/`, o))
      await dq.syncNow()
    } catch (e) {
      setError(e.message)
    } finally {
      setForcing(false)
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (c) => <span className="font-bold text-[#e5e2e1]">{c.getValue()}</span>,
        enableSorting: true,
      }),
      columnHelper.accessor('company', {
        header: 'Company',
        cell: (c) => c.getValue() || <span className="text-[#a8b09a]/50">—</span>,
        enableSorting: true,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (c) => <span className="font-mono text-[12px]">{c.getValue() || '—'}</span>,
        enableSorting: false,
      }),
      columnHelper.accessor('contact', {
        header: 'Contact',
        cell: (c) => c.getValue() || '—',
        enableSorting: false,
      }),
      columnHelper.accessor('created_at', {
        header: 'Since',
        cell: (c) => <span className="font-mono text-[12px] text-[#a8b09a]">{fmtDate(c.getValue())}</span>,
        enableSorting: true,
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <span className="flex gap-2 justify-end">
            <button
              onClick={() => setModal({ mode: 'edit', row: row.original })}
              className="font-mono text-[11px] text-[#c0f500] hover:underline"
            >
              EDIT
            </button>
            <button
              onClick={() => setConfirmDel(row.original)}
              className="font-mono text-[11px] text-[#ffb4ab] hover:underline"
            >
              DELETE
            </button>
          </span>
        ),
      }),
    ],
    []
  )

  const visibleRows = useMemo(() => rows.filter((r) => !dq.hideIds.has(r.id)), [rows, dq.hideIds])

  const table = useReactTable({
    data: visibleRows,
    columns,
    pageCount: Math.max(1, Math.ceil(count / PAGE_SIZE)),
    state: { pagination: { pageIndex: page, pageSize: PAGE_SIZE }, sorting },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater({ pageIndex: page, pageSize: PAGE_SIZE }) : updater
      setPage(next.pageIndex)
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        code="// CRM // CLIENTS"
        title="Clients"
        desc={`${count} clients recorded. Server-side search + sort.`}
        actions={<Btn onClick={() => setModal({ mode: 'add' })}>+ Client</Btn>}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name / company / email..."
          className={`${inputCls} sm:max-w-sm`}
        />
      </div>

      <ErrorBox message={error} onRetry={load} />
      <PendingBar count={queued.length} syncing={syncing} onSync={dq.syncNow} onUndo={dq.undoQueued} />
      <FailedBox
        failed={failed}
        onRetry={dq.syncNow}
        onDismiss={dq.dismissFailed}
        actionsFor={(f) =>
          f.data?.invoices > 0 ? (
            <button
              onClick={() => forceDeleteClient(f)}
              disabled={forcing}
              className="font-mono text-[11px] text-[#161f00] bg-[#ffb4ab] px-2 py-0.5 font-bold hover:opacity-80 disabled:opacity-50 shrink-0"
            >
              {forcing ? 'FORCING...' : `FORCE: DELETE ${f.data.invoices} INVOICE(S) + CLIENT`}
            </button>
          ) : null
        }
      />

      {loading ? (
        <div className="py-24 flex justify-center">
          <SpinnerCircle size={52} label="LOADING CLIENTS" />
        </div>
      ) : rows.length === 0 ? (
        <Empty title="No clients yet" hint="Hit + Client to add the first one." />
      ) : (
        <>
          <div className="border border-[#2a2a2a] bg-[#1c1b1b] overflow-x-auto sp-scroll" data-lenis-prevent>
            <table className="sp-table w-full min-w-[720px]">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        onClick={h.column.getCanSort() ? h.column.getToggleSortingHandler() : undefined}
                        className={h.column.getCanSort() ? 'cursor-pointer hover:text-[#e5e2e1]' : ''}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === 'asc' ? ' ↑' : h.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between font-mono text-[12px] text-[#a8b09a]">
            <span>
              PAGE {page + 1} / {pages} — {count} ROWS
            </span>
            <span className="flex gap-2">
              <Btn variant="secondary" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                ← PREV
              </Btn>
              <Btn
                variant="secondary"
                onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                disabled={page >= pages - 1}
              >
                NEXT →
              </Btn>
            </span>
          </div>
        </>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'edit' ? `EDIT CLIENT #${modal?.row?.id}` : 'ADD CLIENT'}
      >
        {modal && (
          <ClientForm initial={modal.mode === 'edit' ? modal.row : null} onClose={() => setModal(null)} onSaved={load} />
        )}
      </Modal>

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="DELETE CLIENT?">
        {confirmDel && (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] text-[#a8b09a]">
              Delete <span className="text-[#e5e2e1] font-bold">{confirmDel.name}</span>? Linked
              projects/invoices will be affected. Queued first — sent on sync or page leave.
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

      <div className="flex items-center gap-2 font-mono text-[11px] text-[#a8b09a]">
        <Badge color="lime">{count} TOTAL</Badge>
      </div>
    </div>
  )
}
