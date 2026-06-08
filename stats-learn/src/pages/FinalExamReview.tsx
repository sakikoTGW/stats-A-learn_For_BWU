import { Link, useParams } from 'react-router-dom'
import { FinalExamReviewPanel } from '../components/FinalExamReviewPanel'
import { finalExamPapers } from '../data/finalExamPapers'
import { useAppState } from '../hooks/useAppState'
import { getFinalExamAttempt, resultsFromRecord } from '../services/finalExamProgress'

/** 查看已保存的期末卷交卷记录（复盘） */
export function FinalExamReview() {
  const { paperId = 'final-a' } = useParams()
  const { state } = useAppState()
  const paper = finalExamPapers.find((p) => p.id === paperId)
  const record = getFinalExamAttempt(state, paperId)

  if (!paper) {
    return (
      <div className="page">
        <div className="card empty-state">
          <p>试卷不存在</p>
          <Link to="/final-exam">返回列表</Link>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="page">
        <div className="card empty-state">
          <h2>{paper.title}</h2>
          <p>还没有保存的交卷记录。</p>
          <p className="muted">
            你之前若已做过但未保存，需要再做一次；交卷后会自动记住成绩和错题。
          </p>
          <Link to={`/final-exam/${paperId}/view`} className="btn primary">
            查看题目与解答
          </Link>
          <Link to={`/final-exam/${paperId}`} className="btn">
            开始作答
          </Link>
          <Link to="/final-exam" className="btn-ghost">
            返回列表
          </Link>
        </div>
      </div>
    )
  }

  const results = resultsFromRecord(paper, record)

  return (
    <div className="page">
      <FinalExamReviewPanel
        paper={paper}
        paperId={paperId}
        results={results}
        elapsedMin={record.elapsedMinutes}
        completedAt={record.completedAt}
      />
    </div>
  )
}
