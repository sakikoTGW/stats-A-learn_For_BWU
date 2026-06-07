import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'
import { pickRetestQuestions } from '../services/reviewRetest'
import { useTutor } from '../context/TutorContext'
import { useToast } from '../components/Toast'
import type { Question } from '../types'
import { useQuestionKeyboard, useScrollToQuestion } from '../hooks/useQuestionKeyboard'
import { QuestionKeyboardHint, QuestionOptions } from '../components/QuestionOptions'
import { prepareQuestionForDisplay } from '../services/questionDisplay'

export function ReviewRetest() {
  const { state, patch } = useAppState()
  const { pushTutorMessage } = useTutor()
  const { showToast } = useToast()
  const pool = useMemo(() => pickRetestQuestions(state, 8), [state])

  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; chapterId: string }[]>([])
  const [finished, setFinished] = useState(false)
  const [qStart, setQStart] = useState(Date.now())

  const rawQ = pool[qi]
  const q: Question | undefined = useMemo(
    () => (rawQ ? prepareQuestionForDisplay(rawQ) : undefined),
    [rawQ?.id, qi]
  )

  const submit = useCallback(() => {
    if (!q || selected === null) return
    const correct = selected === q.correctIndex
    const timeMs = Date.now() - qStart
    patch((s) => ({
      ...s,
      questionAttempts: [
        ...s.questionAttempts,
        {
          questionId: q.id,
          correct,
          timeMs,
          answeredAt: new Date().toISOString(),
          chapterId: q.chapterId,
        },
      ],
      wrongQuestionIds: correct
        ? s.wrongQuestionIds
        : [...new Set([...s.wrongQuestionIds, q.id])],
    }))
    setAnswers((a) => [...a, { questionId: q.id, correct, chapterId: q.chapterId }])
    setShowResult(true)
  }, [q, selected, qStart, patch])

  const goNext = useCallback(() => {
    if (qi < pool.length - 1) {
      setQi((i) => i + 1)
      setSelected(null)
      setShowResult(false)
      setQStart(Date.now())
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

  useScrollToQuestion([qi])

  const correctN = answers.filter((a) => a.correct).length
  const scorePct = answers.length ? Math.round((correctN / answers.length) * 100) : 0

  useEffect(() => {
    if (!finished) return
    patch((s) => ({
      ...s,
      sessions: [
        ...s.sessions,
        {
          id: `retest-${Date.now()}`,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          type: 'retest',
          knowledgePointIds: [],
          questionIds: answers.map((a) => a.questionId),
          correctCount: correctN,
          totalCount: answers.length,
          summary: `复习再测 ${scorePct}%`,
        },
      ],
    }))
    pushTutorMessage(`复习再测完成：${correctN}/${answers.length}（${scorePct}%）。${scorePct >= 70 ? '保持节奏！' : '建议回学习页补薄弱点。'}`)
    showToast('再测成绩已保存')
  }, [finished]) // eslint-disable-line react-hooks/exhaustive-deps

  if (pool.length === 0) {
    return (
      <div className="page">
        <div className="card empty-state">
          <p>暂无可用题目</p>
          <Link to="/review" className="btn-primary">返回复习</Link>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="page">
        <div className="card exam-result">
          <h2>复习再测 · 成绩</h2>
          <p className="exam-score">
            <strong>{correctN}</strong> / {answers.length}（{scorePct}%）
          </p>
          <Link to="/review" className="btn-primary">
            返回复习页
          </Link>
        </div>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="page">
      <div className="page-header">
        <h2>复习再测</h2>
        <p className="subtitle">
          第 {qi + 1}/{pool.length} 题 · 到期知识点 + 错题混合
        </p>
        <QuestionKeyboardHint phase={showResult ? 'result' : 'answer'} />
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
              {qi < pool.length - 1 ? '下一题' : '查看得分'} <span className="kbd-hint">Enter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
