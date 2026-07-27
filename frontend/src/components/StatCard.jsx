export default function StatCard({ label, value, delta, accent = 'var(--brand)', sparkline }) {
  const points = sparkline
    ? sparkline
        .map((v, i) => {
          const max = Math.max(...sparkline)
          const min = Math.min(...sparkline)
          const x = (i / (sparkline.length - 1)) * 100
          const y = 32 - ((v - min) / Math.max(max - min, 1)) * 28
          return `${x},${y}`
        })
        .join(' ')
    : null

  return (
    <div className="stat-card" style={{ '--stat-accent': accent }}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {delta != null && (
          <span className={`stat-card__delta ${delta >= 0 ? 'is-up' : 'is-down'}`}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      {points && (
        <svg className="stat-card__spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={points} fill="none" stroke="var(--stat-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}
