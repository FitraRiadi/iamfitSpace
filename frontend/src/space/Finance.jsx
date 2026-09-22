import { useCallback, useEffect, useState } from 'react'
import { apiGet, apiPost, apiPatch } from '../lib/api'
import { useDeleteQueue } from '../lib/deleteQueue'
import { PageHead, Btn, Modal, Field, inputCls, Empty, ErrorBox, SpinnerCircle, Badge, PendingBar, FailedBox, fmtIDR, fmtDate } from './ui'

const KIND_OPTS = [['income', 'INCOME'], ['expense', 'EXPENSE']]
const INCOME_CATS = ['Website Development', 'Maintenance', 'Consultation', 'Other Services']
const EXPENSE_CATS = ['Hosting', 'Domain', 'Software', 'Asset', 'Operational']

const INV_STATUS = [['draft', 'DRAFT'], ['sent', 'SENT'], ['paid', 'PAID'], ['overdue', 'OVERDUE'], ['cancelled', 'CANCELLED']]
const today = () => new Date().toISOString().slice(0, 10)

function TxnForm({ initial, wonDeals, clients, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    kind: initial?.kind || 'income',
    title: initial?.title || '',
    category: initial?.category || '',
    amount: initial?.amount ?? '',
    occurred_on: initial?.occurred_on || today(),
    notes: initial?.notes || '',
    lead: initial?.lead || '',
    autoInvoice: false,
    invoiceClient: initial?.invoice ? '' : '',
    invoiceDue: '',
  }))
  const [source, setSource] = useState(initial?.lead ? 'deal' : 'manual')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const cats = form.kind === 'income' ? INCOME_CATS : EXPENSE_CATS

  const pickDeal = (e) => {
    const id = e.target.value
    const deal = (wonDeals || []).find((d) => String(d.id) === String(id))
    if (!deal) {
      setForm((f) => ({ ...f, lead: '' }))
      return
    }
    // Deal wins: title + amount overwritten from the won lead.
    setForm((f) => ({
      ...f,
      lead: deal.id,
      title: deal.title,
      amount: deal.value_estimate ?? f.amount,
      invoiceClient: deal.client || f.invoiceClient,
    }))
  }

  const changeKind = (e) => {
    const kind = e.target.value
    setForm((f) => ({ ...f, kind, category: '', ...(kind !== 'income' ? { lead: '' } : {}) }))
    if (kind !== 'income') setSource('manual')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const payload = {
      kind: form.kind,
      title: form.title,
      category: form.category,
      amount: form.amount,
      occurred_on: form.occurred_on,
      notes: form.notes,
      lead: form.lead || null,
      auto_invoice: form.kind === 'income' && form.autoInvoice,
      invoice_client: form.invoiceClient || null,
      invoice_due_date: form.invoiceDue || null,
    }
    try {
      if (initial?.id) await apiPatch(`/api/transactions/${initial.id}/`, payload)
      else await apiPost('/api/transactions/', payload)
      onSaved()
      onClose()
    } catch (err) {
      setError(err.data?.amount?.[0] || err.data?.occurred_on?.[0] || err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Kind">
          <select value={form.kind} onChange={changeKind} className={inputCls}>
            {KIND_OPTS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </Field>
        <Field label="Amount (Rp) *">
          <input required type="number" min="0" value={form.amount} onChange={set('amount')} className={inputCls} />
        </Field>
      </div>
      {form.kind === 'income' && (
        <div className="border border-[#2a2a2a] bg-[#0e0e0e] p-3 flex flex-col gap-3">
          <div className="flex gap-2">
            {['manual', 'deal'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSource(s)}
                className={`flex-1 py-2 border font-mono text-[11px] tracking-wider uppercase transition-colors ${
                  source === s
                    ? 'border-[#c0f500] text-[#c0f500] bg-[#c0f500]/10 font-bold'
                    : 'border-[#353534] text-[#a8b09a] hover:text-[#e5e2e1]'
                }`}
              >
                {s === 'manual' ? 'MANUAL' : 'WON DEAL'}
              </button>
            ))}
          </div>
          {source === 'deal' && (
            <Field label="Select won deal *">
              <select value={form.lead} onChange={pickDeal} className={inputCls} required={source === 'deal'}>
                <option value="">— pick a won deal —</option>
                {(wonDeals || []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} — {fmtIDR(d.value_estimate)}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>
      )}
      <Field label="Title / Name *">
        <input
          required
          value={form.title}
          onChange={set('title')}
          className={inputCls}
          placeholder={source === 'deal' ? 'Auto-filled from deal' : 'e.g. DP Website Apex'}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Category *">
          <select value={form.category} onChange={set('category')} className={inputCls} required>
            <option value="">— select —</option>
            {cats.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Date *">
          <input required type="date" value={form.occurred_on} onChange={set('occurred_on')} className={inputCls} />
        </Field>
      </div>
      <Field label="Notes">
        <textarea rows={2} value={form.notes} onChange={set('notes')} className={`${inputCls} resize-none`} />
      </Field>
      {form.kind === 'income' && !initial?.id && (
        <div className="border border-[#2a2a2a] bg-[#0e0e0e] p-3 flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.autoInvoice}
              onChange={(e) => setForm((f) => ({ ...f, autoInvoice: e.target.checked }))}
              className="w-4 h-4 accent-[#c0f500]"
            />
            <span className="font-mono text-[12px] tracking-wider text-[#e5e2e1] font-bold">
              AUTO INVOICE{' '}
              <span className="text-[#a8b09a] font-normal">— creates draft INV-YYYY/MM/DD-{'{id}'}</span>
            </span>
          </label>
          {form.autoInvoice && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Invoice client *">
                <select
                  value={form.invoiceClient}
                  onChange={set('invoiceClient')}
                  className={inputCls}
                  required={form.autoInvoice}
                >
                  <option value="">— select —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Invoice due date">
                <input type="date" value={form.invoiceDue} onChange={set('invoiceDue')} className={inputCls} />
              </Field>
            </div>
          )}
        </div>
      )}
      {error && <ErrorBox message={error} />}
      <Btn type="submit" disabled={busy}>
        {busy ? 'SAVING...' : initial?.id ? 'SAVE CHANGES' : '+ ADD TRANSACTION'}
      </Btn>
    </form>
  )
}

function InvoiceForm({ initial, clients, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    number: initial?.number || '',
    client: initial?.client || '',
    amount: initial?.amount ?? '',
    status: initial?.status || 'draft',
    due_date: initial?.due_date || '',
    notes: initial?.notes || '',
  }))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const payload = { ...form, client: form.client || null, due_date: form.due_date || null }
    try {
      if (initial?.id) await apiPatch(`/api/invoices/${initial.id}/`, payload)
      else await apiPost('/api/invoices/', payload)
      onSaved()
      onClose()
    } catch (err) {
      setError(err.data?.number?.[0] || err.data?.client?.[0] || err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Number *">
          <input required value={form.number} onChange={set('number')} className={inputCls} placeholder="INV-2026-002" />
        </Field>
        <Field label="Client *">
          <select value={form.client} onChange={set('client')} className={inputCls}>
            <option value="">— select client —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Amount (Rp) *">
          <input required type="number" min="0" value={form.amount} onChange={set('amount')} className={inputCls} />
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={set('status')} className={inputCls}>
            {INV_STATUS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </Field>
        <Field label="Due date">
          <input type="date" value={form.due_date} onChange={set('due_date')} className={inputCls} />
        </Field>
      </div>
      <Field label="Notes">
        <textarea rows={2} value={form.notes} onChange={set('notes')} className={`${inputCls} resize-none`} />
      </Field>
      {error && <ErrorBox message={error} />}
      <Btn type="submit" disabled={busy}>
        {busy ? 'SAVING...' : initial?.id ? 'SAVE CHANGES' : '+ ADD INVOICE'}
      </Btn>
    </form>
  )
}

export default function Finance() {
  const [summary, setSummary] = useState(null)
  const [txns, setTxns] = useState([])
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [wonDeals, setWonDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [kindF, setKindF] = useState('')
  const [txnModal, setTxnModal] = useState(null)
  const [invModal, setInvModal] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null) // {entity, row}

  const load = useCallback(async () => {
    setError('')
    try {
      const [s, t, i, c, w] = await Promise.all([
        apiGet('/api/finance/summary/'),
        apiGet('/api/transactions/', { page_size: 100, ordering: '-occurred_on', kind: kindF || undefined }),
        apiGet('/api/invoices/', { page_size: 100, ordering: '-created_at' }),
        apiGet('/api/clients/', { page_size: 200, ordering: 'name' }),
        apiGet('/api/leads/', { status: 'won', page_size: 200, ordering: '-updated_at' }),
      ])
      setSummary(s)
      setTxns(t.results || [])
      setInvoices(i.results || [])
      setClients(c.results || [])
      setWonDeals(w.results || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [kindF])

  useEffect(() => {
    load()
  }, [load])

  const txnQ = useDeleteQueue('transactions', load)
  const invQ = useDeleteQueue('invoices', load)

  const queueDel = () => {
    if (!confirmDel) return
    const { entity, row } = confirmDel
    const label = entity === 'transactions' ? `${row.kind} ${fmtIDR(row.amount)} (${row.category})` : `${row.number} — ${fmtIDR(row.amount)}`
    if (entity === 'transactions') txnQ.queueOne({ id: row.id, label })
    else invQ.queueOne({ id: row.id, label })
    setConfirmDel(null)
  }

  const visTxns = txns.filter((t) => !txnQ.hideIds.has(t.id))
  const visInv = invoices.filter((v) => !invQ.hideIds.has(v.id))

  return (
    <div className="flex flex-col gap-8">
      <PageHead
        code="// OPS // FINANCE"
        title="Finance"
        desc="Money in, money out, and invoices. Overview numbers are computed here — not from leads."
      />

      <ErrorBox message={error} onRetry={load} />

      {loading ? (
        <div className="py-24 flex justify-center"><SpinnerCircle size={52} label="LOADING FINANCE" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ['INCOME', summary?.income, 'text-[#c0f500]'],
              ['EXPENSE', summary?.expense, 'text-[#ffb4ab]'],
              ['PROFIT', summary?.profit, 'text-[#e5e2e1]'],
              ['OUTSTANDING', summary?.outstanding, 'text-[#ffd791]'],
            ].map(([l, v, c]) => (
              <div key={l} className="border border-[#2a2a2a] bg-[#1c1b1b] p-4 flex flex-col gap-1">
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#a8b09a]">{l}</span>
                <span className={`font-jersey text-4xl leading-none ${c}`}>{fmtIDR(v)}</span>
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-jersey text-3xl uppercase">Transactions</h2>
              <div className="flex gap-2">
                <select value={kindF} onChange={(e) => setKindF(e.target.value)} className={`${inputCls} !w-auto`}>
                  <option value="">ALL KINDS</option>
                  <option value="income">INCOME</option>
                  <option value="expense">EXPENSE</option>
                </select>
                <Btn onClick={() => setTxnModal({ mode: 'add' })}>+ Transaction</Btn>
              </div>
            </div>
            <PendingBar count={txnQ.queued.length} syncing={txnQ.syncing} onSync={txnQ.syncNow} onUndo={txnQ.undoQueued} />
            <FailedBox failed={txnQ.failed} onRetry={txnQ.syncNow} onDismiss={txnQ.dismissFailed} />
            {visTxns.length === 0 ? (
              <Empty title="No transactions yet" hint="Record income/expense to bring the overview to life." />
            ) : (
              <div className="border border-[#2a2a2a] bg-[#1c1b1b] overflow-x-auto sp-scroll" data-lenis-prevent>
                <table className="sp-table w-full min-w-[760px]">
                  <thead>
                    <tr><th>Title</th><th>Kind</th><th>Category</th><th className="!text-right">Amount</th><th>Date</th><th></th></tr>
                  </thead>
                  <tbody>
                    {visTxns.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div className="font-bold text-[#e5e2e1]">{t.title || t.category}</div>
                          {t.lead_title && <div className="font-mono text-[11px] text-[#c0f500]">◈ {t.lead_title}</div>}
                          {t.invoice_number && <div className="font-mono text-[11px] text-[#a8c7fa]">▣ {t.invoice_number}</div>}
                        </td>
                        <td><Badge color={t.kind === 'income' ? 'lime' : 'red'}>{t.kind_display || t.kind}</Badge></td>
                        <td><span className="font-mono text-[12px] text-[#a8b09a]">{t.category}</span></td>
                        <td className="!text-right font-mono text-[12px]">{t.kind === 'income' ? '+' : '−'}{fmtIDR(t.amount)}</td>
                        <td><span className="font-mono text-[12px] text-[#a8b09a]">{fmtDate(t.occurred_on)}</span></td>
                        <td>
                          <span className="flex gap-2 justify-end">
                            <button onClick={() => setTxnModal({ mode: 'edit', row: t })} className="font-mono text-[11px] text-[#c0f500] hover:underline">EDIT</button>
                            <button onClick={() => setConfirmDel({ entity: 'transactions', row: t })} className="font-mono text-[11px] text-[#ffb4ab] hover:underline">DELETE</button>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-jersey text-3xl uppercase">Invoices</h2>
              <Btn onClick={() => setInvModal({ mode: 'add' })}>+ Invoice</Btn>
            </div>
            <PendingBar count={invQ.queued.length} syncing={invQ.syncing} onSync={invQ.syncNow} onUndo={invQ.undoQueued} />
            <FailedBox failed={invQ.failed} onRetry={invQ.syncNow} onDismiss={invQ.dismissFailed} />
            {visInv.length === 0 ? (
              <Empty title="No invoices yet" hint="Sent/overdue invoices count as outstanding." />
            ) : (
              <div className="border border-[#2a2a2a] bg-[#1c1b1b] overflow-x-auto sp-scroll" data-lenis-prevent>
                <table className="sp-table w-full min-w-[680px]">
                  <thead>
                    <tr><th>Number</th><th>Client</th><th className="!text-right">Amount</th><th>Status</th><th>Due</th><th></th></tr>
                  </thead>
                  <tbody>
                    {visInv.map((v) => (
                      <tr key={v.id}>
                        <td className="font-mono text-[12px] font-bold">{v.number}</td>
                        <td>{v.client_name || '—'}</td>
                        <td className="!text-right font-mono text-[12px]">{fmtIDR(v.amount)}</td>
                        <td><Badge color={v.status === 'paid' ? 'lime' : v.status === 'overdue' ? 'red' : v.status === 'sent' ? 'blue' : 'gray'}>{v.status_display || v.status}</Badge></td>
                        <td><span className="font-mono text-[12px] text-[#a8b09a]">{fmtDate(v.due_date)}</span></td>
                        <td>
                          <span className="flex gap-2 justify-end">
                            <button onClick={() => setInvModal({ mode: 'edit', row: v })} className="font-mono text-[11px] text-[#c0f500] hover:underline">EDIT</button>
                            <button onClick={() => setConfirmDel({ entity: 'invoices', row: v })} className="font-mono text-[11px] text-[#ffb4ab] hover:underline">DELETE</button>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <Modal open={!!txnModal} onClose={() => setTxnModal(null)} title={txnModal?.mode === 'edit' ? `EDIT TRANSACTION #${txnModal?.row?.id}` : 'ADD TRANSACTION'}>
        {txnModal && <TxnForm initial={txnModal.mode === 'edit' ? txnModal.row : null} wonDeals={wonDeals} clients={clients} onClose={() => setTxnModal(null)} onSaved={load} />}
      </Modal>

      <Modal open={!!invModal} onClose={() => setInvModal(null)} title={invModal?.mode === 'edit' ? `EDIT INVOICE #${invModal?.row?.id}` : 'ADD INVOICE'}>
        {invModal && <InvoiceForm initial={invModal.mode === 'edit' ? invModal.row : null} clients={clients} onClose={() => setInvModal(null)} onSaved={load} />}
      </Modal>

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title={`DELETE ${confirmDel?.entity === 'invoices' ? 'INVOICE' : 'TRANSACTION'}?`}>
        {confirmDel && (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] text-[#a8b09a]">
              Permanently delete. Queued first — sent on sync or page leave.
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="secondary" onClick={() => setConfirmDel(null)}>CANCEL</Btn>
              <Btn variant="primary" onClick={queueDel} className="!bg-[#ffb4ab] !border-[#ffb4ab] !text-[#161f00]">YES, DELETE</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
