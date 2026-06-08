import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FinalExamCopyBar } from '../components/FinalExamCopyBar'
import { finalExamPapers } from '../data/finalExamPapers'
import { useAppState } from '../hooks/useAppState'
import { getFinalExamAttempt, recoverMissingFinalExamAttempts, resultsFromRecord } from '../services/finalExamProgress'
import { useToast } from '../components/Toast'

export function FinalExamList() {
  const labels = ['A', 'B', 'C', 'D', 'E']
  const { state, patch } = useAppState()
  const { showToast } = useToast()
  const doneCount = Object.keys(state.finalExamAttempts ?? {}).length

  useEffect(() => {
    patch((s) => {
      const next = recoverMissingFinalExamAttempts(s, finalExamPapers)
      if (next !== s) {
        const recovered = finalExamPapers
          .filter((p) => !s.finalExamAttempts[p.id] && next.finalExamAttempts[p.id])
          .map((p) => labels[finalExamPapers.indexOf(p)])
        if (recovered.length) {
          setTimeout(() => showToast(`已从本地恢复：卷 ${recovered.join('、')}`), 100)
        }
      }
      return next
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page final-exam-page">
      <header className="page-header">
        <h2>📝 期末模拟卷（5 套）</h2>
        <p className="muted">
          大学期末标准题型：单选 20 分 + 多选 15 分 + 判断 10 分 + 填空 10 分 + 计算 45 分 = 100 分，120 分钟。
          {doneCount > 0 && (
            <>
              {' '}
              已完成 <strong>{doneCount}</strong> / 5 套。
            </>
          )}
        </p>
      </header>

      <div className="plain-box final-exam-tip">
        <strong>题型说明（每套 33 题，不是只有单选）</strong>
        <table className="final-exam-type-table">
          <thead>
            <tr>
              <th>题型</th>
              <th>题量</th>
              <th>分值</th>
              <th>App 作答方式</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>单选题</td>
              <td>10</td>
              <td>20</td>
              <td>四选一</td>
            </tr>
            <tr>
              <td>多选题</td>
              <td>5</td>
              <td>15</td>
              <td>勾选多个字母（第 11–15 题）</td>
            </tr>
            <tr>
              <td>判断题</td>
              <td>10</td>
              <td>10</td>
              <td>对 / 错（第 16–25 题）</td>
            </tr>
            <tr>
              <td>填空题</td>
              <td>5</td>
              <td>10</td>
              <td>输入框（第 26–30 题）</td>
            </tr>
            <tr>
              <td>计算题</td>
              <td>3</td>
              <td>45</td>
              <td>纸上算 + 查看解析自评（第 31–33 题）</td>
            </tr>
          </tbody>
        </table>
        <p className="muted">交卷后自动保存；打开本页会尝试从浏览器草稿/备份恢复记录。每套可点「查看题目与解答」在 App 内浏览，也可复制给 AI。</p>
      </div>

      <div className="doc-hw-grid">
        {finalExamPapers.map((paper, i) => {
          const qCount = paper.sections.reduce((n, s) => n + s.questions.length, 0)
          const attempt = getFinalExamAttempt(state, paper.id)
          const done = Boolean(attempt)
          const doneDate = attempt
            ? new Date(attempt.completedAt).toLocaleString('zh-CN', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : null

          return (
            <article
              key={paper.id}
              className={`plain-box doc-hw-card final-exam-card${done ? ' final-exam-done' : ''}`}
            >
              <span className="final-exam-badge">卷 {labels[i]}</span>
              {done && (
                <span className="final-exam-done-tag">
                  ✓ 已完成 · 客观题 {attempt!.objectiveEarned}/{attempt!.objectiveTotal} 分
                </span>
              )}
              <h3>{paper.title.replace('统计学原理 · ', '')}</h3>
              <p className="muted">{paper.subtitle}</p>
              <p>{paper.focus}</p>
              <p className="final-exam-meta">
                {paper.durationMinutes} 分钟 · {qCount} 题 · {paper.totalPoints} 分
                {doneDate && ` · ${doneDate}`}
              </p>
              <div className="final-exam-actions">
                <Link className="btn primary" to={`/final-exam/${paper.id}/view`}>
                  查看题目与解答
                </Link>
                {done ? (
                  <>
                    <Link className="btn" to={`/final-exam/${paper.id}/review`}>
                      我的复盘
                    </Link>
                    <Link className="btn" to={`/final-exam/${paper.id}`}>
                      再做一次
                    </Link>
                  </>
                ) : (
                  <Link className="btn" to={`/final-exam/${paper.id}`}>
                    在线作答
                  </Link>
                )}
              </div>
              {done && (
                <FinalExamCopyBar
                  paper={paper}
                  results={resultsFromRecord(paper, attempt!)}
                  compact
                />
              )}
              <p className="muted final-exam-md-hint">卷面 Markdown：docs/期末模拟卷/卷{labels[i]}.md</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
