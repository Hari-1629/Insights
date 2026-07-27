// Fallback data used only when the backend isn't reachable yet,
// so the interface always renders something real-looking during setup.

const THEMES = ['Onboarding', 'Pricing', 'Performance', 'Support', 'Mobile app', 'Integrations']
const SOURCES = ['App Store', 'Survey', 'Support ticket', 'Twitter/X', 'Sales call']

function seededSentiment(i) {
  const r = (i * 37) % 10
  if (r < 5) return 'positive'
  if (r < 8) return 'neutral'
  return 'negative'
}

export const mockFeedback = Array.from({ length: 18 }).map((_, i) => ({
  _id: `demo-${i}`,
  text: [
    'Setup took longer than expected, but support walked me through it patiently.',
    'The new dashboard is so much faster than the old one. Loving the redesign.',
    'Would love a dark mode for the mobile app.',
    'Pricing jumped a lot after the trial ended, felt a bit steep for our team size.',
    'Integration with our CRM saved us hours every week.',
    'Search results feel more relevant since the last update.',
    'App crashes occasionally when uploading large files.',
    'Customer support responded within minutes — impressed.',
    'Onboarding flow is confusing for non-technical users.',
    'Exactly what we needed for tracking competitor mentions.',
    'Reports are hard to export in the format our finance team needs.',
    'Great improvement in load times this quarter.',
  ][i % 12],
  sentiment: seededSentiment(i),
  theme: THEMES[i % THEMES.length],
  source: SOURCES[i % SOURCES.length],
  score: (0.55 + ((i * 13) % 40) / 100).toFixed(2),
  createdAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
}))

export const mockStats = {
  totalFeedback: 1284,
  sentimentBreakdown: { positive: 612, neutral: 401, negative: 271 },
  trend: Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
    count: 40 + Math.round(30 * Math.sin(i / 2) + (i * 3) % 20),
  })),
  topThemes: [
    { theme: 'Onboarding', count: 214, sentiment: 'neutral' },
    { theme: 'Pricing', count: 176, sentiment: 'negative' },
    { theme: 'Performance', count: 154, sentiment: 'positive' },
    { theme: 'Integrations', count: 121, sentiment: 'positive' },
    { theme: 'Support', count: 98, sentiment: 'positive' },
  ],
}

export const mockSearchResult = (query) => ({
  answer: `Across recent feedback, "${query}" comes up most in the context of onboarding friction and pricing clarity. Sentiment is mixed-to-positive overall, with support responsiveness cited as a consistent strength.`,
  matches: mockFeedback.slice(0, 5).map((f) => ({ ...f, score: (0.9 - Math.random() * 0.3).toFixed(2) })),
})

export const mockCompetitors = [
  {
    name: 'Northwind Analytics',
    mentions: 342,
    sentimentScore: 0.62,
    strengths: ['Fast onboarding', 'Strong mobile app'],
    weaknesses: ['Limited integrations', 'Pricier tiers'],
  },
  {
    name: 'Clarity Metrics',
    mentions: 218,
    sentimentScore: 0.41,
    strengths: ['Good support', 'Clean reporting'],
    weaknesses: ['Slow search', 'Confusing setup'],
  },
  {
    name: 'Lumen Insights',
    mentions: 176,
    sentimentScore: 0.71,
    strengths: ['Best-in-class search', 'Competitive pricing'],
    weaknesses: ['Fewer integrations', 'New to market'],
  },
]
