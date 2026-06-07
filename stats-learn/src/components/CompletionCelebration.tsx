import { Link } from 'react-router-dom'
import type { StreakData } from '../services/streak'

interface Props {
  streak: StreakData
  onClose: () => void
  onNote?: () => void
}

export function CompletionCelebration({ streak, onClose, onNote }: Props) {
  return (
    <div className="celebrate-overlay" role="dialog" aria-label="今日学习完成">
      <div className="celebrate-card">
        <div className="celebrate-badge">🏅</div>
        <h2>今日学习完成！</h2>
        <p className="celebrate-streak">
          {streak.count > 0 ? `已连续学习 ${streak.count} 天，继续保持` : '完成第一次今日打卡'}
        </p>
        <p className="subtitle">摸底 → 薄弱点 → 刷题，今天的核心任务都搞定了。</p>
        <div className="row-actions celebrate-actions">
          {onNote && (
            <button type="button" className="btn-secondary" onClick={onNote}>
              生成今日笔记
            </button>
          )}
          <Link to="/summary" className="btn-ghost" onClick={onClose}>
            查看小结
          </Link>
          <button type="button" className="btn-primary" onClick={onClose}>
            太好了
          </button>
        </div>
      </div>
    </div>
  )
}
