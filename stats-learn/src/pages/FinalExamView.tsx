import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FinalExamCopyBar } from '../components/FinalExamCopyBar'
import { FinalExamViewerPanel } from '../components/FinalExamViewerPanel'
import { finalExamPapers } from '../data/finalExamPapers'
import { useAppState } from '../hooks/useAppState'
import { getFinalExamAttempt, resultsFromRecord } from '../services/finalExamProgress'
import { TYPE_LABEL, flattenPaperQuestions } from '../utils/finalExamUtils'

type ViewMode = 'answer' | 'exam'

export function FinalExamView() {
  const { paperId = 'final-a' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { state } = useAppState()

  const paper = finalExamPapers.find((p) => p.id === paperId)
  const mode: ViewMode = searchParams.get('mode') === 'exam' ? 'exam' : 'answer'
  const attempt = paper ? getFinalExamAttempt(state, paper.id) : undefined
  const results = paper && attempt ? resultsFromRecord(paper, attempt) : undefined

  const sectionNav = useMemo(() => {
    if (!paper) return []
    return paper.sections.map((s) => ({
      title: s.title,
      type: s.questions[0]?.type,
      count: s.questions.length,
    }))
  }, [paper])

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

  const qCount = flattenPaperQuestions(paper).length

  const setMode = (next: ViewMode) => {
    if (next === 'answer') {
      searchParams.delete('mode')
    } else {
      searchParams.set('mode', 'exam')
    }
    setSearchParams(searchParams, { replace: true })
  }

  return (
    <div className="page final-exam-view-page">
      <header className="page-header">
        <h2>{paper.title}</h2>
        <p className="muted">
          {paper.subtitle} · {paper.focus}
        </p>
        <p className="exam-meta">
          <span>{qCount} 题 · {paper.totalPoints} 分 · 建议 {paper.durationMinutes} 分钟</span>
        </p>
      </header>

      <div className="final-exam-view-toolbar plain-box">
        <div className="final-exam-view-mode">
          <button type="button" className={mode === 'answer' ? 'active' : ''} onClick={() => setMode('answer')}>
            题目 + 解答
          </button>
          <button type="button" className={mode === 'exam' ? 'active' : ''} onClick={() => setMode('exam')}>
            仅题目
          </button>
        </div>
        <div className="final-exam-view-links">
          <Link className="btn primary" to={`/final-exam/${paperId}`}>
            在线作答
          </Link>
          {attempt && (
            <Link className="btn" to={`/final-exam/${paperId}/review`}>
              我的复盘
            </Link>
          )}
          <Link className="btn-ghost" to="/final-exam">
            返回列表
          </Link>
        </div>
      </div>

      <div className="final-exam-section-bar final-exam-view-jump">
        {sectionNav.map((seg) => (
          <a
            key={seg.title}
            href={`#section-${encodeURIComponent(seg.title)}`}
            className={`final-exam-seg type-${seg.type}`}
            title={seg.title}
          >
            {TYPE_LABEL[seg.type]?.replace('题', '') ?? seg.type}
            <span className="seg-count">{seg.count}题</span>
          </a>
        ))}
      </div>

      {mode === 'exam' && (
        <p className="plain-box muted final-exam-view-hint">当前为「仅题目」模式，不含答案。需要对照解析请切换到「题目 + 解答」。</p>
      )}

      {results && mode === 'answer' && (
        <p className="plain-box final-exam-view-hint">
          已交卷：你的作答会标在每题下方；也可去
          <Link to={`/final-exam/${paperId}/review`}> 复盘页 </Link>
          只看错题。
        </p>
      )}

      <FinalExamViewerPanel paper={paper} showAnswers={mode === 'answer'} results={mode === 'answer' ? results : undefined} />

      <FinalExamCopyBar paper={paper} results={results} />

      <div className="row-actions final-exam-review-actions">
        <Link to={`/final-exam/${paperId}`} className="btn primary">
          在线作答
        </Link>
        <Link to="/final-exam" className="btn-ghost">
          返回列表
        </Link>
      </div>
    </div>
  )
}
