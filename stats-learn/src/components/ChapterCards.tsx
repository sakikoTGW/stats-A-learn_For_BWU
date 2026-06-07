import { Link } from 'react-router-dom'
import type { AppState } from '../types'
import { chapters } from '../data/chapters'
import { builtinQuestions } from '../data/questions'
import { hasDiagnostic, getDiagnostic } from '../services/diagnostic'
import { getDueKnowledgePoints } from '../services/review'
import { knowledgePoints } from '../data/chapters'

interface Props {
  state: AppState
}

export function ChapterCards({ state }: Props) {
  const due = getDueKnowledgePoints(knowledgePoints, state.knowledgeProgress)

  return (
    <div className="chapter-cards">
      {chapters.map((c) => {
        const diag = getDiagnostic(state, c.id)
        const wrongN = state.wrongQuestionIds.filter((qid) => {
          const q = builtinQuestions.find((x) => x.id === qid)
          return q?.chapterId === c.id
        }).length
        const reviewN = due.filter((k) => k.chapterId === c.id).length

        let statusLine = '未摸底'
        let statusClass = 'pending'
        if (diag) {
          statusLine = `已测 ${diag.accuracy}%`
          statusClass = diag.accuracy >= 70 ? 'ok' : 'warn'
        }
        if (reviewN > 0) statusLine += ` · 待复习 ${reviewN} 个`
        else if (wrongN > 0) statusLine += ` · 错题 ${wrongN} 道`

        return (
          <div key={c.id} className="chapter-card">
            <div className="chapter-card-main">
              <strong>{c.title}</strong>
              <span className={`chapter-status ${statusClass}`}>{statusLine}</span>
            </div>
            <div className="chapter-card-actions">
              {!hasDiagnostic(state, c.id) ? (
                <Link to={`/diagnostic/${c.id}`} className="btn-primary btn-sm">
                  摸底
                </Link>
              ) : (
                <Link to={`/learn?chapter=${c.id}`} className="btn-primary btn-sm">
                  学习
                </Link>
              )}
              <Link to={`/practice?chapter=${c.id}`} className="btn-ghost btn-sm">
                刷题
              </Link>
              <Link to={`/exam/${c.id}`} className="btn-ghost btn-sm">
                期末卷
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
