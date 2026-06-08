import { useCallback, useEffect, useMemo, useState } from 'react'
import { builtinQuestions } from '../data/questions'
import { useAppState } from '../hooks/useAppState'
import { prepareQuestionForDisplay } from '../services/questionDisplay'
import { useQuestionKeyboard, useScrollToQuestion } from '../hooks/useQuestionKeyboard'
import { QuestionKeyboardHint, QuestionOptions } from './QuestionOptions'
import type { Question } from '../types'

export function KpMiniPractice({ chapterId, kpId }: { chapterId: string; kpId: string }) {
  const { patch } = useAppState()
  const pool = useMemo(
    () => builtinQuestions.filter((q) => q.chapterId === chapterId && q.knowledgePointIds.includes(kpId)),
    [chapterId, kpId]
  )

  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)

  useEffect(() => {
    setQi(0)
    setSelected(null)
    setShowResult(false)
    setSessionCorrect(0)
    setSessionTotal(0)
    setStartTime(Date.now())
  }, [kpId, chapterId])

  const rawQ = pool[qi % Math.max(pool.length, 1)]
  const q = useMemo(() => (rawQ ? prepareQuestionForDisplay(rawQ) : undefined), [rawQ])

  const recordAttempt = useCallback(
    (question: Question, correct: boolean) => {
      const timeMs = Date.now() - startTime
      patch((s) => {
        const wrong = correct
          ? s.wrongQuestionIds.filter((id) => id !== question.id)
          : s.wrongQuestionIds.includes(question.id)
            ? s.wrongQuestionIds
            : [...s.wrongQuestionIds, question.id]
        return {
          ...s,
          wrongQuestionIds: wrong,
          questionAttempts: [
            ...s.questionAttempts,
            {
              questionId: question.id,
              correct,
              timeMs,
              answeredAt: new Date().toISOString(),
              chapterId: question.chapterId,
            },
          ],
        }
      })
    },
    [patch, startTime]
  )

  const submit = useCallback(() => {
    if (!q || selected === null || showResult) return
    const correct = selected === q.correctIndex
    recordAttempt(q, correct)
    setSessionTotal((n) => n + 1)
    if (correct) setSessionCorrect((n) => n + 1)
    setShowResult(true)
  }, [q, selected, showResult, recordAttempt])

  const next = useCallback(() => {
    if (pool.length === 0) return
    setQi((i) => (i + 1) % pool.length)
    setSelected(null)
    setShowResult(false)
    setStartTime(Date.now())
  }, [pool.length])

  useQuestionKeyboard({
    optionCount: q?.options.length ?? 4,
    selected,
    showResult,
    disabled: !q,
    onSelect: setSelected,
    onSubmit: submit,
    onNext: next,
  })

  useScrollToQuestion([qi])

  if (pool.length === 0) {
    return (
      <div className="card empty-state compact">
        <p>该知识点暂无题目，请稍后在刷题页查看全章。</p>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="kp-mini-practice">
      <div className="kp-practice-stats">
        <span>
          本题点 {pool.length} 道 · 本轮 {sessionCorrect}/{sessionTotal}
        </span>
        <span>
          {qi + 1} / {pool.length}
        </span>
      </div>
      <QuestionKeyboardHint phase={showResult ? 'result' : 'answer'} />
      <div className="card question-card compact">
        <span className="badge">{q.difficulty}</span>
        <p className="stem">{q.stem}</p>
        <QuestionOptions
          options={q.options}
          selected={selected}
          correctIndex={q.correctIndex}
          showResult={showResult}
          name={`kp-${kpId}`}
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
            <button type="button" className="btn-primary btn-sm" disabled={selected === null} onClick={submit}>
              提交
            </button>
          ) : (
            <button type="button" className="btn-primary btn-sm" onClick={next}>
              {qi < pool.length - 1 ? '下一题' : '再练一轮'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
