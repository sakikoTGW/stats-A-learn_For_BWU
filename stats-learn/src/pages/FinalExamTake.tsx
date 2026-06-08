import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FinalExamReviewPanel } from '../components/FinalExamReviewPanel'
import { finalExamPapers } from '../data/finalExamPapers'
import { useAppState } from '../hooks/useAppState'
import { saveFinalExamAttempt } from '../services/finalExamProgress'
import { clearExamDraft, loadExamDraft, saveExamDraft } from '../utils/finalExamExport'
import type { FinalExamQuestion, FinalExamQType } from '../types/finalExam'
import {
  TYPE_LABEL,
  TYPE_HINT,
  buildResultRows,
  checkAnswer,
  flattenPaperQuestions,
} from '../utils/finalExamUtils'
import { useQuestionKeyboard } from '../hooks/useQuestionKeyboard'

function flattenQuestions(paperId: string) {
  const paper = finalExamPapers.find((p) => p.id === paperId)
  if (!paper) return { paper: undefined, questions: [] as FinalExamQuestion[], sections: [] }
  const questions = flattenPaperQuestions(paper)
  return { paper, questions, sections: paper.sections }
}

export function FinalExamTake() {
  const { paperId = 'final-a' } = useParams()
  const navigate = useNavigate()
  const { patch } = useAppState()
  const { paper, questions, sections } = useMemo(() => flattenQuestions(paperId), [paperId])
  const savedRef = useRef(false)

  const [finished, setFinished] = useState(false)
  const [startTime] = useState(() => {
    const draft = loadExamDraft(paperId)
    return draft?.startTime ?? Date.now()
  })
  const [answers, setAnswers] = useState<Record<string, string>>(() => loadExamDraft(paperId)?.answers ?? {})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>(() => loadExamDraft(paperId)?.submitted ?? {})
  const [qi, setQi] = useState(() => loadExamDraft(paperId)?.qi ?? 0)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const q = questions[qi]

  const sectionIdx = useMemo(() => {
    if (!paper || !q) return 0
    for (let i = 0; i < paper.sections.length; i++) {
      if (paper.sections[i].questions.some((x) => x.id === q.id)) return i
    }
    return 0
  }, [paper, q])

  const sectionStarts = useMemo(() => {
    if (!paper) return []
    let idx = 0
    return paper.sections.map((s) => {
      const start = idx
      idx += s.questions.length
      return { title: s.title, start, count: s.questions.length, type: s.questions[0]?.type }
    })
  }, [paper])

  const globalIndex = useMemo(() => {
    if (!paper || !q) return qi + 1
    let n = 0
    for (const s of paper.sections) {
      for (const item of s.questions) {
        n++
        if (item.id === q.id) return n
      }
    }
    return qi + 1
  }, [paper, q, qi])

  const userAnswer = q ? answers[q.id] ?? '' : ''
  const isCalc = q?.type === 'calc'
  const isRevealed = q ? revealed[q.id] : false
  const isSubmitted = q ? submitted[q.id] : false
  const showFeedback = finished || isRevealed || isSubmitted

  const results = useMemo(() => buildResultRows(questions, answers), [questions, answers])
  const elapsedMin = Math.round((Date.now() - startTime) / 60000)

  const finishExam = useCallback(() => {
    setFinished(true)
  }, [])

  useEffect(() => {
    if (!finished || !paper || savedRef.current) return
    savedRef.current = true
    const mins = Math.round((Date.now() - startTime) / 60000)
    patch((s) => saveFinalExamAttempt(s, paper, answers, mins))
    clearExamDraft(paperId)
  }, [finished, paper, answers, startTime, patch, paperId])

  useEffect(() => {
    if (finished || !paper) return
    saveExamDraft(paperId, { answers, submitted, qi, startTime })
  }, [answers, submitted, qi, startTime, finished, paper, paperId])

  const submitCurrent = useCallback(() => {
    if (!q) return
    if (q.type === 'calc') {
      setRevealed((r) => ({ ...r, [q.id]: true }))
      setSubmitted((s) => ({ ...s, [q.id]: true }))
      return
    }
    if (!userAnswer.trim()) return
    if (q.type === 'multi' && userAnswer.replace(/[^A-E]/gi, '').length < 2) return
    setSubmitted((s) => ({ ...s, [q.id]: true }))
    if (qi < questions.length - 1) {
      setQi((i) => i + 1)
    } else {
      finishExam()
    }
  }, [q, userAnswer, qi, questions.length, finishExam])

  useQuestionKeyboard({
    optionCount: q?.type === 'single' ? q.options?.length ?? 0 : q?.type === 'judge' ? 2 : 0,
    selected:
      q?.type === 'single' && userAnswer
        ? (q.options?.findIndex((_, i) => String.fromCharCode(65 + i) === userAnswer) ?? null)
        : q?.type === 'judge' && userAnswer
          ? userAnswer === '对'
            ? 0
            : 1
          : null,
    showResult: isSubmitted,
    disabled: !q || q.type === 'multi' || q.type === 'fill' || q.type === 'calc',
    onSelect: (i) => {
      if (!q || isSubmitted) return
      if (q.type === 'single') setAnswers((a) => ({ ...a, [q.id]: String.fromCharCode(65 + i) }))
      if (q.type === 'judge') setAnswers((a) => ({ ...a, [q.id]: i === 0 ? '对' : '错' }))
    },
    onSubmit: submitCurrent,
    onNext: submitCurrent,
  })

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

  if (finished) {
    return (
      <div className="page">
        <FinalExamReviewPanel
          paper={paper}
          paperId={paperId}
          results={results}
          elapsedMin={elapsedMin}
          completedAt={new Date().toISOString()}
        />
      </div>
    )
  }

  if (!q) return null

  const section = sections[sectionIdx]
  const multiTooFew = q.type === 'multi' && userAnswer.replace(/[^A-E]/gi, '').length < 2

  return (
    <div className="page final-exam-take">
      <div className="page-header">
        <h2>{paper.title}</h2>
        <div className="exam-meta">
          <span>
            第 {globalIndex} 题 / 共 {questions.length} 题
          </span>
          <span className="timer-pill">⏱ 建议 {paper.durationMinutes} 分钟</span>
        </div>
      </div>

      <div className="final-exam-section-bar">
        {sectionStarts.map((seg, i) => (
          <button
            key={i}
            type="button"
            className={`final-exam-seg type-${seg.type}${sectionIdx === i ? ' active' : ''}`}
            title={seg.title}
            onClick={() => setQi(seg.start)}
          >
            {TYPE_LABEL[seg.type as FinalExamQType]?.replace('题', '') ?? seg.type}
            <span className="seg-count">{seg.count}题</span>
          </button>
        ))}
      </div>

      <div className="progress-bar">
        <div style={{ width: `${(globalIndex / questions.length) * 100}%` }} />
      </div>

      <div className="final-exam-section-head">
        <p className="final-exam-section-label">{section.title}</p>
        <p className="final-exam-type-hint">{TYPE_HINT[q.type]}</p>
      </div>

      <div className="final-exam-qnav">
        {questions.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`qnav-dot type-${item.type}${i === qi ? ' current' : ''}${submitted[item.id] ? ' done' : ''}`}
            title={`${TYPE_LABEL[item.type]} ${i + 1}`}
            onClick={() => setQi(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="card question-card">
        <span className={`badge badge-type-${q.type}`}>
          {TYPE_LABEL[q.type]} · {q.points} 分
        </span>
        <p className="stem final-exam-stem">{q.stem}</p>

        {q.type === 'single' && q.options && (
          <ul className="options">
            {q.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i)
              return (
                <li key={i}>
                  <label className={userAnswer === letter ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="fe-opt"
                      disabled={isSubmitted}
                      checked={userAnswer === letter}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: letter }))}
                    />
                    <kbd>{letter}</kbd> {opt}
                  </label>
                </li>
              )
            })}
          </ul>
        )}

        {q.type === 'multi' && q.options && (
          <>
            <p className="multi-hint">☑ 多选题：勾选所有正确选项（至少 2 项）</p>
            <ul className="options multi-options">
              {q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i)
                const picked = userAnswer.includes(letter)
                return (
                  <li key={i}>
                    <label className={picked ? 'selected' : ''}>
                      <input
                        type="checkbox"
                        disabled={isSubmitted}
                        checked={picked}
                        onChange={() => {
                          const set = new Set(userAnswer.replace(/[^A-E]/g, ''))
                          if (set.has(letter)) set.delete(letter)
                          else set.add(letter)
                          setAnswers((a) => ({ ...a, [q.id]: [...set].sort().join('') }))
                        }}
                      />
                      <kbd>{letter}</kbd> {opt}
                    </label>
                  </li>
                )
              })}
            </ul>
            {userAnswer && <p className="multi-picked">已选：{userAnswer.split('').join('、')}</p>}
          </>
        )}

        {q.type === 'judge' && (
          <ul className="options judge-options">
            {['对', '错'].map((label) => (
              <li key={label}>
                <label className={userAnswer === label ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="fe-judge"
                    disabled={isSubmitted}
                    checked={userAnswer === label}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: label }))}
                  />
                  {label}
                </label>
              </li>
            ))}
          </ul>
        )}

        {q.type === 'fill' && (
          <div className="fill-input-wrap">
            <input
              type="text"
              className="fill-input"
              placeholder="填写答案，如：Σf、[-1,1]"
              disabled={isSubmitted}
              value={userAnswer}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
            />
          </div>
        )}

        {isCalc && (
          <div className="calc-hint plain-box">
            <p>📝 计算题请在纸上完成。写完后点「查看解析」，对照评分要点自评（本卷计算题共 45 分）。</p>
          </div>
        )}

        {showFeedback && q.type !== 'calc' && userAnswer && isSubmitted && (
          <div className={`explain-box ${checkAnswer(q, userAnswer) ? 'correct-box' : 'wrong-box'}`}>
            <strong>{checkAnswer(q, userAnswer) ? '✓ 正确' : '✗ 不正确'}</strong>
            <p>参考答案：{q.answer}</p>
            <p>{q.explanation}</p>
          </div>
        )}

        {isRevealed && q.type === 'calc' && (
          <div className="explain-box calc-rubric">
            <strong>参考答案与评分要点</strong>
            <p>
              <strong>答案要点：</strong>
              {q.answer}
            </p>
            {q.rubric && <pre className="rubric-pre">{q.rubric}</pre>}
            <p>{q.explanation}</p>
          </div>
        )}

        <div className="row-actions">
          {qi > 0 && (
            <button type="button" className="btn-ghost" onClick={() => setQi((i) => i - 1)}>
              上一题
            </button>
          )}
          {!isSubmitted && (
            <button
              type="button"
              className="btn-primary"
              disabled={(!isCalc && !userAnswer.trim()) || multiTooFew}
              onClick={submitCurrent}
            >
              {isCalc ? '查看解析' : qi < questions.length - 1 ? '下一题' : '交卷'}
            </button>
          )}
          {(isRevealed || isSubmitted) && qi < questions.length - 1 && (
            <button type="button" className="btn-primary" onClick={() => setQi((i) => i + 1)}>
              下一题
            </button>
          )}
          {(isRevealed || (isSubmitted && qi >= questions.length - 1)) && (
            <button type="button" className="btn-primary" onClick={finishExam}>
              交卷
            </button>
          )}
          <button type="button" className="btn-ghost" onClick={() => navigate('/final-exam')}>
            退出
          </button>
        </div>
        {multiTooFew && <p className="muted multi-warn">多选题请至少选择 2 个选项</p>}
      </div>
    </div>
  )
}
