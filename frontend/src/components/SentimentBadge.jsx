const LABEL = { positive: 'Positive', neutral: 'Neutral', negative: 'Negative' }

export default function SentimentBadge({ sentiment }) {
  return (
    <span className={`sentiment-badge sentiment-badge--${sentiment}`}>
      <span className="sentiment-badge__dot" />
      {LABEL[sentiment] ?? sentiment}
    </span>
  )
}
