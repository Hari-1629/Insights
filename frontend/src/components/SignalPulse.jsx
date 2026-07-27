// The signature motif of the product: feedback arriving as a live signal.
// A heartbeat-style waveform that animates its stroke, reused at hero
// scale on the dashboard and at a tiny scale inside stat cards.

export default function SignalPulse({ color = 'var(--brand)', height = 64, animated = true, path }) {
  const d =
    path ||
    'M0 32 H40 L52 8 L64 56 L76 20 L88 44 L100 32 H140 L152 4 L164 60 L176 32 H240'

  return (
    <svg
      className={`signal-pulse ${animated ? 'signal-pulse--animated' : ''}`}
      viewBox="0 0 240 64"
      height={height}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path d={d} stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
