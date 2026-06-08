import { useCallback, useEffect, useMemo, useState } from 'react'

import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { chapters } from '../data/chapters'
import { knowledgePoints } from '../data/chapters'

import { builtinQuestions } from '../data/questions'

import { useAppState } from '../hooks/useAppState'

import { generateAIQuestions } from '../services/aiQuestions'

import { NotePanel } from '../components/NotePanel'

import type { NoteGenerateContext, Question } from '../types'

import { getChapterAccuracy, hasDiagnostic } from '../services/diagnostic'

import { useTutor } from '../context/TutorContext'

import { proactiveAfterPractice, instantAnswerFeedback } from '../services/tutor'

import { useToast } from '../components/Toast'

import { TodayFlowStepper } from '../components/TodayFlowStepper'

import {

  loadTodayFlow,

  advanceFlow,

  skipFlowStep,

  stepKeyForIndex,

  flowPath,

} from '../services/todayFlow'

import { applyFlowToDailyPlan } from '../services/planFlowSync'
import { prepareQuestionForDisplay } from '../services/questionDisplay'
import { useQuestionKeyboard, useScrollToQuestion } from '../hooks/useQuestionKeyboard'
import { QuestionKeyboardHint, QuestionOptions } from '../components/QuestionOptions'



export function Practice() {

  const [params] = useSearchParams()

  const navigate = useNavigate()

  const flowMode = params.get('flow') === 'today'
  const wrongOnly = params.get('wrongOnly') === '1'
  const docHwSet = params.get('set') === 'doc-hw'
  const chapterParam = params.get('chapter') ?? 'ch1'
  const docHwAll = docHwSet && chapterParam === 'all'
  const flowLimitParam = flowMode ? Number(params.get('limit') || 0) : null



  const { state, patch } = useAppState()

  const { pushTutorMessage } = useTutor()

  const { showToast } = useToast()

  const [chapterId, setChapterId] = useState(docHwAll ? 'all' : chapterParam)
  const kpFilter = params.get('kp') ?? ''

  useEffect(() => {
    const ch = params.get('chapter') ?? 'ch1'
    setChapterId(docHwSet && ch === 'all' ? 'all' : ch)
  }, [params, docHwSet])

  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')

  const [extra, setExtra] = useState<Question[]>([])

  const [qi, setQi] = useState(0)

  const [selected, setSelected] = useState<number | null>(null)

  const [startTime, setStartTime] = useState(Date.now())

  const [showResult, setShowResult] = useState(false)

  const [sessionQids, setSessionQids] = useState<string[]>([])

  const [sessionCorrect, setSessionCorrect] = useState(0)

  const [showNote, setShowNote] = useState(false)

  const [aiLoading, setAiLoading] = useState(false)

  const [wrongAnim, setWrongAnim] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(true)
  const [flow, setFlow] = useState(() => (flowMode ? loadTodayFlow() : null))

  useEffect(() => {
    if (flowMode) setFlow(loadTodayFlow())
  }, [flowMode, chapterId, flowLimitParam])

  const targetQ = flow?.targetQuestionCount ?? flowLimitParam ?? 3
  /** 今日流程：题库至少够目标题数；不足时用全章题并降低有效目标 */
  const flowPoolSize = flowMode ? targetQ : null



  const chapterAccuracy = getChapterAccuracy(state, chapterId)

  const diagnosed = hasDiagnostic(state, chapterId)



  const pool = useMemo(() => {

    const all = [...builtinQuestions, ...state.customQuestions, ...extra]

    let list = all.filter((q) => {

      if (docHwSet && !q.id.startsWith('doc-')) return false

      if (!docHwAll && q.chapterId !== chapterId) return false

      if (kpFilter && !q.knowledgePointIds.includes(kpFilter)) return false

      if (difficulty !== 'all' && q.difficulty !== difficulty) return false

      return true

    })

    if (docHwAll) {
      const order = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'ch9', 'ch10']
      list = [...list].sort(
        (a, b) => order.indexOf(a.chapterId) - order.indexOf(b.chapterId) || a.id.localeCompare(b.id)
      )
    }

    if (wrongOnly) {

      list = list.filter((q) => state.wrongQuestionIds.includes(q.id))

    }

    if (flowPoolSize && list.length >= flowPoolSize) return list.slice(0, flowPoolSize)
    if (flowPoolSize) return list

    return list

  }, [chapterId, docHwAll, docHwSet, kpFilter, difficulty, state.customQuestions, extra, wrongOnly, state.wrongQuestionIds, flowPoolSize])



  const rawQ = pool[qi]
  const q = useMemo(
    () => (rawQ ? prepareQuestionForDisplay(rawQ) : undefined),
    [rawQ?.id, qi]
  )

  const effectiveTargetQ = flowMode ? Math.min(targetQ, pool.length || targetQ) : targetQ
  const flowDone = flowMode && sessionQids.length >= effectiveTargetQ



  useEffect(() => {

    patch((s) => (s.lastChapterId === chapterId ? s : { ...s, lastChapterId: chapterId }))

  }, [chapterId, patch])



  useEffect(() => {

    setQi(0)

    setSelected(null)

    setShowResult(false)

    setStartTime(Date.now())

    setSessionQids([])

    setSessionCorrect(0)

  }, [chapterId, difficulty, wrongOnly, flowPoolSize])



  const submit = useCallback(() => {

    if (!q || selected === null) return

    const correct = selected === q.correctIndex

    const timeMs = Date.now() - startTime

    patch((s) => ({

      ...s,

      questionAttempts: [

        ...s.questionAttempts,

        { questionId: q.id, correct, timeMs, answeredAt: new Date().toISOString(), chapterId },

      ],

      wrongQuestionIds: correct

        ? s.wrongQuestionIds

        : [...new Set([...s.wrongQuestionIds, q.id])],

    }))

    setSessionQids((ids) => [...ids, q.id])
    setLastCorrect(correct)
    if (correct) setSessionCorrect((n) => n + 1)
    setShowResult(true)

    pushTutorMessage(instantAnswerFeedback(correct, q.explanation))

    if (!correct) {

      setWrongAnim(true)

      setTimeout(() => setWrongAnim(false), 1200)

    }

  }, [q, selected, startTime, chapterId, patch, pushTutorMessage])

  const goNext = useCallback(() => {

    const count = sessionQids.length

    if (flowMode && count >= effectiveTargetQ) {

      if (flow) {

        const nextFlow = advanceFlow(flow, { practiceCount: count, currentStep: 4 })

        setFlow(nextFlow)

        patch((s) => applyFlowToDailyPlan(s, nextFlow))

      }

      pushTutorMessage(

        proactiveAfterPractice(chapterId, sessionCorrect, count)

      )

      navigate('/?celebrate=1')

      return

    }

    if (qi < pool.length - 1) {

      setQi((i) => i + 1)

      setSelected(null)

      setShowResult(false)

      setStartTime(Date.now())

    }

  }, [
    sessionQids.length,
    flowMode,
    effectiveTargetQ,
    flow,
    patch,
    pushTutorMessage,
    chapterId,
    sessionCorrect,
    navigate,
    qi,
    pool.length,
  ])

  useQuestionKeyboard({
    optionCount: q?.options.length ?? 0,
    selected,
    showResult,
    disabled: !q,
    onSelect: setSelected,
    onSubmit: submit,
    onNext: goNext,
  })

  useScrollToQuestion([qi, chapterId])

  const finishPractice = () => {

    setShowNote(true)

    pushTutorMessage(proactiveAfterPractice(chapterId, sessionCorrect, sessionQids.length))

  }



  const handleSkipFlow = () => {
    if (!flow) return
    const next = skipFlowStep(flow, stepKeyForIndex(flow.currentStep))
    setFlow(next)
    patch((s) => applyFlowToDailyPlan(s, next))
    navigate(flowPath(next, state))
    showToast('已跳过本步')
  }

  const handleExtra = async () => {
    setAiLoading(true)
    const kps = [...new Set(pool.flatMap((x) => x.knowledgePointIds))].slice(0, 3)
    const excludeIds = [...new Set([...pool.map((x) => x.id), ...sessionQids])]
    const gen = await generateAIQuestions(
      kps.length ? kps : ['kp1-1'],
      3,
      undefined,
      chapterId,
      excludeIds
    )
    const fresh = gen.map((q, i) => ({ ...q, id: `session-${q.id}-${Date.now()}-${i}` }))
    setExtra((e) => [...e, ...fresh])
    setAiLoading(false)
    showToast(fresh.length ? `已加练 ${fresh.length} 题（来自本章题库）` : '本章暂无新题可加练')
  }



  const noteCtx: NoteGenerateContext = {

    source: 'practice',

    chapterId,

    knowledgePointIds: pool.flatMap((x) => x.knowledgePointIds).filter((id, i, a) => a.indexOf(id) === i),

    questionIds: sessionQids,

    sessionSummary: `完成刷题 ${sessionQids.length} 道，正确 ${sessionCorrect} 道`,

  }



  if (!q) {

    return (

      <div className="page">

        <h2>刷题</h2>

        <div className="card empty-state">

          <p>{wrongOnly ? '该章暂无错题，去别的章看看' : docHwSet ? '暂无课后习题，请从「课后习题」页进入' : '该筛选下暂无题目'}</p>

          <p className="empty-next">

            下一步：{wrongOnly ? <Link to="/practice">正常刷题</Link> : docHwSet ? <Link to="/doc-homework">课后习题列表</Link> : <Link to="/">开始今日学习</Link>}

          </p>

        </div>

      </div>

    )

  }



  return (

    <div className="page">

      {flowMode && flow?.active && <TodayFlowStepper session={flow} onSkip={handleSkipFlow} />}

      {docHwSet && (
        <div className="plain-box doc-hw-banner">
          <strong>📋 课后习题模式</strong>
          <span className="muted">
            {docHwAll ? '全部章节' : chapters.find((c) => c.id === chapterId)?.title} · 共 {pool.length} 题
          </span>
          <Link to="/doc-homework">换章 / 列表</Link>
        </div>
      )}

      <div className="page-header">

        <h2>{wrongOnly ? '只刷错题' : docHwSet ? '课后习题' : '刷题'}</h2>

        {!flowMode && (

          <div className="filters">

            {!docHwAll && (
            <select value={chapterId} onChange={(e) => setChapterId(e.target.value)}>

              {chapters.map((c) => (

                <option key={c.id} value={c.id}>{c.title}</option>

              ))}

            </select>
            )}

            {!docHwSet && (
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}>

              <option value="all">全部难度</option>

              <option value="easy">简单</option>

              <option value="medium">中等</option>

              <option value="hard">困难</option>

            </select>
            )}

          </div>

        )}

      </div>

      {kpFilter && !flowMode && (
        <div className="card banner-info">
          <p>
            只刷知识点：<strong>{knowledgePoints.find((k) => k.id === kpFilter)?.title ?? kpFilter}</strong>
            （{pool.length} 道题）
          </p>
          <Link to={`/practice?chapter=${chapterId}`} className="btn-ghost btn-sm">
            取消筛选 · 刷全章
          </Link>
          <Link to={`/learn?chapter=${chapterId}&kp=${kpFilter}`} className="btn-ghost btn-sm">
            回学习页
          </Link>
        </div>
      )}

      <QuestionKeyboardHint phase={showResult ? 'result' : 'answer'} />

      {!flowMode && !diagnosed && (

        <div className="card banner-warning compact">

          <span>本章未摸底 · </span>

          <Link to={`/diagnostic/${chapterId}`}>先摸底</Link>

        </div>

      )}



      {!flowMode && chapterAccuracy !== null && (

        <div className="card stats-inline">

          <span>本章历史正确率</span>

          <strong className={chapterAccuracy >= 70 ? 'good' : 'warn'}>{chapterAccuracy}%</strong>

        </div>

      )}



      <div className="progress-bar">

        <div style={{ width: `${((qi + 1) / pool.length) * 100}%` }} />

        <span>

          {qi + 1} / {pool.length}

          {flowMode && ` · 今日 ${sessionQids.length}/${effectiveTargetQ} 题`}

        </span>

      </div>



      <div className={`card question-card ${wrongAnim ? 'wrong-book-flash' : ''}`}>

        <span className="badge">{q.difficulty}</span>

        <p className="stem">{q.stem}</p>

        <QuestionOptions
          options={q.options}
          selected={selected}
          correctIndex={q.correctIndex}
          showResult={showResult}
          onSelect={setSelected}
        />

        {showResult && !lastCorrect && (
          <div className={`wrong-toast ${wrongAnim ? 'show' : ''}`} aria-live="polite">
            📕 已加入错题本
          </div>
        )}

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

            <>

              {flowDone || (flowMode && sessionQids.length >= effectiveTargetQ) ? (

                <button type="button" className="btn-primary" onClick={goNext}>

                  完成今日刷题

                </button>

              ) : qi < pool.length - 1 ? (

                <button type="button" className="btn-primary" onClick={goNext}>

                  下一题 <span className="kbd-hint">Enter</span>

                </button>

              ) : flowMode ? (

                <button type="button" className="btn-primary" onClick={goNext}>

                  完成今日刷题

                </button>

              ) : (

                <button type="button" className="btn-primary" onClick={finishPractice}>

                  完成 · 生成笔记

                </button>

              )}

            </>

          )}

          {!flowMode && (

            <button type="button" className="btn-ghost" onClick={handleExtra} disabled={aiLoading}>

              {aiLoading ? '…' : '随机加练'}

            </button>

          )}

        </div>

      </div>



      {showNote && <NotePanel context={noteCtx} onClose={() => setShowNote(false)} />}

    </div>

  )

}

