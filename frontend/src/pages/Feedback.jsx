import { useEffect, useMemo, useState } from 'react'
import { getFeedback, createFeedback } from '../api/client.js'
import SentimentBadge from '../components/SentimentBadge.jsx'
import EmptyState from '../components/EmptyState.jsx'

const SOURCES = ['App Store', 'Survey', 'Support ticket', 'Twitter/X', 'Sales call']
const FILTERS = ['all', 'positive', 'neutral', 'negative']

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.round(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function Feedback() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [demo, setDemo] = useState(false)
  const [filter, setFilter] = useState('all')
  const [text, setText] = useState('')
  const [source, setSource] = useState(SOURCES[0])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function load() {
    setLoading(true)
    getFeedback().then((res) => {
      setItems(res.items)
      setDemo(res.demo)
      setLoading(false)
    })
  }

  useEffect(load, [])

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.sentiment === filter)),
    [items, filter],
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await createFeedback({ text, source })
      setText('')
      load()
    } catch {
      setSubmitError("Couldn't reach the backend — start the API server to submit new feedback.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      {demo && <div className="demo-banner">Showing demo data — connect your backend at <code>/api/feedback</code> to go live.</div>}

      <div className="page__head">
        <span className="eyebrow">Feedback</span>
        <h1>Everything customers have told you, in one stream.</h1>
      </div>

      <div className="feedback-layout">
        <form className="panel feedback-form" onSubmit={handleSubmit}>
          <h2>Log new feedback</h2>
          <label className="field">
            <span>What did they say?</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a review, ticket, or quote…"
              rows={5}
              required
            />
          </label>
          <label className="field">
            <span>Source</span>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          {submitError && <p className="field-error">{submitError}</p>}
          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save feedback'}
          </button>
        </form>

        <div className="panel feedback-list-panel">
          <div className="panel__head panel__head--filters">
            <h2>All feedback</h2>
            <div className="filter-pills">
              {FILTERS.map((f) => (
                <button key={f} className={`filter-pill ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)} type="button">
                  {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="skeleton skeleton--list" />
          ) : filtered.length === 0 ? (
            <EmptyState title="No feedback here yet" description="Log an entry on the left, or clear filters to see everything you have." />
          ) : (
            <ul className="feedback-table">
              {filtered.map((f) => (
                <li key={f._id} className="feedback-table__row">
                  <SentimentBadge sentiment={f.sentiment} />
                  <p>{f.text}</p>
                  <span className="feedback-table__theme">{f.theme}</span>
                  <span className="feedback-table__meta">
                    {f.source} · {timeAgo(f.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
