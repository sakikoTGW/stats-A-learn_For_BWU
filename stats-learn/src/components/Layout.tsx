import { NavLink, Outlet } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'
import { chapters } from '../data/chapters'
import { hasDiagnostic } from '../services/diagnostic'
import { ProgressRing } from './ProgressRing'
import { TutorPanel } from './TutorPanel'
import { Onboarding } from './Onboarding'
import { FlowResumeBanner } from './FlowResumeBanner'

const nav = [
  { to: '/', label: '今日计划', icon: '📅' },
  { to: '/learn', label: '学习', icon: '📖' },
  { to: '/chapter-notes', label: '章节重点', icon: '📌' },
  { to: '/practice', label: '刷题', icon: '✏️' },
  { to: '/review', label: '复习', icon: '🔄' },
  { to: '/wrong-book', label: '错题', icon: '📕' },
  { to: '/notes', label: '笔记', icon: '📝' },
  { to: '/settings', label: '设置', icon: '⚙️' },
]

export function Layout() {
  const { state } = useAppState()
  const diagnosed = chapters.filter((c) => hasDiagnostic(state, c.id)).length
  const progressPct = Math.round((diagnosed / chapters.length) * 100)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">📊</span>
          <div>
            <h1>统计课学习助手</h1>
            <p>摸底 → 计划 → 学习 → 刷题 → 复习 · 学伴全程陪伴</p>
          </div>
        </div>
        <ProgressRing value={progressPct} label="章节摸底" />
      </header>
      <nav className="app-nav">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <FlowResumeBanner />
      <main className="app-main">
        <Outlet />
      </main>
      <TutorPanel />
      <Onboarding />
    </div>
  )
}
