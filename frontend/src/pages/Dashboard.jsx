import { useEffect, useState } from 'react'
import { getDashboardStats, getFeedback } from '../api/client.js'
import StatCard from '../components/StatCard.jsx'
import SentimentBadge from '../components/SentimentBadge.jsx'
import SignalPulse from '../components/SignalPulse.jsx'

const SENTIMENT_COLOR = {
  positive: 'var(--positive)',
  neutral: 'var(--neutral)',
  negative: 'var(--negative)',
}

function SentimentDonut({ breakdown }) {
  const total = breakdown.positive + breakdown.neutral + breakdown.negative || 1
  const order = ['positive', 'neutral', 'negative']
  let offset = 0
  const R = 54
  const C = 2 * Math.PI * R

  return (
    <svg viewBox="0 0 140 140" width={160} height={160}>
      <circle cx="70" cy="70" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="16" />
      {order.map((key) => {
        const value = breakdown[key]
        const frac = value / total
        const dash = frac * C
        const circle = (
          <circle
            key={key}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={SENTIMENT_COLOR[key]}
            strokeWidth="16"
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        )
        offset += dash
        return circle
      })}
      <text x="70" y="65" textAnchor="middle" className="donut-total">
        {total}
      </text>
      <text x="70" y="84" textAnchor="middle" className="donut-caption">
        signals
      </text>
    </svg>
  )
}

function TrendArea({ trend }) {
  if (!trend?.length) return null
  const values = trend.map((t) => t.count)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const w = 100
  const h = 36
  const points = trend.map((t, i) => {
    const x = (i / (trend.length - 1)) * w
    const y = h - ((t.count - min) / Math.max(max - min, 1)) * (h - 4) - 2
    return [x, y]
  })
  const line = points.map((p) => p.join(',')).join(' ')
  const area = `0,${h} ${line} ${w},${h}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="trend-area">
      <polygon points={area} fill="url(#trendFill)" opacity="0.5" />
      <polyline points={line} fill="none" stroke="var(--brand-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-2)" />
          <stop offset="100%" stopColor="var(--brand-2)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([getDashboardStats(), getFeedback({ limit: 6 })]).then(([s, f]) => {
      if (!active) return
      setStats(s)
      setRecent(f.items.slice(0, 6))
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  if (loading || !stats) {
    return (
      <div className="page">
        <div className="skeleton skeleton--hero" />
      </div>
    )
  }

  const positiveRate = Math.round(
    (stats.sentimentBreakdown.positive /
      (stats.sentimentBreakdown.positive + stats.sentimentBreakdown.neutral + stats.sentimentBreakdown.negative)) *
      100,
  )

  return (
    <div className="page">
      {stats.demo && <div className="demo-banner">Showing demo data — connect your backend at <code>/api/dashboard</code> to go live.</div>}

      <section className="hero">
        <div className="hero__text">
          <span className="eyebrow">Overview</span>
          <h1>Every review, ticket and tweet, turned into one clear signal.</h1>
          <p>Gemini reads the raw feedback, Pinecone finds what matters, and this is where it all surfaces.</p>
        </div>
        <div className="hero__pulse">
          <SignalPulse height={90} color="var(--brand-2)" />
        </div>
      </section>

      <section className="stat-row">
        <StatCard label="Total signals" value={stats.totalFeedback.toLocaleString()} delta={8} accent="var(--brand)" sparkline={stats.trend.map((t) => t.count)} />
        <StatCard label="Positive rate" value={`${positiveRate}%`} delta={3} accent="var(--positive)" sparkline={stats.trend.map((t, i) => t.count - i)} />
        <StatCard label="Open themes" value={stats.topThemes.length} delta={-1} accent="var(--accent-cyan)" sparkline={stats.topThemes.map((t) => t.count)} />
      </section>

      <section className="grid-2">
        <div className="panel">
          <div className="panel__head">
            <h2>Sentiment breakdown</h2>
          </div>
          <div className="donut-row">
            <SentimentDonut breakdown={stats.sentimentBreakdown} />
            <ul className="donut-legend">
              {Object.entries(stats.sentimentBreakdown).map(([key, value]) => (
                <li key={key}>
                  <SentimentBadge sentiment={key} />
                  <span className="donut-legend__value">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel">
          <div className="panel__head">
            <h2>Volume, last 14 days</h2>
          </div>
          <TrendArea trend={stats.trend} />
        </div>
      </section>

      <section className="grid-2">
        <div className="panel">
          <div className="panel__head">
            <h2>Top themes</h2>
          </div>
          <ul className="theme-list">
            {stats.topThemes.map((t) => {
              const max = Math.max(...stats.topThemes.map((x) => x.count))
              return (
                <li key={t.theme}>
                  <div className="theme-list__row">
                    <span>{t.theme}</span>
                    <span className="theme-list__count">{t.count}</span>
                  </div>
                  <div className="theme-list__bar-track">
                    <div
                      className="theme-list__bar-fill"
                      style={{ width: `${(t.count / max) * 100}%`, background: SENTIMENT_COLOR[t.sentiment] }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="panel">
          <div className="panel__head">
            <h2>Latest feedback</h2>
          </div>
          <ul className="feed-list">
            {recent.map((f) => (
              <li key={f._id} className="feed-list__item">
                <SentimentBadge sentiment={f.sentiment} />
                <p>{f.text}</p>
                <span className="feed-list__meta">{f.source}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
