import { Link } from 'react-router-dom'
import { chapters, knowledgePoints } from '../data/chapters'
import type { FinalExamPaper, FinalExamQuestion } from '../types/finalExam'
import {
  TYPE_LABEL,
  formatDisplayAnswer,
  questionGlobalIndex,
  type FinalExamResultRow,
} from '../utils/finalExamUtils'

function ReadonlyOptions({ q }: { q: FinalExamQuestion }) {
  if (q.type === 'single' || q.type === 'multi') {
    if (!q.options?.length) return null
    return (
      <ul className="options readonly-options">
        {q.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i)
          return (
            <li key={i}>
              <span className="readonly-opt">
                <kbd>{letter}</kbd> {opt}
              </span>
            </li>
          )
        })}
      </ul>
    )
  }
  if (q.type === 'judge') {
    return <p className="muted judge-placeholder">（判断：对 / 错）</p>
  }
  if (q.type === 'fill') {
    return <p className="muted fill-placeholder">答：____________</p>
  }
  return null
}

export function FinalExamViewerPanel({
  paper,
  showAnswers,
  results,
}: {
  paper: FinalExamPaper
  showAnswers: boolean
  results?: FinalExamResultRow[]
}) {
  const resultMap = results ? Object.fromEntries(results.map((r) => [r.q.id, r])) : {}

  return (
    <div className="final-exam-view-list">
      {paper.sections.map((section) => (
        <section key={section.title} className="final-exam-view-section" id={`section-${section.title}`}>
          <header className="final-exam-view-section-head">
            <h3>{section.title}</h3>
            {section.instruction && <p className="muted">{section.instruction}</p>}
          </header>

          {section.questions.map((q) => {
            const num = questionGlobalIndex(paper, q.id)
            const row = resultMap[q.id]
            const chTitle = chapters.find((c) => c.id === q.chapterId)?.title ?? q.chapterId
            const kpTitle = q.knowledgePointIds
              .map((id) => knowledgePoints.find((k) => k.id === id)?.title)
              .filter(Boolean)
              .join('、')

            return (
              <article key={q.id} className="card final-exam-view-item" id={`q-${num}`}>
                <header className="review-item-head">
                  <span className={`badge badge-type-${q.type}`}>
                    第 {num} 题 · {TYPE_LABEL[q.type]} · {q.points} 分
                  </span>
                  {row && row.q.type !== 'calc' && (
                    <span className={`review-verdict${row.correct ? ' ok' : ' bad'}`}>
                      {row.correct ? '✓ 你答对了' : '✗ 你答错了'}
                    </span>
                  )}
                </header>

                <p className="stem final-exam-stem">{q.stem}</p>
                <ReadonlyOptions q={q} />

                {row && row.userAnswer.trim() && (
                  <div className="review-answer wrong-side final-exam-view-user">
                    <strong>你的答案</strong>
                    <p>{formatDisplayAnswer(q, row.userAnswer)}</p>
                  </div>
                )}

                {showAnswers && (
                  <>
                    <div className="review-answer correct-side final-exam-view-answer">
                      <strong>{q.type === 'calc' ? '参考答案要点' : '参考答案'}</strong>
                      <p>{formatDisplayAnswer(q, q.answer)}</p>
                    </div>
                    {q.rubric && (
                      <div className="review-rubric">
                        <strong>评分要点</strong>
                        <pre className="rubric-pre">{q.rubric}</pre>
                      </div>
                    )}
                    <div className="explain-box">
                      <strong>解析</strong>
                      <p>{q.explanation}</p>
                    </div>
                  </>
                )}

                <p className="review-meta muted">
                  {chTitle}
                  {kpTitle ? ` · ${kpTitle}` : ''}
                </p>
                {showAnswers && q.knowledgePointIds[0] && (
                  <Link className="btn btn-sm" to={`/learn?chapter=${q.chapterId}&kp=${q.knowledgePointIds[0]}`}>
                    去补学这个知识点
                  </Link>
                )}
              </article>
            )
          })}
        </section>
      ))}
    </div>
  )
}
