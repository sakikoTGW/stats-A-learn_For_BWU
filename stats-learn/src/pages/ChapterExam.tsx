import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { useAppState } from '../hooks/useAppState'
import { pickChapterExamQuestions, weakKpIdsFromExam, weakKpTitles } from '../services/exam'
import { useTutor } from '../context/TutorContext'
import { useToast } from '../components/Toast'
import type { Question } from '../types'
import { useQuestionKeyboard, useScrollToQuestion } from '../hooks/useQuestionKeyboard'
import { QuestionKeyboardHint, QuestionOptions } from '../components/QuestionOptions'
import { prepareQuestionForDisplay } from '../services/questionDisplay'

export function ChapterExam() {
  const { chapterId = 'ch1' } = useParams()
  const [params] = useSearchParams()
  const timed = params.get('timed') !== '0'
  const navigate = useNavigate()
  const { state, patch } = useAppState()
  const { pushTutorMessage } = useTutor()
  const { showToast } = useToast()

  const chapter = chapters.find((c) => c.id === chapterId)
  const pool = useMemo(
    () => pickChapterExamQuestions(chapterId, state, 18),
    [chapterId, state]
  )

  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean }[]>([])
  const [finished, setFinished] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [questionStart, setQuestionStart] = useState(Date.now())

  useEffect(() => {
    if (!timed || finished) return
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(t)
  }, [timed, finished, startTime])

  const rawQ = pool[qi]
  const q: Question | undefined = useMemo(
    () => (rawQ ? prepareQuestionForDisplay(rawQ) : undefined),
    [rawQ?.id, qi]
  )

  const submit = useCallback(() => {
    if (!q || selected === null) return
    const correct = selected === q.correctIndex
    const timeMs = Date.now() - questionStart
    patch((s) => ({
      ...s,
      questionAttempts: [
        ...s.questionAttempts,
        {
          questionId: q.id,
          correct,
          timeMs,
          answeredAt: new Date().toISOString(),
          chapterId,
        },
      ],
      wrongQuestionIds: correct
        ? s.wrongQuestionIds
        : [...new Set([...s.wrongQuestionIds, q.id])],
    }))
    setAnswers((a) => [...a, { questionId: q.id, correct }])
    setShowResult(true)
  }, [q, selected, questionStart, chapterId, patch])

  const goNext = useCallback(() => {
    if (qi < pool.length - 1) {
      setQi((i) => i + 1)
      setSelected(null)
      setShowResult(false)
      setQuestionStart(Date.now())
    } else {
      setFinished(true)
    }
  }, [qi, pool.length])

  useQuestionKeyboard({
    optionCount: q?.options.length ?? 0,
    selected,
    showResult,
    disabled: finished || !q,
    onSelect: setSelected,
    onSubmit: submit,
    onNext: goNext,
  })

  useScrollToQuestion([qi, chapterId])

  const correctN = answers.filter((a) => a.correct).length
  const scorePct = answers.length > 0 ? Math.round((correctN / answers.length) * 100) : 0
  const weakIds = finished ? weakKpIdsFromExam(chapterId, answers) : []
  const weakTitles = weakKpTitles(weakIds)

  useEffect(() => {
    if (!finished) return
    const session = {
      id: `exam-${Date.now()}`,
      startedAt: new Date(startTime).toISOString(),
      endedAt: new Date().toISOString(),
      type: 'exam' as const,
      knowledgePointIds: weakIds,
      questionIds: answers.map((a) => a.questionId),
      correctCount: correctN,
      totalCount: answers.length,
      summary: `${chapter?.title} 期末卷 ${scorePct}%`,
    }
    patch((s) => ({ ...s, sessions: [...s.sessions, session] }))
    pushTutorMessage(
      `期末卷完成：${correctN}/${answers.length}（${scorePct}%）${weakTitles.length ? `，建议补学：${weakTitles.slice(0, 2).join('、')}` : '，表现不错！'}`
    )
    showToast('成绩已记录')
  }, [finished]) // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (pool.length === 0) {
    return (
      <div className="page">
        <div className="card empty-state">
          <p>本章暂无题目</p>
          <Link to="/" className="btn-primary">返回首页</Link>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="page">
        <div className="card exam-result">
          <h2>{chapter?.title} · 期末模拟卷</h2>
          <p className="exam-score">
            得分 <strong>{correctN}</strong> / {answers.length}（{scorePct}%）
          </p>
          {timed && <p className="subtitle">用时 {formatTime(elapsed)}</p>}
          {weakTitles.length > 0 ? (
            <div className="weak-list">
              <h3>薄弱知识点</h3>
              <ul>
                {weakTitles.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link
                to={`/learn?chapter=${chapterId}&kp=${weakIds[0]}`}
                className="btn-primary"
              >
                去补学薄弱点
              </Link>
            </div>
          ) : (
            <p>本章掌握较好，可继续下一章或加大刷题强度。</p>
          )}
          <div className="row-actions">
            <Link to={`/exam/${chapterId}`} className="btn-secondary">
              再考一次
            </Link>
            <Link to="/" className="btn-ghost">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="page">
      <div className="page-header">
        <h2>{chapter?.title} · 期末模拟卷</h2>
        <div className="exam-meta">
          {timed && <span className="timer-pill">⏱ {formatTime(elapsed)}</span>}
          <span>
            {qi + 1} / {pool.length}
          </span>
        </div>
        <QuestionKeyboardHint phase={showResult ? 'result' : 'answer'} />
      </div>

      <div className="progress-bar">
        <div style={{ width: `${((qi + 1) / pool.length) * 100}%` }} />
      </div>

      <div className="card question-card">
        <span className="badge">{q.difficulty}</span>
        <p className="stem">{q.stem}</p>
        <QuestionOptions
          options={q.options}
          selected={selected}
          correctIndex={q.correctIndex}
          showResult={showResult}
          onSelect={setSelected}
        />
        {showResult && (
          <div className="explain-box">
            <strong>解析</strong>
            <p>{q.explanation}</p>
          </div>
        )}
        <div className="row-actions">
          {!showResult ? (
            <button type="button" className="btn-primary" disabled={selected === null} onClick={submit}>
              提交 <span className="kbd-hint">Enter / Space</span>
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={goNext}>
              {qi < pool.length - 1 ? '下一题' : '查看成绩'} <span className="kbd-hint">Enter</span>
            </button>
          )}
          <button type="button" className="btn-ghost" onClick={() => navigate('/')}>
            退出
          </button>
        </div>
      </div>
    </div>
  )
}
