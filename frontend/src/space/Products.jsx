import { useCallback, useEffect, useState } from 'react'
import { apiGet, apiPost, apiPatch } from '../lib/api'
import { useDeleteQueue } from '../lib/deleteQueue'
import { useTasks } from '../lib/tasks'
import { PageHead, Btn, Modal, Field, TInput, TTextarea, TSelect, TSelectItem, Empty, ErrorBox, SpinnerCircle, Badge, PendingBar, FailedBox, fmtIDR } from './ui'

const STATUS_OPTS = [['draft', 'DRAFT'], ['published', 'PUBLISHED'], ['archived', 'ARCHIVED']]
const statusColor = { draft: 'gray', published: 'lime', archived: 'gray' }
const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)

function ProductForm({ initial, categories, onClose, onSaved }) {
  const { track } = useTasks()
  const [form, setForm] = useState(() => ({
    name: initial?.name || '',
    slug: initial?.slug || '',
    category: initial?.category || '',
    short_description: initial?.short_description || '',
    price: initial?.price ?? '',
    status: initial?.status || 'draft',
    demo_url: initial?.demo_url || '',
    version: initial?.version || '',
  }))
  const [slugTouched, setSlugTouched] = useState(!!initial)
  const set = (k) => (e) => {
    const v = e.target.value
    setForm((f) => {
      const next = { ...f, [k]: v }
      if (k === 'name' && !slugTouched) next.slug = slugify(v)
      return next
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    const payload = { ...form, category: form.category || null, price: form.price === '' ? 0 : form.price }
    onClose()
    try {
      if (initial?.id) await track(apiPatch(`/api/products/${initial.id}/`, payload), `UPDATE PRODUCT — ${form.name}`)
      else await track(apiPost('/api/products/', payload), `CREATE PRODUCT — ${form.name}`)
      onSaved()
    } catch {
      // failed task stays visible in the stack for retry/dismiss
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Product name *">
          <TInput required value={form.name} onChange={set('name')} />
        </Field>
        <Field label="Slug *">
          <TInput
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              set('slug')(e)
            }}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Category">
          <TSelect
            value={String(form.category ?? '')}
            onValueChange={(v) => setForm((f) => ({ ...f, category: v === '' ? '' : Number(v) }))}
            placeholder="— no category —"
          >
            <TSelectItem value="">— no category —</TSelectItem>
            {categories.map((c) => (
              <TSelectItem key={c.id} value={String(c.id)}>{c.name}</TSelectItem>
            ))}
          </TSelect>
        </Field>
        <Field label="Price (Rp)">
          <TInput type="number" min="0" value={form.price} onChange={set('price')} />
        </Field>
        <Field label="Status">
          <TSelect value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))} placeholder="Select status">
            {STATUS_OPTS.map(([v, l]) => (
              <TSelectItem key={v} value={v}>{l}</TSelectItem>
            ))}
          </TSelect>
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Demo URL">
          <TInput value={form.demo_url} onChange={set('demo_url')} placeholder="https://" />
        </Field>
        <Field label="Version">
          <TInput value={form.version} onChange={set('version')} placeholder="1.0.0" />
        </Field>
      </div>
      <Field label="Short description">
        <TTextarea rows={2} value={form.short_description} onChange={set('short_description')} />
      </Field>
      <Btn type="submit">
        {initial?.id ? 'SAVE CHANGES' : '+ ADD PRODUCT'}
      </Btn>
    </form>
  )
}

export default function Products() {
  const [rows, setRows] = useState([])
  const [categories, setCategories] = useState([])
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
        apiGet('/api/products/', { page_size: 100, ordering: '-updated_at', status: statusF || undefined }),
        apiGet('/api/product-categories/', { page_size: 100, ordering: 'name' }),
      ])
      setRows(p.results || [])
      setCategories(c.results || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [statusF])

  useEffect(() => {
    load()
  }, [load])

  const dq = useDeleteQueue('products', load)
  const { queued, failed, syncing } = dq
  const queueDel = () => {
    if (!confirmDel) return
    dq.queueOne({ id: confirmDel.id, label: confirmDel.name })
    setConfirmDel(null)
  }

  const visibleRows = rows.filter((r) => !dq.hideIds.has(r.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        code="// STORE // PRODUCTS"
        title="Products"
        desc="Digital products for IamFit Store. Publishing comes later — data first."
        actions={<Btn onClick={() => setModal({ mode: 'add' })}>+ Product</Btn>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <TSelect value={statusF} onValueChange={(v) => setStatusF(v)} placeholder="ALL STATUSES" className="w-auto">
          <TSelectItem value="">ALL STATUSES</TSelectItem>
          {STATUS_OPTS.map(([v, l]) => (
            <TSelectItem key={v} value={v}>{l}</TSelectItem>
          ))}
        </TSelect>
        <Badge color="gray">{visibleRows.length} PRODUCTS</Badge>
      </div>

      <ErrorBox message={error} onRetry={load} />
      <PendingBar count={queued.length} syncing={syncing} onSync={dq.syncNow} onUndo={dq.undoQueued} />
      <FailedBox failed={failed} onRetry={dq.syncNow} onDismiss={dq.dismissFailed} />

      {loading ? (
        <div className="py-24 flex justify-center"><SpinnerCircle size={52} label="LOADING PRODUCTS" /></div>
      ) : visibleRows.length === 0 ? (
        <Empty title="No products yet" hint="Hit + Product to add the first one." />
      ) : (
        <div className="border border-[#2a2a2a] bg-[#1c1b1b] overflow-x-auto sp-scroll" data-lenis-prevent>
          <table className="sp-table w-full min-w-[720px]">
            <thead>
              <tr><th>Product</th><th>Category</th><th className="!text-right">Price</th><th>Status</th><th>Version</th><th></th></tr>
            </thead>
            <tbody>
              {visibleRows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-bold text-[#e5e2e1]">{p.name}</div>
                    <div className="font-mono text-[11px] text-[#a8b09a]">{p.slug}</div>
                  </td>
                  <td><span className="font-mono text-[12px] text-[#a8b09a]">{p.category_name || '—'}</span></td>
                  <td className="!text-right font-mono text-[12px]">{fmtIDR(p.price)}</td>
                  <td><Badge color={statusColor[p.status] || 'gray'}>{p.status_display || p.status}</Badge></td>
                  <td><span className="font-mono text-[12px] text-[#a8b09a]">{p.version || '—'}</span></td>
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

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? `EDIT PRODUCT #${modal?.row?.id}` : 'ADD PRODUCT'} wide>
        {modal && (
          <ProductForm
            initial={modal.mode === 'edit' ? modal.row : null}
            categories={categories}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
      </Modal>

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="DELETE PRODUCT?">
        {confirmDel && (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] text-[#a8b09a]">
              Delete <span className="text-[#e5e2e1] font-bold">{confirmDel.name}</span>?
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
