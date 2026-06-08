import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FinalExamCopyBar } from './FinalExamCopyBar'
import { chapters, knowledgePoints } from '../data/chapters'
import type { FinalExamPaper } from '../types/finalExam'
import type { FinalExamQType } from '../types/finalExam'
import {
  TYPE_LABEL,
  formatDisplayAnswer,
  questionGlobalIndex,
  type FinalExamResultRow,
} from '../utils/finalExamUtils'

export function FinalExamReviewPanel({
  paper,
  paperId,
  results,
  elapsedMin,
  completedAt,
}: {
  paper: FinalExamPaper
  paperId: string
  results: FinalExamResultRow[]
  elapsedMin: number
  completedAt?: string
}) {
  const [reviewTab, setReviewTab] = useState<'wrong' | 'all' | 'calc'>('wrong')

  const objectiveEarned = results
    .filter((r) => r.q.type !== 'calc')
    .reduce((s, r) => s + r.earned, 0)
  const objectiveTotal = results.filter((r) => r.q.type !== 'calc').reduce((s, r) => s + r.q.points, 0)
  const correctN = results.filter((r) => r.correct === true).length
  const weakCh = [...new Set(results.filter((r) => r.correct === false).map((r) => r.q.chapterId))]

  const byType = results.reduce(
    (acc, r) => {
      if (r.q.type === 'calc') return acc
      const t = r.q.type
      if (!acc[t]) acc[t] = { ok: 0, total: 0 }
      acc[t].total++
      if (r.correct) acc[t].ok++
      return acc
    },
    {} as Record<string, { ok: number; total: number }>
  )

  const wrongList = results.filter((r) => r.q.type !== 'calc' && r.correct === false)
  const unanswered = results.filter((r) => r.q.type !== 'calc' && !r.userAnswer.trim())
  const calcList = results.filter((r) => r.q.type === 'calc')
  const reviewItems =
    reviewTab === 'wrong'
      ? wrongList
      : reviewTab === 'calc'
        ? calcList
        : results.filter((r) => r.q.type !== 'calc')

  const completedLabel = completedAt
    ? new Date(completedAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="final-exam-review-page">
      <div className="card exam-result final-exam-result">
        <h2>{paper.title} · 交卷结果</h2>
        {completedLabel && <p className="muted">完成时间：{completedLabel}</p>}
        <p className="exam-score">
          客观题得分 <strong>{objectiveEarned}</strong> / {objectiveTotal} 分
        </p>
        <p className="subtitle">
          客观题答对 {correctN} / {results.filter((r) => r.q.type !== 'calc').length} 道 · 错题 {wrongList.length} 道
          {unanswered.length > 0 ? ` · 未作答 ${unanswered.length} 道` : ''}
          · 用时约 {elapsedMin} 分钟
        </p>
        <p className="muted">计算题 45 分请在下文「计算题对照」中自评。</p>
        <ul className="final-exam-type-score">
          {(['single', 'multi', 'judge', 'fill'] as FinalExamQType[]).map((t) =>
            byType[t] ? (
              <li key={t}>
                {TYPE_LABEL[t]}：{byType[t].ok}/{byType[t].total} 题
                {byType[t].ok < byType[t].total && (
                  <span className="type-miss">（错 {byType[t].total - byType[t].ok}）</span>
                )}
              </li>
            ) : null
          )}
        </ul>
      </div>

      <FinalExamCopyBar paper={paper} results={results} />

      <div className="final-exam-review-tabs">
        <button type="button" className={reviewTab === 'wrong' ? 'active' : ''} onClick={() => setReviewTab('wrong')}>
          错题解析 ({wrongList.length})
        </button>
        <button type="button" className={reviewTab === 'all' ? 'active' : ''} onClick={() => setReviewTab('all')}>
          全部客观题 ({results.filter((r) => r.q.type !== 'calc').length})
        </button>
        <button type="button" className={reviewTab === 'calc' ? 'active' : ''} onClick={() => setReviewTab('calc')}>
          计算题对照 ({calcList.length})
        </button>
      </div>

      {reviewTab === 'wrong' && wrongList.length === 0 && (
        <div className="plain-box">客观题全对，太棒了！计算题请到「计算题对照」核对过程。</div>
      )}

      <div className="final-exam-review-list">
        {reviewItems.map((r) => {
          const num = questionGlobalIndex(paper, r.q.id)
          const chTitle = chapters.find((c) => c.id === r.q.chapterId)?.title ?? r.q.chapterId
          const kpTitle = r.q.knowledgePointIds
            .map((id) => knowledgePoints.find((k) => k.id === id)?.title)
            .filter(Boolean)
            .join('、')
          const isWrong = r.q.type !== 'calc' && r.correct === false
          const isOk = r.q.type !== 'calc' && r.correct === true

          return (
            <article
              key={r.q.id}
              className={`card final-exam-review-item${isWrong ? ' wrong-item' : ''}${isOk ? ' ok-item' : ''}`}
            >
              <header className="review-item-head">
                <span className={`badge badge-type-${r.q.type}`}>
                  第 {num} 题 · {TYPE_LABEL[r.q.type]} · {r.q.points} 分
                </span>
                {r.q.type !== 'calc' && (
                  <span className={`review-verdict${isOk ? ' ok' : ' bad'}`}>
                    {isOk ? '✓ 正确' : '✗ 错误'}
                    {!r.userAnswer.trim() && '（未作答）'}
                  </span>
                )}
              </header>
              <p className="stem final-exam-stem">{r.q.stem}</p>

              {r.q.type !== 'calc' && (
                <div className="review-answer-grid">
                  <div className="review-answer wrong-side">
                    <strong>你的答案</strong>
                    <p>{formatDisplayAnswer(r.q, r.userAnswer)}</p>
                  </div>
                  <div className="review-answer correct-side">
                    <strong>参考答案</strong>
                    <p>{formatDisplayAnswer(r.q, r.q.answer)}</p>
                  </div>
                </div>
              )}

              {r.q.type === 'calc' && (
                <div className="review-answer-grid calc-only">
                  <div className="review-answer correct-side">
                    <strong>参考答案要点</strong>
                    <p>{r.q.answer}</p>
                  </div>
                  {r.q.rubric && (
                    <div className="review-rubric">
                      <strong>评分要点</strong>
                      <pre className="rubric-pre">{r.q.rubric}</pre>
                    </div>
                  )}
                </div>
              )}

              <div className="explain-box">
                <strong>解析</strong>
                <p>{r.q.explanation}</p>
              </div>

              <p className="review-meta muted">
                {chTitle}
                {kpTitle ? ` · ${kpTitle}` : ''}
              </p>
              {r.q.knowledgePointIds[0] && (
                <Link className="btn btn-sm" to={`/learn?chapter=${r.q.chapterId}&kp=${r.q.knowledgePointIds[0]}`}>
                  去补学这个知识点
                </Link>
              )}
            </article>
          )
        })}
      </div>

      {weakCh.length > 0 && (
        <div className="card weak-list">
          <h3>薄弱章节（按错题汇总）</h3>
          <ul>
            {weakCh.map((id) => (
              <li key={id}>
                <Link to={`/learn?chapter=${id}`}>{chapters.find((c) => c.id === id)?.title ?? id}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row-actions final-exam-review-actions">
        <Link to={`/final-exam/${paperId}/view`} className="btn-secondary">
          查看完整卷面
        </Link>
        <Link to={`/final-exam/${paperId}`} className="btn-secondary">
          再做一次
        </Link>
        <Link to="/final-exam" className="btn-ghost">
          返回试卷列表
        </Link>
        {weakCh[0] && (
          <Link to={`/practice?wrongOnly=1&chapter=${weakCh[0]}`} className="btn-ghost">
            去刷相关错题
          </Link>
        )}
      </div>
    </div>
  )
}
