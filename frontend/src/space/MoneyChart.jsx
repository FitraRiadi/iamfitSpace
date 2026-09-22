import { AreaChart } from '@tremor/react'
import { fmtIDRFull, lastChange, formatChange } from '../lib/finance'

// MoneyChart — Tremor AreaChart skinned to the dashboard:
// thin 1px border, flat dark panel, radius 0, no legend/gridlines,
// no gradient wash. Tooltip is computed purely from props
// (no setState-in-render like the stock snippet).

function Tip({ active, payload, label, data, dataKey, invert }) {
  if (!active || !payload?.length) return null
  const point = payload[0]
  const value = Number(point?.value ?? point?.payload?.[dataKey] ?? 0)
  const idx = (data || []).findIndex((d) => d.label === (label ?? point?.payload?.label))
  const prev = idx > 0 ? Number(data[idx - 1]?.[dataKey]) || 0 : 0
  const stat = idx > 0 && prev ? { pct: ((value - prev) / prev) * 100, abs: value - prev } : null
  const good = stat ? (invert ? stat.pct < 0 : stat.pct > 0) : null
  return (
    <div className="bg-[#0e0e0e] border border-[#353534] px-3 py-2 min-w-[160px]">
      <div className="font-mono text-[10px] tracking-[0.15em] text-[#a8b09a] uppercase">
        {label ?? point?.payload?.label}
      </div>
      <div className="font-jersey text-2xl text-[#e5e2e1] leading-tight">{fmtIDRFull(value)}</div>
      <div
        className={`font-mono text-[11px] font-bold ${
          stat === null ? 'text-[#a8b09a]' : good ? 'text-[#c0f500]' : 'text-[#ffb4ab]'
        }`}
      >
        {stat === null ? '--' : formatChange(stat)}
      </div>
    </div>
  )
}

export default function MoneyChart({
  title,
  tag = 'LAST 12 MO',
  total,
  sub,
  data,
  dataKey,
  color = 'lime',
  invert = false,
  className = '',
}) {
  const stat = lastChange(data, dataKey)
  const good = stat ? (invert ? stat.pct < 0 : stat.pct > 0) : null
  return (
    <div className={`border border-[#2a2a2a] bg-[#1c1b1b] p-4 sm:p-5 flex flex-col gap-1 min-w-0 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#a8b09a] uppercase">{title}</span>
        <span className="font-mono text-[10px] text-[#a8b09a]">{tag}</span>
      </div>
      <div className="font-jersey text-4xl sm:text-5xl leading-none text-[#e5e2e1]">
        {fmtIDRFull(total)}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] text-[#a8b09a] truncate">{sub}</span>
        <span
          className={`font-mono text-[11px] font-bold whitespace-nowrap ${
            stat === null ? 'text-[#a8b09a]' : good ? 'text-[#c0f500]' : 'text-[#ffb4ab]'
          }`}
        >
          {stat === null ? '--' : formatChange(stat)}
        </span>
      </div>
      <AreaChart
        data={data}
        index="label"
        categories={[dataKey]}
        colors={[color]}
        valueFormatter={fmtIDRFull}
        showLegend={false}
        showYAxis={false}
        showGridLines={false}
        showGradient={false}
        className="h-44 mt-2"
        customTooltip={(props) => (
          <Tip {...props} data={data} dataKey={dataKey} invert={invert} />
        )}
      />
    </div>
  )
}
