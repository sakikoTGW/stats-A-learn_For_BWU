import { useState } from 'react'
import { Link } from 'react-router-dom'
import { knowledgePoints } from '../data/chapters'
import { builtinQuestions } from '../data/questions'
import { useAppState } from '../hooks/useAppState'
import { getDueKnowledgePoints, defaultProgress, scheduleReview } from '../services/review'
import { NotePanel } from '../components/NotePanel'
import type { NoteGenerateContext } from '../types'

export function Review() {
  const { state, patch } = useAppState()
  const due = getDueKnowledgePoints(knowledgePoints, state.knowledgeProgress)
  const wrongQs = builtinQuestions.filter((q) => state.wrongQuestionIds.includes(q.id))
  const [idx, setIdx] = useState(0)
  const [showNote, setShowNote] = useState(false)
  const [reviewedIds, setReviewedIds] = useState<string[]>([])

  const kp = due[idx]

  const rate = (quality: number) => {
    if (!kp) return
    const base = state.knowledgeProgress[kp.id] ?? defaultProgress(kp.id)
    const next = scheduleReview(base, quality)
    patch((s) => ({
      ...s,
      knowledgeProgress: { ...s.knowledgeProgress, [kp.id]: next },
    }))
    setReviewedIds((ids) => [...ids, kp.id])
    if (idx < due.length - 1) setIdx((i) => i + 1)
  }

  const noteCtx: NoteGenerateContext = {
    source: 'review',
    chapterId: kp?.chapterId ?? reviewedIds[0] ? knowledgePoints.find((k) => k.id === reviewedIds[0])?.chapterId ?? 'ch1' : 'ch1',
    knowledgePointIds: reviewedIds.length ? reviewedIds : due.map((k) => k.id).slice(0, 3),
    questionIds: wrongQs.slice(0, 5).map((q) => q.id),
    sessionSummary: `复习 ${reviewedIds.length} 个知识点，错题池 ${wrongQs.length} 道`,
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>复习审查</h2>
        <p className="subtitle">基于遗忘曲线与错题薄弱点</p>
        <Link to="/review/retest" className="btn-primary">
          再测 5–10 题
        </Link>
      </div>

      {wrongQs.length > 0 ? (
        <div className="card">
          <h3>错题巩固（{wrongQs.length}）</h3>
          <ul className="wrong-list">
            {wrongQs.slice(0, 5).map((q) => (
              <li key={q.id}>{q.stem}</li>
            ))}
          </ul>
          <Link to="/wrong-book" className="btn-primary">
            打开错题本 · 只刷错题
          </Link>
        </div>
      ) : (
        <div className="card empty-state compact">
          <p>暂无错题</p>
          <p className="empty-next">下一步：<Link to="/">开始今日学习</Link> 或去刷题。</p>
        </div>
      )}

      {due.length === 0 ? (
        <div className="card empty-state">
          <p>暂无到期复习</p>
          <p className="empty-next">下一步：点首页「开始今日学习」推进新内容。</p>
          <Link to="/" className="btn-primary">开始今日学习</Link>
        </div>
      ) : kp ? (
        <div className="card learn-card">
          <p className="subtitle">到期复习 {idx + 1}/{due.length}</p>
          <h3>{kp.title}</h3>
          <p>{kp.plainExplanation}</p>
          <ul>
            {kp.keyPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>回忆程度：</p>
          <div className="row-actions">
            <button type="button" className="btn-secondary" onClick={() => rate(1)}>忘了</button>
            <button type="button" className="btn-secondary" onClick={() => rate(3)}>一般</button>
            <button type="button" className="btn-primary" onClick={() => rate(5)}>记得牢</button>
          </div>
        </div>
      ) : null}

      {due.length > 0 && (
        <div className="row-actions">
          <button type="button" className="btn-primary" onClick={() => setShowNote(true)}>
            结束复习 · 生成笔记
          </button>
        </div>
      )}

      {showNote && <NotePanel context={noteCtx} onClose={() => setShowNote(false)} />}
    </div>
  )
}
