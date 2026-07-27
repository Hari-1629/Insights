import { useEffect, useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { getCompetitors } from '../api/client.js'

function ScoreGauge({ score }) {
  const pct = Math.round(score * 100)
  const color = score >= 0.6 ? 'var(--positive)' : score >= 0.45 ? 'var(--neutral)' : 'var(--negative)'
  const C = 2 * Math.PI * 30
  const dash = (pct / 100) * C

  return (
    <svg viewBox="0 0 72 72" width="72" height="72">
      <circle cx="36" cy="36" r="30" fill="none" stroke="var(--surface-2)" strokeWidth="8" />
      <circle
        cx="36"
        cy="36"
        r="30"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={`${dash} ${C - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="41" textAnchor="middle" className="gauge-text">
        {pct}
      </text>
    </svg>
  )
}

export default function Competitor() {
  const [items, setItems] = useState([])
  const [demo, setDemo] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCompetitors().then((res) => {
      setItems(res.items)
      setDemo(res.demo)
      setLoading(false)
    })
  }, [])

  return (
    <div className="page">
      {demo && <div className="demo-banner">Showing demo data — connect your backend at <code>/api/competitor</code> to go live.</div>}

      <div className="page__head">
        <span className="eyebrow">Competitors</span>
        <h1>See how you stack up, based on what people actually say.</h1>
      </div>

      {loading ? (
        <div className="skeleton skeleton--hero" />
      ) : (
        <div className="competitor-grid">
          {items.map((c) => (
            <div key={c.name} className="panel competitor-card">
              <div className="competitor-card__head">
                <div>
                  <h2>{c.name}</h2>
                  <span className="competitor-card__mentions">{c.mentions.toLocaleString()} mentions</span>
                </div>
                <ScoreGauge score={c.sentimentScore} />
              </div>

              <div className="competitor-card__lists">
                <div>
                  <div className="competitor-card__label competitor-card__label--up">
                    <ThumbsUp size={14} /> Strengths
                  </div>
                  <ul>
                    {c.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="competitor-card__label competitor-card__label--down">
                    <ThumbsDown size={14} /> Weaknesses
                  </div>
                  <ul>
                    {c.weaknesses.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
