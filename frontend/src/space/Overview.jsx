import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, unwrapList } from '../lib/api'
import { buildMonthWindow, mergeMonthly, MONTHS_DEFAULT } from '../lib/finance'
import { PageHead, Btn, SpinnerCircle, ErrorBox, Badge, fmtDate } from './ui'
import MoneyChart from './MoneyChart'
import MoneyDonut from './MoneyDonut'

export default function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (silent) => {
    if (silent) setRefreshing(true)
    else setError('')
    try {
      const [fin, clients, leads, projects, products, recentLeads, recentProjects, monthly] = await Promise.all([
        apiGet('/api/finance/summary/'),
        apiGet('/api/clients/', { page_size: 1 }),
        apiGet('/api/leads/', { page_size: 1 }),
        apiGet('/api/projects/', { page_size: 1 }),
        apiGet('/api/products/', { page_size: 1 }),
        apiGet('/api/leads/', { page_size: 5, ordering: '-updated_at' }),
        apiGet('/api/projects/', { page_size: 5, ordering: '-updated_at' }),
        apiGet('/api/finance/monthly/', { months: MONTHS_DEFAULT }),
      ])
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
        monthly: mergeMonthly(buildMonthWindow(MONTHS_DEFAULT), monthly),
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load(false)
  }, [load])

  if (error) return <ErrorBox message={error} onRetry={() => window.location.reload()} />
  if (!data)
    return (
      <div className="py-24 flex justify-center">
        <SpinnerCircle size={52} label="LOADING OVERVIEW" />
      </div>
    )

  const { fin, counts, monthly } = data
  return (
    <div className="flex flex-col gap-8">
      <PageHead
        code="// SPACE DASHBOARD"
        title="Overview"
        desc="IamFit Space at a glance: money, pipeline, and active builds. All numbers live from the API."
        actions={<Btn variant="secondary" onClick={() => load(true)} disabled={refreshing}>{refreshing ? 'SYNCING...' : '↻ REFRESH'}</Btn>}
      />
      <MoneyDonut income={fin.income} expense={fin.expense} outstanding={fin.outstanding} />

      <div className="flex flex-wrap justify-center gap-3">
        <MoneyChart
          title="Income"
          tag="LAST 12 MO"
          total={fin.income}
          sub="Cash in"
          data={monthly}
          dataKey="income"
          color="lime"
          className="flex-1 min-w-[280px] max-w-[560px]"
        />
        <MoneyChart
          title="Expense"
          tag="LAST 12 MO"
          total={fin.expense}
          sub="Cash out"
          data={monthly}
          dataKey="expense"
          color="red"
          className="flex-1 min-w-[280px] max-w-[560px]"
          invert
        />
        <MoneyChart
          title="Profit"
          tag="LAST 12 MO"
          total={fin.profit}
          sub="Income minus expense"
          data={monthly}
          dataKey="profit"
          color="emerald"
          className="flex-1 min-w-[280px] max-w-[560px]"
        />
        <MoneyChart
          title="Outstanding"
          tag="BILLED / MO"
          total={fin.outstanding}
          sub="Open invoices now · chart shows billed"
          data={monthly}
          dataKey="invoiced"
          color="amber"
          className="flex-1 min-w-[280px] max-w-[560px]"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {[
          ['CLIENTS', counts.clients, '/space/clients'],
          ['LEADS', counts.leads, '/space/leads'],
          ['PROJECTS', counts.projects, '/space/projects'],
          ['PRODUCTS', counts.products, '/space/products'],
        ].map(([label, n, to]) => {
          const inner = (
            <>
              <span className="font-mono text-[10px] tracking-[0.15em] text-[#a8b09a]">{label}</span>
              <span className="font-jersey text-5xl leading-none">{n}</span>
            </>
          )
          const cls =
            'border border-[#2a2a2a] bg-[#0e0e0e] p-4 flex flex-col gap-1 transition-colors flex-1 min-w-[150px] max-w-[320px]'
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
              <li className="px-4 py-6 text-center font-mono text-[12px] text-[#a8b09a]">No leads yet.</li>
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
              <li className="px-4 py-6 text-center font-mono text-[12px] text-[#a8b09a]">No projects yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
