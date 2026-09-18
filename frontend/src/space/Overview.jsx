import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, unwrapList } from '../lib/api'
import { PageHead, Spinner, ErrorBox, Badge, fmtIDR, fmtDate } from './ui'

function MoneyCard({ label, value, accent }) {
  return (
    <div className="border border-[#2a2a2a] bg-[#1c1b1b] p-4 flex flex-col gap-1">
      <span className="font-mono text-[10px] tracking-[0.15em] text-[#a8b09a] uppercase">{label}</span>
      <span className={`font-jersey text-4xl leading-none ${accent || 'text-[#e5e2e1]'}`}>{value}</span>
    </div>
  )
}

export default function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [fin, clients, leads, projects, products, recentLeads, recentProjects] = await Promise.all([
          apiGet('/api/finance/summary/'),
          apiGet('/api/clients/', { page_size: 1 }),
          apiGet('/api/leads/', { page_size: 1 }),
          apiGet('/api/projects/', { page_size: 1 }),
          apiGet('/api/products/', { page_size: 1 }),
          apiGet('/api/leads/', { page_size: 5, ordering: '-updated_at' }),
          apiGet('/api/projects/', { page_size: 5, ordering: '-updated_at' }),
        ])
        if (!alive) return
        setData({
          fin,
          counts: {
            clients: clients.count,
            leads: leads.count,
            projects: projects.count,
            products: products.count,
          },
          recentLeads: unwrapList(recentLeads).rows,
          recentProjects: unwrapList(recentProjects).rows,
        })
      } catch (e) {
        if (alive) setError(e.message)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  if (error) return <ErrorBox message={error} onRetry={() => window.location.reload()} />
  if (!data)
    return (
      <div className="py-16">
        <Spinner label="LOADING OVERVIEW..." />
      </div>
    )

  const { fin, counts } = data
  return (
    <div className="flex flex-col gap-8">
      <PageHead
        code="// SPACE DASHBOARD"
        title="Overview"
        desc="Ringkasan kondisi IamFit Space: uang, pipeline, dan project aktif."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyCard label="Income" value={fmtIDR(fin.income)} accent="text-[#c0f500]" />
        <MoneyCard label="Expense" value={fmtIDR(fin.expense)} accent="text-[#ffb4ab]" />
        <MoneyCard label="Profit" value={fmtIDR(fin.profit)} />
        <MoneyCard label="Outstanding" value={fmtIDR(fin.outstanding)} accent="text-[#ffd791]" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['CLIENTS', counts.clients, '/space/clients'],
          ['LEADS', counts.leads, '/space/leads'],
          ['PROJECTS', counts.projects, '/space/projects'],
          ['PRODUCTS', counts.products, null],
        ].map(([label, n, to]) => {
          const inner = (
            <>
              <span className="font-mono text-[10px] tracking-[0.15em] text-[#a8b09a]">{label}</span>
              <span className="font-jersey text-5xl leading-none">{n}</span>
            </>
          )
          const cls =
            'border border-[#2a2a2a] bg-[#0e0e0e] p-4 flex flex-col gap-1 transition-colors'
          return to ? (
            <Link key={label} to={to} className={`${cls} hover:border-[#c0f500]`}>
              {inner}
            </Link>
          ) : (
            <div key={label} className={cls}>
              {inner}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="border border-[#2a2a2a] bg-[#1c1b1b]">
          <div className="px-4 py-3 border-b border-[#2a2a2a] font-mono text-[11px] tracking-[0.15em] text-[#a8b09a] flex justify-between">
            <span>RECENT LEADS</span>
            <Link to="/space/leads" className="text-[#c0f500] hover:underline">
              OPEN →
            </Link>
          </div>
          <ul>
            {data.recentLeads.map((l) => (
              <li
                key={l.id}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-[#2a2a2a] last:border-0 text-[13px]"
              >
                <span className="flex-1 truncate">{l.title}</span>
                <Badge color={l.status === 'won' ? 'lime' : l.status === 'lost' ? 'red' : 'gray'}>
                  {l.status_display || l.status}
                </Badge>
                <span className="font-mono text-[11px] text-[#a8b09a] hidden sm:inline">
                  {fmtDate(l.updated_at)}
                </span>
              </li>
            ))}
            {data.recentLeads.length === 0 && (
              <li className="px-4 py-6 text-center font-mono text-[12px] text-[#a8b09a]">Belum ada lead.</li>
            )}
          </ul>
        </div>
        <div className="border border-[#2a2a2a] bg-[#1c1b1b]">
          <div className="px-4 py-3 border-b border-[#2a2a2a] font-mono text-[11px] tracking-[0.15em] text-[#a8b09a] flex justify-between">
            <span>RECENT PROJECTS</span>
            <Link to="/space/projects" className="text-[#c0f500] hover:underline">
              OPEN →
            </Link>
          </div>
          <ul>
            {data.recentProjects.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-[#2a2a2a] last:border-0 text-[13px]"
              >
                <span className="flex-1 truncate">{p.name}</span>
                <span className="font-mono text-[11px] text-[#c0f500] w-10 text-right">{p.progress}%</span>
                <Badge color={p.status === 'completed' ? 'lime' : p.status === 'archived' ? 'gray' : 'blue'}>
                  {p.status_display || p.status}
                </Badge>
              </li>
            ))}
            {data.recentProjects.length === 0 && (
              <li className="px-4 py-6 text-center font-mono text-[12px] text-[#a8b09a]">Belum ada project.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
