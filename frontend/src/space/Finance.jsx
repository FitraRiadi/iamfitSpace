import { useCallback, useEffect, useState } from 'react'
import { VscEye } from 'react-icons/vsc'
import { apiGet, apiPost, apiPatch } from '../lib/api'
import { useDeleteQueue } from '../lib/deleteQueue'
import { useTasks } from '../lib/tasks'
import brandLogo from '../assets/iamfit-brand.png'
import { PageHead, Btn, Modal, Field, TInput, TTextarea, TSelect, TSelectItem, TSlider, Empty, ErrorBox, SpinnerCircle, Badge, PendingBar, FailedBox, fmtIDR, fmtDate } from './ui'

const KIND_OPTS = [['income', 'INCOME'], ['expense', 'EXPENSE']]
const INCOME_CATS = ['Website Development', 'Maintenance', 'Consultation', 'Other Services']
const EXPENSE_CATS = ['Hosting', 'Domain', 'Software', 'Asset', 'Operational']

const INV_STATUS = [['draft', 'DRAFT'], ['sent', 'SENT'], ['paid', 'PAID'], ['overdue', 'OVERDUE'], ['cancelled', 'CANCELLED']]
const DEAL_STATUS_COLOR = { new: 'gray', contacted: 'blue', discussion: 'blue', proposal_sent: 'amber', negotiation: 'amber', won: 'lime', lost: 'red' }
const today = () => new Date().toISOString().slice(0, 10)

function TxnForm({ initial, wonDeals, clients, onClose, onSaved }) {
  const { track } = useTasks()
  const [form, setForm] = useState(() => ({
    kind: initial?.kind || 'income',
    title: initial?.title || '',
    category: initial?.category || '',
    amount: initial?.amount ?? '',
    occurred_on: initial?.occurred_on || today(),
    notes: initial?.notes || '',
    lead: initial?.lead || '',
    invoice: initial?.invoice || '',
    autoInvoice: false,
    invoiceClient: initial?.invoice ? '' : '',
    invoiceDue: '',
  }))
  const [dealIds, setDealIds] = useState(() => (initial?.lead ? [initial.lead] : []))
  const [source, setSource] = useState(initial?.lead ? 'deal' : 'manual')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const cats = form.kind === 'income' ? INCOME_CATS : EXPENSE_CATS

  const toggleDeal = (deal) => {
    setDealIds((prev) => {
      const has = prev.map(String).includes(String(deal.id))
      const next = has ? prev.filter((x) => String(x) !== String(deal.id)) : [...prev, deal.id]
      const picked = (wonDeals || []).filter((d) => next.map(String).includes(String(d.id)))
      const total = picked.reduce((a, d) => a + Number(d.value_estimate || 0), 0)
      setForm((f) => ({
        ...f,
        lead: next[0] || '',
        title: picked.map((d) => d.title).join(' + '),
        amount: picked.length ? total : f.amount,
        invoiceClient: picked[0]?.client || f.invoiceClient,
      }))
      return next
    })
  }

  const changeKind = (kind) => {
    setForm((f) => ({ ...f, kind, category: '', ...(kind !== 'income' ? { lead: '' } : {}) }))
    if (kind !== 'income') setSource('manual')
  }

  const submit = async (e) => {
    e.preventDefault()
    const payload = {
      kind: form.kind,
      title: form.title,
      category: form.category,
      amount: form.amount,
      occurred_on: form.occurred_on,
      notes: form.notes,
      lead: form.lead || null,
      invoice: form.invoice || null,
      auto_invoice: form.kind === 'income' && form.autoInvoice,
      invoice_client: form.invoiceClient || null,
      invoice_due_date: form.invoiceDue || null,
    }
    onClose()
    try {
      if (initial?.id) await track(apiPatch(`/api/transactions/${initial.id}/`, payload), `UPDATE TRANSACTION — ${form.title || form.category}`)
      else await track(apiPost('/api/transactions/', payload), `CREATE TRANSACTION — ${form.title || form.category}`)
      onSaved()
    } catch {
      // failed task stays visible in the stack for retry/dismiss
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Kind">
          <TSelect value={form.kind} onValueChange={changeKind} placeholder="Select kind">
            {KIND_OPTS.map(([v, l]) => (
              <TSelectItem key={v} value={v}>{l}</TSelectItem>
            ))}
          </TSelect>
        </Field>
        <Field label="Amount (Rp) *">
          <TInput required type="number" min="0" value={form.amount} onChange={set('amount')} />
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
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] tracking-[0.1em] text-[#a8b09a] uppercase">
                Select won deals (title + amount auto-filled, summed)
              </span>
              {(wonDeals || []).length === 0 ? (
                <span className="font-mono text-[12px] text-[#a8b09a]">No won deals yet.</span>
              ) : (
                <ul className="flex flex-col gap-1.5 max-h-44 overflow-y-auto sp-scroll" data-lenis-prevent>
                  {(wonDeals || []).map((d) => {
                    const on = dealIds.map(String).includes(String(d.id))
                    return (
                      <li key={d.id}>
                        <label className={`flex items-center gap-3 px-3 py-2 border cursor-pointer transition-colors ${on ? 'border-[#c0f500] bg-[#c0f500]/10' : 'border-[#2a2a2a] hover:border-[#a8b09a]'}`}>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggleDeal(d)}
                            className="w-4 h-4 accent-[#c0f500]"
                          />
                          <span className="flex-1 min-w-0">
                            <span className="block text-[13px] font-bold truncate">{d.title}</span>
                            <span className="block font-mono text-[11px] text-[#a8b09a]">{fmtIDR(d.value_estimate)}</span>
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
      <Field label="Title / Name *">
        <TInput
          required
          value={form.title}
          onChange={set('title')}
          placeholder={source === 'deal' ? 'Auto-filled from deal' : 'e.g. DP Website Apex'}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Category *">
          <TSelect
            value={form.category}
            onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
            placeholder="— select —"
          >
            <TSelectItem value="">— select —</TSelectItem>
            {cats.map((c) => (
              <TSelectItem key={c} value={c}>{c}</TSelectItem>
            ))}
          </TSelect>
        </Field>
        <Field label="Date *">
          <TInput required type="date" value={form.occurred_on} onChange={set('occurred_on')} />
        </Field>
      </div>
      <Field label="Notes">
        <TTextarea rows={2} value={form.notes} onChange={set('notes')} />
      </Field>
      {form.kind === 'income' && !initial?.id && !initial?.invoice && (
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
              <span className="text-[#a8b09a] font-normal">— creates PAID INV-YYYY/MM/DD-{'{id}'}</span>
            </span>
          </label>
          {form.autoInvoice && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Invoice client *">
                <TSelect
                  value={String(form.invoiceClient ?? '')}
                  onValueChange={(v) => setForm((f) => ({ ...f, invoiceClient: v === '' ? '' : Number(v) }))}
                  placeholder="— select —"
                >
                  <TSelectItem value="">— select —</TSelectItem>
                  {clients.map((c) => (
                    <TSelectItem key={c.id} value={String(c.id)}>{c.name}</TSelectItem>
                  ))}
                </TSelect>
              </Field>
              <Field label="Invoice due date">
                <TInput type="date" value={form.invoiceDue} onChange={set('invoiceDue')} />
              </Field>
            </div>
          )}
        </div>
      )}
      <Btn type="submit">
        {initial?.id ? 'SAVE CHANGES' : '+ ADD TRANSACTION'}
      </Btn>
    </form>
  )
}

function InvoiceForm({ initial, clients, wonDeals, allDeals, invoices, onClose, onSaved }) {
  const { track } = useTasks()
  const [form, setForm] = useState(() => ({
    number: initial?.number || '',
    client: initial?.client || '',
    amount: initial?.amount ?? '',
    status: initial?.status || 'draft',
    due_date: initial?.due_date || '',
    notes: initial?.notes || '',
  }))
  const [deals, setDeals] = useState(() => initial?.leads || [])
  const [discount, setDiscount] = useState(() => initial?.discount_percent ?? 0)
  const [items, setItems] = useState(() => (initial?.items || []).map((it) => ({ description: it.description || '', amount: it.amount ?? '' })))
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // Deals of this client, ANY status (won not required — DP/other flows too).
  const clientDeals = (allDeals || []).filter((d) => form.client && String(d.client) === String(form.client))
  const billedByDeal = {}
  for (const v of invoices || []) {
    if (initial?.id && v.id === initial.id) continue
    for (const lid of v.leads || []) {
      billedByDeal[lid] = billedByDeal[lid] || []
      billedByDeal[lid].push(v.number)
    }
  }

  const toggleDeal = (deal) => {
    setDeals((prev) => {
      const has = prev.map(String).includes(String(deal.id))
      return has ? prev.filter((x) => String(x) !== String(deal.id)) : [...prev, deal.id]
    })
  }

  const subtotal = (allDeals || [])
    .filter((d) => deals.map(String).includes(String(d.id)))
    .reduce((a, d) => a + Number(d.value_estimate || 0), 0)
  const itemsTotal = items.reduce((a, it) => a + (Number(it.amount) || 0), 0)
  // Hybrid: anything checked/typed -> auto (locked). Nothing at all -> manual.
  const auto = deals.length > 0 || items.some((it) => (it.description || '').trim() || Number(it.amount) > 0)
  const finalAmount = auto
    ? Math.round((subtotal + itemsTotal) * (1 - (Number(discount) || 0) / 100))
    : Math.round(Number(form.amount) || 0)

  const changeClient = (v) => {
    setForm((f) => ({ ...f, client: v === '' ? '' : Number(v) }))
    setDeals([])
  }

  const addItem = () => setItems((p) => [...p, { description: '', amount: '' }])
  const setItem = (i, k, v) => setItems((p) => p.map((it, x) => (x === i ? { ...it, [k]: v } : it)))
  const delItem = (i) => setItems((p) => p.filter((_, x) => x !== i))

  const submit = async (e) => {
    e.preventDefault()
    const itemsPayload = items
      .filter((it) => (it.description || '').trim() && Number(it.amount) > 0)
      .map((it, i) => ({ description: it.description.trim(), amount: it.amount, position: i }))
    const payload = {
      number: form.number || '',
      client: form.client || null,
      amount: finalAmount,
      discount_percent: auto ? Number(discount) || 0 : 0,
      status: form.status,
      due_date: form.due_date || null,
      notes: form.notes,
      leads: deals,
      items: itemsPayload,
    }
    onClose()
    try {
      if (initial?.id) await track(apiPatch(`/api/invoices/${initial.id}/`, payload), `UPDATE INVOICE — ${initial.number || ''}`)
      else await track(apiPost('/api/invoices/', payload), `CREATE INVOICE — ${fmtIDR(form.amount)}`)
      onSaved()
    } catch {
      // failed task stays visible in the stack for retry/dismiss
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Client *">
        <TSelect value={String(form.client ?? '')} onValueChange={changeClient} placeholder="— select client —">
          <TSelectItem value="">— select client —</TSelectItem>
          {clients.map((c) => (
            <TSelectItem key={c.id} value={String(c.id)}>{c.name}</TSelectItem>
          ))}
        </TSelect>
      </Field>
      {form.client ? (
        <div className="border border-[#2a2a2a] bg-[#0e0e0e] p-3 flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-[0.15em] text-[#a8b09a] uppercase">
            1 · Deals — check to bundle (any status)
          </span>
          {clientDeals.length === 0 ? (
            <span className="font-mono text-[12px] text-[#a8b09a]">No deals for this client yet.</span>
          ) : (
            <ul className="flex flex-col gap-1.5 max-h-44 overflow-y-auto sp-scroll" data-lenis-prevent>
              {clientDeals.map((d) => {
                const on = deals.map(String).includes(String(d.id))
                const billed = billedByDeal[d.id] || []
                return (
                  <li key={d.id}>
                    <label className={`flex items-center gap-3 px-3 py-2 border cursor-pointer transition-colors ${on ? 'border-[#c0f500] bg-[#c0f500]/10' : 'border-[#2a2a2a] hover:border-[#a8b09a]'}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleDeal(d)}
                        className="w-4 h-4 accent-[#c0f500]"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="block text-[13px] font-bold truncate">{d.title}</span>
                          <Badge color={DEAL_STATUS_COLOR[d.status] || 'gray'}>{d.status_display || d.status}</Badge>
                        </span>
                        <span className="block font-mono text-[11px] text-[#a8b09a]">
                          {fmtIDR(d.value_estimate)}
                          {billed.length > 0 && <span className="text-[#ffd791]"> · BILLED ({billed.join(', ')})</span>}
                        </span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : null}
      <div className="border border-[#2a2a2a] bg-[#0e0e0e] p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-[0.15em] text-[#a8b09a] uppercase">
            2 · Additional items
          </span>
          <button
            type="button"
            onClick={addItem}
            className="font-mono text-[11px] text-[#c0f500] hover:underline font-bold"
          >
            + ADD ITEM
          </button>
        </div>
        {items.length === 0 ? (
          <span className="font-mono text-[12px] text-[#a8b09a]">No extra items — deals total stands alone.</span>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((it, i) => (
              <li key={i} className="flex gap-2">
                <TInput
                  value={it.description}
                  onChange={(e) => setItem(i, 'description', e.target.value)}
                  placeholder="Service name"
                  className="flex-1 min-w-0"
                />
                <TInput
                  type="number"
                  min="0"
                  value={it.amount}
                  onChange={(e) => setItem(i, 'amount', e.target.value)}
                  placeholder="Price"
                  className="w-32 shrink-0"
                />
                <button
                  type="button"
                  onClick={() => delItem(i)}
                  aria-label="Remove item"
                  className="px-2.5 border border-[#353534] text-[#ffb4ab] hover:border-[#ffb4ab] transition-colors shrink-0"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.15em] text-[#a8b09a] uppercase">
          3 · Discount & total
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={`Discount — ${Number(discount) || 0}%`}>
            <TSlider
              min={0}
              max={100}
              step={1}
              value={[Number(discount) || 0]}
              onValueChange={([n]) => setDiscount(n)}
              disabled={!auto}
            />
          </Field>
          <Field label={auto ? 'Amount (Rp) — auto' : 'Amount (Rp) — type manually (no lines linked)'}>
            {auto ? (
              <TInput value={fmtIDR(finalAmount)} disabled />
            ) : (
              <TInput
                required
                type="number"
                min="1"
                value={form.amount}
                onChange={set('amount')}
                placeholder="e.g. DP 50% project X"
              />
            )}
          </Field>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Status">
          <TSelect value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))} placeholder="Select status">
            {INV_STATUS.map(([v, l]) => (
              <TSelectItem key={v} value={v}>{l}</TSelectItem>
            ))}
          </TSelect>
        </Field>
        <Field label="Due date">
          <TInput type="date" value={form.due_date} onChange={set('due_date')} />
        </Field>
      </div>
      <Field label="Notes">
        <TTextarea rows={2} value={form.notes} onChange={set('notes')} />
      </Field>
      <Btn type="submit">
        {initial?.id ? 'SAVE CHANGES' : '+ ADD INVOICE'}
      </Btn>
    </form>
  )
}

export default function Finance() {
  const { track } = useTasks()
  const [summary, setSummary] = useState(null)
  const [txns, setTxns] = useState([])
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [wonDeals, setWonDeals] = useState([])
  const [allDeals, setAllDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [kindF, setKindF] = useState('')
  const [txnModal, setTxnModal] = useState(null)
  const [invModal, setInvModal] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null) // {entity, row}
  const [receipt, setReceipt] = useState(null)
  const [payInv, setPayInv] = useState(null)
  const [payReceipt, setPayReceipt] = useState(null)

  const load = useCallback(async () => {
    setError('')
    try {
      const [s, t, i, c, w, a] = await Promise.all([
        apiGet('/api/finance/summary/'),
        apiGet('/api/transactions/', { page_size: 100, ordering: '-occurred_on', kind: kindF || undefined }),
        apiGet('/api/invoices/', { page_size: 100, ordering: '-created_at' }),
        apiGet('/api/clients/', { page_size: 200, ordering: 'name' }),
        apiGet('/api/leads/', { status: 'won', page_size: 200, ordering: '-updated_at' }),
        apiGet('/api/leads/', { page_size: 200, ordering: '-updated_at' }),
      ])
      setSummary(s)
      setTxns(t.results || [])
      setInvoices(i.results || [])
      setClients(c.results || [])
      setWonDeals(w.results || [])
      setAllDeals(a.results || [])
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
                <TSelect value={kindF} onValueChange={(v) => setKindF(v)} placeholder="ALL KINDS" className="w-auto">
                  <TSelectItem value="">ALL KINDS</TSelectItem>
                  <TSelectItem value="income">INCOME</TSelectItem>
                  <TSelectItem value="expense">EXPENSE</TSelectItem>
                </TSelect>
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
                            {t.kind === 'income' && (
                              <button onClick={() => setPayReceipt(t)} title="View payment receipt" aria-label="View payment receipt" className="font-mono text-[11px] text-[#a8c7fa] hover:underline inline-flex items-center gap-1"><VscEye size={14} /> RECEIPT</button>
                            )}
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
                            <button onClick={() => setPayInv(v)} className="font-mono text-[11px] text-[#c0f500] hover:underline font-bold">PAY</button>
                            <button onClick={() => setReceipt(v)} title="View receipt" aria-label="View receipt" className="font-mono text-[11px] text-[#a8c7fa] hover:underline inline-flex items-center gap-1"><VscEye size={14} /> VIEW</button>
                            <button onClick={() => setInvModal({ mode: 'edit', row: v })} className="font-mono text-[11px] text-[#a8b09a] hover:underline">EDIT</button>
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
        {invModal && <InvoiceForm initial={invModal.mode === 'edit' ? invModal.row : null} clients={clients} wonDeals={wonDeals} allDeals={allDeals} invoices={invoices} onClose={() => setInvModal(null)} onSaved={load} />}
      </Modal>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title={`RECEIPT // ${receipt?.number || ''}`}>
        {receipt && (
          <div className="bg-[#f5f5f0] text-[#161f00] border-2 border-[#161f00]">
            <div className="flex items-start justify-between gap-4 p-5 border-b-2 border-[#161f00]">
              <img src={brandLogo} alt="IamFit" className="h-10 w-auto brightness-0" />
              <div className="text-right">
                <div className="font-jersey text-4xl uppercase leading-none">Invoice</div>
                <div className="font-mono text-[12px] font-bold mt-1">{receipt.number}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 border-b border-[#161f00]/20 font-mono text-[12px]">
              <div>
                <div className="text-[10px] tracking-[0.15em] opacity-60">BILLED TO</div>
                <div className="font-bold">{receipt.client_name || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.15em] opacity-60">ISSUED</div>
                <div className="font-bold">{fmtDate(receipt.created_at)}</div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.15em] opacity-60">DUE</div>
                <div className="font-bold">{fmtDate(receipt.due_date)}</div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between font-mono text-[12px] border-b border-[#161f00]/20 pb-2">
                <span className="tracking-[0.15em] text-[10px] opacity-60">DESCRIPTION</span>
                <span className="tracking-[0.15em] text-[10px] opacity-60">AMOUNT</span>
              </div>
              {(receipt.deal_lines && receipt.deal_lines.length > 0) || (receipt.items && receipt.items.length > 0) ? (
                <>
                  {[
                    ...(receipt.deal_lines || []).map((d) => ({ desc: d.title, amt: d.value })),
                    ...(receipt.items || []).map((it) => ({ desc: it.description, amt: it.amount })),
                  ].map((line, i) => (
                    <div key={i} className="flex justify-between gap-4 py-2 border-b border-[#161f00]/10">
                      <span className="text-[13px] font-bold">{line.desc}</span>
                      <span className="font-mono text-[13px] font-bold whitespace-nowrap">{fmtIDR(line.amt)}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex justify-between gap-4 py-2 border-b border-[#161f00]/10">
                  <span className="text-[13px] font-bold">{receipt.notes || 'Services rendered'}</span>
                  <span className="font-mono text-[13px] font-bold whitespace-nowrap">{fmtIDR(receipt.amount)}</span>
                </div>
              )}
              {Number(receipt.discount_percent) > 0 && ((receipt.deal_lines || []).length > 0 || (receipt.items || []).length > 0) && (
                <div className="flex justify-between gap-4 py-2 border-b border-[#161f00]/10 font-mono text-[13px] font-bold">
                  <span>DISCOUNT ({receipt.discount_percent}%)</span>
                  <span className="whitespace-nowrap">−{fmtIDR(
                    ((receipt.deal_lines || []).reduce((a, d) => a + Number(d.value || 0), 0) +
                      (receipt.items || []).reduce((a, it) => a + Number(it.amount || 0), 0) || Number(receipt.amount)) - Number(receipt.amount)
                  )}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3">
                <span className={`inline-block border-2 px-3 py-1 font-mono text-[12px] font-bold uppercase tracking-widest -rotate-2 ${
                  receipt.status === 'paid'
                    ? 'border-[#3b7a00] text-[#3b7a00]'
                    : receipt.status === 'overdue'
                      ? 'border-[#b3261e] text-[#b3261e]'
                      : 'border-[#161f00] text-[#161f00]'
                }`}>
                  {receipt.status_display || receipt.status}
                </span>
                <div className="text-right">
                  <div className="font-mono text-[10px] tracking-[0.15em] opacity-60">TOTAL DUE</div>
                  <div className="font-jersey text-4xl leading-none">{fmtIDR(receipt.amount)}</div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-[#161f00] text-[#f5f5f0] font-mono text-[11px] flex items-center justify-between">
              <span>Generated by IamFit Space</span>
              <span className="text-[#c0f500]">● {receipt.status_display || receipt.status}</span>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!payInv} onClose={() => setPayInv(null)} title={`RECORD PAYMENT // ${payInv?.number || ''}`}>
        {payInv && (
          <TxnForm
            initial={{
              kind: 'income',
              title: `Payment ${payInv.number}`,
              category: 'Website Development',
              amount: payInv.amount,
              occurred_on: today(),
              invoice: payInv.id,
            }}
            wonDeals={[]}
            clients={clients}
            onClose={() => setPayInv(null)}
            onSaved={async () => {
              try {
                await track(apiPatch(`/api/invoices/${payInv.id}/`, { status: 'paid' }), `MARK PAID — ${payInv.number}`)
              } catch {
                // invoice update is best-effort; income is already saved
              }
              setPayInv(null)
              load()
            }}
          />
        )}
      </Modal>

      <Modal open={!!payReceipt} onClose={() => setPayReceipt(null)} title={`PAYMENT RECEIPT // TXN-${payReceipt?.id || ''}`}>
        {payReceipt && (
          <div className="bg-[#f5f5f0] text-[#161f00] border-2 border-[#161f00]">
            <div className="flex items-start justify-between gap-4 p-5 border-b-2 border-[#161f00]">
              <img src={brandLogo} alt="IamFit" className="h-10 w-auto brightness-0" />
              <div className="text-right">
                <div className="font-jersey text-4xl uppercase leading-none">Receipt</div>
                <div className="font-mono text-[12px] font-bold mt-1">TXN-{payReceipt.id}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5 border-b border-[#161f00]/20 font-mono text-[12px]">
              <div>
                <div className="text-[10px] tracking-[0.15em] opacity-60">RECEIVED</div>
                <div className="font-bold font-jersey text-3xl">{fmtIDR(payReceipt.amount)}</div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.15em] opacity-60">DATE</div>
                <div className="font-bold">{fmtDate(payReceipt.occurred_on)}</div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between font-mono text-[12px] border-b border-[#161f00]/20 pb-2">
                <span className="tracking-[0.15em] text-[10px] opacity-60">FOR</span>
                <span className="tracking-[0.15em] text-[10px] opacity-60">REF</span>
              </div>
              <div className="flex justify-between gap-4 py-3 border-b border-[#161f00]/20">
                <span className="text-[13px] font-bold">{payReceipt.title || payReceipt.category}</span>
                <span className="font-mono text-[13px] font-bold whitespace-nowrap">
                  {payReceipt.invoice_number || payReceipt.lead_title || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="inline-block border-2 px-3 py-1 font-mono text-[12px] font-bold uppercase tracking-widest -rotate-2 border-[#3b7a00] text-[#3b7a00]">
                  Settled
                </span>
                <div className="font-mono text-[10px] tracking-[0.15em] opacity-60 text-right">IAMFIT SPACE<br />THANK YOU</div>
              </div>
            </div>
            <div className="px-5 py-3 bg-[#161f00] text-[#f5f5f0] font-mono text-[11px] flex items-center justify-between">
              <span>Generated by IamFit Space</span>
              <span className="text-[#c0f500]">● payment received</span>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title={`DELETE ${confirmDel?.entity === 'invoices' ? 'INVOICE' : 'TRANSACTION'}?`}>
        {confirmDel && (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] text-[#a8b09a]">
              Permanently delete. Queued first — sent on sync or page leave.
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
