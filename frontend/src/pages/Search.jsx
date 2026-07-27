import { useState } from 'react'
import { SearchCode, Sparkles } from 'lucide-react'
import { searchFeedback } from '../api/client.js'
import SentimentBadge from '../components/SentimentBadge.jsx'
import EmptyState from '../components/EmptyState.jsx'

const PROMPTS = [
  'What do people say about onboarding?',
  'Complaints about pricing this month',
  'How does support get praised?',
  'Anything about the mobile app crashing?',
]

export default function Search() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [asked, setAsked] = useState(false)

  async function runSearch(q) {
    const value = q ?? query
    if (!value.trim()) return
    setQuery(value)
    setLoading(true)
    setAsked(true)
    const res = await searchFeedback(value)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="page">
      <div className="page__head">
        <span className="eyebrow">Ask the signal</span>
        <h1>Ask a question, get an answer grounded in real feedback.</h1>
      </div>

      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault()
          runSearch()
        }}
      >
        <SearchCode size={20} strokeWidth={2} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. what are people frustrated with lately?"
        />
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {!asked && (
        <div className="prompt-chips">
          {PROMPTS.map((p) => (
            <button key={p} className="prompt-chip" onClick={() => runSearch(p)} type="button">
              {p}
            </button>
          ))}
        </div>
      )}

      {loading && <div className="skeleton skeleton--list" />}

      {!loading && result && (
        <>
          {result.demo && <div className="demo-banner">Showing demo results — connect your backend at <code>/api/search</code> to go live.</div>}

          <div className="panel answer-panel">
            <div className="answer-panel__head">
              <Sparkles size={18} strokeWidth={2} />
              <h2>Synthesized answer</h2>
            </div>
            <p>{result.answer}</p>
          </div>

          <div className="panel">
            <div className="panel__head">
              <h2>Matched feedback</h2>
            </div>
            {result.matches?.length ? (
              <ul className="match-list">
                {result.matches.map((m, i) => (
                  <li key={m._id ?? i} className="match-list__row">
                    <div className="match-list__score">
                      <div className="match-list__score-track">
                        <div className="match-list__score-fill" style={{ width: `${Number(m.score) * 100}%` }} />
                      </div>
                      <span>{Math.round(Number(m.score) * 100)}%</span>
                    </div>
                    <div className="match-list__body">
                      <SentimentBadge sentiment={m.sentiment} />
                      <p>{m.text}</p>
                      <span className="feed-list__meta">{m.source}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No matches" description="Try rephrasing your question, or ask about a different theme." />
            )}
          </div>
        </>
      )}
    </div>
  )
}
