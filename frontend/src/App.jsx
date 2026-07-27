import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Feedback from './pages/Feedback.jsx'
import Search from './pages/Search.jsx'
import Competitor from './pages/Competitor.jsx'

export default function App() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="shell__main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/search" element={<Search />} />
          <Route path="/competitors" element={<Competitor />} />
        </Routes>
      </main>
    </div>
  )
}
