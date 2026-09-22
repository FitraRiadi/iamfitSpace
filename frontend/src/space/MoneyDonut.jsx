import { DonutChart } from '@tremor/react'
import { fmtIDRFull } from '../lib/finance'

// MoneyDonut — Tremor DonutChart skinned to the dashboard.
// Real data only: income vs expense vs outstanding from /api/finance/summary/.
// Thin border, flat panel, radius 0. No tremor text classes (all custom).

export default function MoneyDonut({ income, expense, outstanding }) {
  const total = Number(income || 0) + Number(expense || 0) + Number(outstanding || 0)
  const data = [
    { name: 'Income', amount: Number(income || 0), color: 'lime' },
    { name: 'Expense', amount: Number(expense || 0), color: 'red' },
    { name: 'Outstanding', amount: Number(outstanding || 0), color: 'amber' },
  ]

  return (
    <div className="border border-[#2a2a2a] bg-[#1c1b1b] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#a8b09a] uppercase">
          Money mix
        </span>
        <span className="font-mono text-[10px] text-[#a8b09a]">LIVE TOTALS</span>
      </div>
      {total <= 0 ? (
        <div className="py-10 text-center font-mono text-[12px] text-[#a8b09a]">
          No money movement yet — record a transaction in Finance.
        </div>
      ) : (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex items-center gap-4 shrink-0">
            <DonutChart
              data={data}
              category="amount"
              index="name"
              valueFormatter={fmtIDRFull}
              colors={['lime', 'red', 'amber']}
              showTooltip={false}
              showLabel={false}
              className="h-24 w-24"
            />
            <div>
              <p className="font-jersey text-4xl leading-none text-[#e5e2e1]">{fmtIDRFull(total)}</p>
              <p className="font-mono text-[11px] text-[#a8b09a] mt-1">Combined total</p>
            </div>
          </div>
          <ul className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#2a2a2a] border border-[#2a2a2a]">
            {data.map((item) => {
              const share = total > 0 ? `${((item.amount / total) * 100).toFixed(1)}%` : '0%'
              return (
                <li key={item.name} className="bg-[#1c1b1b] px-4 py-3">
                  <p className="font-mono text-[13px] font-bold text-[#e5e2e1]">
                    {fmtIDRFull(item.amount)} <span className="font-normal text-[#a8b09a]">({share})</span>
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <span className={`bg-${item.color}-500 size-2.5 shrink-0`} aria-hidden="true" />
                    <span className="font-mono text-[11px] text-[#a8b09a] uppercase">{item.name}</span>
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
