import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { chapters, knowledgePoints } from '../data/chapters'
import { builtinQuestions } from '../data/questions'
import { useAppState } from '../hooks/useAppState'
import { NotePanel } from '../components/NotePanel'
import { MASTERY_LABELS } from '../types'
import type { NoteGenerateContext } from '../types'
import { useState } from 'react'

export function Summary() {
  const { state } = useAppState()
  const [showNote, setShowNote] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  const todayAttempts = useMemo(
    () => state.questionAttempts.filter((a) => a.answeredAt.startsWith(today)),
    [state.questionAttempts, today]
  )

  const mastered = useMemo(
    () =>
      knowledgePoints.filter((kp) => (state.knowledgeProgress[kp.id]?.mastery ?? 0) >= 3).length,
    [state.knowledgeProgress]
  )

  const wrongToday = todayAttempts.filter((a) => !a.correct).length
  const correctToday = todayAttempts.filter((a) => a.correct).length

  const weakChapter =
    state.wrongQuestionIds.length > 0
      ? chapters.find(
          (c) =>
            c.id ===
            builtinQuestions.find((q) => q.id === state.wrongQuestionIds[0])?.chapterId
        )?.title
      : null

  const noteCtx: NoteGenerateContext = {
    source: 'mixed',
    chapterId: 'ch1',
    knowledgePointIds: knowledgePoints
      .filter((kp) => state.knowledgeProgress[kp.id]?.lastStudiedAt?.startsWith(today))
      .map((kp) => kp.id)
      .slice(0, 5),
    questionIds: todayAttempts.map((a) => a.questionId),
    sessionSummary: [
      `今日刷题 ${todayAttempts.length} 道，正确 ${correctToday}，错误 ${wrongToday}。`,
      `累计掌握熟练及以上知识点 ${mastered}/${knowledgePoints.length}。`,
      weakChapter ? `薄弱章节建议加强：${weakChapter}。` : '继续保持每日学习节奏。',
    ].join(' '),
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>今日学习小结</h2>
        <p className="subtitle">{today}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{todayAttempts.length}</span>
          <span className="stat-label">今日答题</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{correctToday}</span>
          <span className="stat-label">答对</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{state.wrongQuestionIds.length}</span>
          <span className="stat-label">错题池</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{mastered}</span>
          <span className="stat-label">熟练+ 知识点</span>
        </div>
      </div>

      <div className="card">
        <h3>掌握度一览</h3>
        <ul className="mastery-list">
          {knowledgePoints.slice(0, 8).map((kp) => {
            const m = state.knowledgeProgress[kp.id]?.mastery ?? 0
            return (
              <li key={kp.id}>
                <span>{kp.title}</span>
                <span className={`mastery-tag m${m}`}>{MASTERY_LABELS[m]}</span>
              </li>
            )
          })}
        </ul>
        {knowledgePoints.length > 8 && (
          <p className="subtitle">更多知识点请前往「学知识点」</p>
        )}
      </div>

      <div className="row-actions">
        <button type="button" className="btn-primary" onClick={() => setShowNote(true)}>
          生成今日学习笔记
        </button>
        <Link to="/" className="btn-secondary">
          返回今日计划
        </Link>
      </div>

      {showNote && <NotePanel context={noteCtx} onClose={() => setShowNote(false)} />}
    </div>
  )
}
