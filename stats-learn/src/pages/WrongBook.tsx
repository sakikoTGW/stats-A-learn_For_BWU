import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { builtinQuestions } from '../data/questions'
import { useAppState } from '../hooks/useAppState'

export function WrongBook() {
  const { state } = useAppState()
  const [chapterFilter, setChapterFilter] = useState<string>('all')

  const wrongQs = useMemo(() => {
    return builtinQuestions.filter((q) => state.wrongQuestionIds.includes(q.id))
  }, [state.wrongQuestionIds])

  const filtered = useMemo(() => {
    if (chapterFilter === 'all') return wrongQs
    return wrongQs.filter((q) => q.chapterId === chapterFilter)
  }, [wrongQs, chapterFilter])

  const byChapter = useMemo(() => {
    const m = new Map<string, number>()
    for (const q of wrongQs) {
      m.set(q.chapterId, (m.get(q.chapterId) ?? 0) + 1)
    }
    return m
  }, [wrongQs])

  if (wrongQs.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h2>错题本</h2>
          <p className="subtitle">答错的题会自动收录在这里</p>
        </div>
        <div className="card empty-state">
          <p>还没有错题，继续保持！</p>
          <p className="empty-next">下一步：去 <Link to="/practice">刷题</Link> 或点首页「开始今日学习」。</p>
          <Link to="/" className="btn-primary">
            开始今日学习
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>错题本</h2>
        <p className="subtitle">共 {wrongQs.length} 道 · 按章筛选后只刷错题</p>
      </div>

      <div className="card filters-row">
        <label>
          章节
          <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)}>
            <option value="all">全部（{wrongQs.length}）</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id} disabled={!byChapter.has(c.id)}>
                {c.title}（{byChapter.get(c.id) ?? 0}）
              </option>
            ))}
          </select>
        </label>
        <Link
          to={
            chapterFilter === 'all'
              ? '/practice?wrongOnly=1'
              : `/practice?wrongOnly=1&chapter=${chapterFilter}`
          }
          className="btn-primary"
        >
          只刷错题
        </Link>
      </div>

      <ul className="wrong-book-list">
        {filtered.map((q) => (
          <li key={q.id} className="card wrong-book-item">
            <span className="badge">{chapters.find((c) => c.id === q.chapterId)?.title}</span>
            <p className="stem">{q.stem}</p>
            <p className="muted small">解析：{q.explanation.slice(0, 80)}…</p>
          </li>
        ))}
      </ul>

      <div className="row-actions">
        <Link
          to={
            chapterFilter === 'all'
              ? '/practice?wrongOnly=1'
              : `/practice?wrongOnly=1&chapter=${chapterFilter}`
          }
          className="btn-primary"
        >
          开始只刷错题（{filtered.length} 道）
        </Link>
      </div>
    </div>
  )
}
