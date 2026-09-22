// Monthly finance window helpers (Tremor charts consume plain arrays).

export const MONTHS_DEFAULT = 12

export function buildMonthWindow(n = MONTHS_DEFAULT) {
  const out = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
    const label = d
      .toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
      .replace('.', '')
    out.push({ key, label, income: 0, expense: 0, profit: 0, invoiced: 0 })
  }
  return out
}

export function mergeMonthly(win, rows) {
  const map = Object.fromEntries(win.map((w) => [w.key, w]))
  for (const r of rows || []) {
    const w = map[r.month]
    if (!w) continue
    w.income = Number(r.income) || 0
    w.expense = Number(r.expense) || 0
    w.profit = w.income - w.expense
    w.invoiced = Number(r.invoiced) || 0
  }
  return win
}

export function fmtIDRFull(n) {
  return 'Rp ' + Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(n || 0))
}

// Signed % + absolute change of the last point vs the previous one.
// Returns null when there is nothing meaningful to compare.
export function lastChange(data, dataKey) {
  if (!data || data.length < 2) return null
  const cur = Number(data[data.length - 1]?.[dataKey]) || 0
  const prev = Number(data[data.length - 2]?.[dataKey]) || 0
  if (!prev) return null
  const pct = ((cur - prev) / prev) * 100
  return { pct, abs: cur - prev }
}

export function formatChange(stat) {
  if (!stat || !isFinite(stat.pct)) return '--'
  const p = `${stat.pct > 0 ? '+' : ''}${stat.pct.toFixed(1)}%`
  const a = `${stat.abs >= 0 ? '+' : '-'}${fmtIDRFull(Math.abs(stat.abs))}`
  return `${p} (${a})`
}
