import { NavLink } from 'react-router-dom'
import { LayoutGrid, MessagesSquare, SearchCode, Swords } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/feedback', label: 'Feedback', icon: MessagesSquare },
  { to: '/search', label: 'Ask the signal', icon: SearchCode },
  { to: '/competitors', label: 'Competitors', icon: Swords },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__mark">
          <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
            <path
              d="M2 18 H9 L12 8 L16 26 L20 14 L23 20 H30"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <div className="sidebar__title">Insightful</div>
          <div className="sidebar__subtitle">Signal, not noise</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}>
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__status-dot" />
        <span>API at :5000</span>
      </div>
    </aside>
  )
}
