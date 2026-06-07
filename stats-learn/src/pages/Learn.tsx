import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { chapters, knowledgePoints } from '../data/chapters'
import { useAppState } from '../hooks/useAppState'
import { defaultProgress, scheduleReview } from '../services/review'
import { MASTERY_LABELS, type MasteryLevel } from '../types'
import { NotePanel } from '../components/NotePanel'
import type { NoteGenerateContext } from '../types'
import { getDiagnostic, hasDiagnostic } from '../services/diagnostic'
import { useTutor } from '../context/TutorContext'
import { useToast } from '../components/Toast'
import { TodayFlowStepper } from '../components/TodayFlowStepper'
import { applyFlowToDailyPlan } from '../services/planFlowSync'
import { loadTodayFlow, advanceFlow, flowPath, nextLearnKp, effectiveLearnTarget, skipFlowStep, stepKeyForIndex } from '../services/todayFlow'
import { KpNoteAside } from './ChapterNotes'

export function Learn() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const flowMode = params.get('flow') === 'today'
  const { state, patch } = useAppState()
  const { pushTutorMessage } = useTutor()
  const { showToast } = useToast()
  const [chapterId, setChapterId] = useState(params.get('chapter') ?? 'ch1')
  const initialKp = params.get('kp')
  const diag = getDiagnostic(state, chapterId)
  const weakSet = useMemo(() => new Set(diag?.weakKnowledgePointIds ?? []), [diag])
  const priorityOrder = diag?.suggestedOrder ?? []

  const filtered = useMemo(
    () => knowledgePoints.filter((kp) => kp.chapterId === chapterId),
    [chapterId]
  )

  const sortedFiltered = useMemo(() => {
    if (priorityOrder.length === 0) return filtered
    return [...filtered].sort((a, b) => {
      const ia = priorityOrder.indexOf(a.id)
      const ib = priorityOrder.indexOf(b.id)
      const pa = ia === -1 ? 999 : ia
      const pb = ib === -1 ? 999 : ib
      return pa - pb
    })
  }, [filtered, priorityOrder])

  const [idx, setIdx] = useState(() => {
    if (initialKp) {
      const i = sortedFiltered.findIndex((k) => k.id === initialKp)
      return i >= 0 ? i : 0
    }
    return 0
  })
  const [showNote, setShowNote] = useState(false)
  const [studiedIds, setStudiedIds] = useState<string[]>([])
  const [flow, setFlow] = useState(() => (flowMode ? loadTodayFlow() : null))

  useEffect(() => {
    if (flowMode) setFlow(loadTodayFlow())
  }, [flowMode, chapterId, initialKp])

  useEffect(() => {
    patch((s) => (s.lastChapterId === chapterId ? s : { ...s, lastChapterId: chapterId }))
  }, [chapterId, patch])

  useEffect(() => {
    if (initialKp) {
      const i = sortedFiltered.findIndex((k) => k.id === initialKp)
      if (i >= 0) setIdx(i)
    }
  }, [initialKp, sortedFiltered])

  const kp = sortedFiltered[idx]
  if (!kp) {
    return (
      <div className="page">
        <div className="card empty-state">
          <p>该章暂无知识点</p>
          <Link to="/" className="btn-primary">返回首页</Link>
        </div>
      </div>
    )
  }

  const prog = state.knowledgeProgress[kp.id] ?? defaultProgress(kp.id)
  const diagnosed = hasDiagnostic(state, chapterId)

  const setMastery = (m: MasteryLevel) => {
    const base = state.knowledgeProgress[kp.id] ?? defaultProgress(kp.id)
    const scheduled = scheduleReview({ ...base, mastery: m }, m >= 3 ? 4 : 2)
    patch((s) => ({
      ...s,
      knowledgeProgress: { ...s.knowledgeProgress, [kp.id]: { ...scheduled, mastery: m } },
    }))
    if (!studiedIds.includes(kp.id)) setStudiedIds((ids) => [...ids, kp.id])
    showToast(`已标记为「${MASTERY_LABELS[m]}」`)
  }

  const completeFlowStep = () => {
    if (!flowMode || !flow) return

    const base = state.knowledgeProgress[kp.id] ?? defaultProgress(kp.id)
    const scheduled = scheduleReview({ ...base, mastery: 2 }, 4)
    patch((s) => ({
      ...s,
      knowledgeProgress: { ...s.knowledgeProgress, [kp.id]: { ...scheduled, mastery: 2 } },
    }))
    if (!studiedIds.includes(kp.id)) setStudiedIds((ids) => [...ids, kp.id])

    const doneIds = [...new Set([...flow.learnKpIdsDone, kp.id])]
    const needCount = effectiveLearnTarget(flow)
    const nextKp = doneIds.length < needCount ? nextLearnKp(state, chapterId, doneIds) : undefined

    if (nextKp) {
      const nextSession = advanceFlow(flow, {
        learnKpIdsDone: doneIds,
        learnKpId: nextKp,
      })
      setFlow(nextSession)
      patch((s) => applyFlowToDailyPlan(s, nextSession))
      navigate(`/learn?chapter=${chapterId}&kp=${nextKp}&flow=today`)
      showToast(`已学 ${doneIds.length}/${needCount} 个知识点，继续下一个`)
      return
    }

    const next = advanceFlow(flow, { learnDone: true, learnKpIdsDone: doneIds, currentStep: 3 })
    setFlow(next)
    patch((s) => applyFlowToDailyPlan(s, next))
    navigate(flowPath(next, state))
    showToast(`已学 ${doneIds.length} 个知识点，去做 ${flow.targetQuestionCount} 道题`)
  }

  const flowDoneCount = flow ? [...new Set([...flow.learnKpIdsDone, kp.id])].length : 0
  const flowNeedCount = flow ? effectiveLearnTarget(flow) : 0
  const flowHasNext =
    flowMode &&
    flow &&
    flowDoneCount < flowNeedCount &&
    !!nextLearnKp(state, chapterId, [...new Set([...flow.learnKpIdsDone, kp.id])])

  const finishSection = () => {
    if (!studiedIds.includes(kp.id)) setStudiedIds((ids) => [...ids, kp.id])
    setShowNote(true)
    pushTutorMessage('本节学完了？生成笔记可以把要点和错题整理在一起，方便复习。')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault()
        setIdx((i) => i - 1)
        return
      }
      if (e.key === 'ArrowRight' && idx < sortedFiltered.length - 1) {
        e.preventDefault()
        setIdx((i) => i + 1)
        return
      }
      const masteryKey = Number(e.key)
      if (masteryKey >= 0 && masteryKey <= 4) {
        e.preventDefault()
        setMastery(masteryKey as MasteryLevel)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, sortedFiltered.length, kp.id, studiedIds])

  const handleSkipFlow = () => {
    if (!flow) return
    const next = skipFlowStep(flow, stepKeyForIndex(flow.currentStep))
    setFlow(next)
    patch((s) => applyFlowToDailyPlan(s, next))
    navigate(flowPath(next, state))
    showToast('已跳过本步')
  }

  const noteCtx: NoteGenerateContext = {
    source: 'learn',
    chapterId,
    knowledgePointIds: studiedIds.length ? studiedIds : [kp.id],
    questionIds: [],
    sessionSummary: `学习了 ${studiedIds.length || 1} 个知识点，当前掌握度：${MASTERY_LABELS[prog.mastery]}`,
  }

  return (
    <div className="page">
      {flowMode && flow?.active && <TodayFlowStepper session={flow} onSkip={handleSkipFlow} />}
      <div className="page-header">
        <h2>学知识点</h2>
        <select
          value={chapterId}
          onChange={(e) => {
            setChapterId(e.target.value)
            setIdx(0)
          }}
        >
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {!diagnosed && (
        <div className="card banner-warning">
          <strong>📋 先摸底再学</strong>
          <p>本章尚未学前测验，建议先完成摸底，学伴会标出优先学习的知识点。</p>
          <Link to={`/diagnostic/${chapterId}`} className="btn-primary">
            开始本章摸底
          </Link>
        </div>
      )}

      {diagnosed && diag && (
        <div className="card banner-info">
          <p>
            摸底正确率 <strong>{diag.accuracy}%</strong>
            {diag.weakTags.length > 0 && ` · 薄弱：${diag.weakTags.slice(0, 3).join('、')}`}
          </p>
          <Link to={`/diagnostic/${chapterId}`} className="btn-ghost btn-sm">
            重新摸底
          </Link>
        </div>
      )}

      <div className="card learn-card">
        <div className="kp-nav">
          {sortedFiltered.map((k, i) => (
            <button
              key={k.id}
              type="button"
              className={`chip ${i === idx ? 'active' : ''} ${weakSet.has(k.id) ? 'priority' : ''}`}
              onClick={() => setIdx(i)}
            >
              {weakSet.has(k.id) && '⭐ '}
              {k.title}
            </button>
          ))}
        </div>
        {weakSet.has(kp.id) && <p className="priority-hint">⭐ 摸底薄弱点，建议优先掌握</p>}
        <h3>{kp.title}</h3>
        <div className="plain-box">
          <strong>通俗讲</strong>
          <p>{kp.plainExplanation}</p>
        </div>
        {kp.analogy && <div className="tip-box">💡 类比：{kp.analogy}</div>}
        {kp.mnemonic && <div className="tip-box">🎯 口诀：{kp.mnemonic}</div>}
        <div className="key-points">
          <strong>要点卡片</strong>
          <ul>
            {kp.keyPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <KpNoteAside chapterId={chapterId} kpId={kp.id} />
        <div className="mastery-row">
          <span>掌握度：</span>
          {([0, 1, 2, 3, 4] as MasteryLevel[]).map((m) => (
            <button
              key={m}
              type="button"
              className={prog.mastery === m ? 'chip active' : 'chip'}
              onClick={() => setMastery(m)}
            >
              <kbd>{m}</kbd> {MASTERY_LABELS[m]}
            </button>
          ))}
        </div>
        <p className="keyboard-hint-bar learn-hint">
          <kbd>←</kbd> <kbd>→</kbd> 切换知识点 · <kbd>0</kbd>–<kbd>4</kbd> 标记掌握度
        </p>
        <div className="row-actions">
          <button
            type="button"
            className="btn-secondary"
            disabled={idx <= 0}
            onClick={() => setIdx((i) => i - 1)}
          >
            上一个
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={idx >= sortedFiltered.length - 1}
            onClick={() => setIdx((i) => i + 1)}
          >
            下一个
          </button>
          {flowMode ? (
            <button type="button" className="btn-primary" onClick={completeFlowStep}>
              {flowHasNext
                ? `完成 (${flowDoneCount}/${flowNeedCount}) · 学下一个`
                : `学完去刷题 (${flowDoneCount}/${flowNeedCount || flow?.targetKpCount})`}
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={finishSection}>
              学完本节 · 生成笔记
            </button>
          )}
          {!flowMode && (
            <button type="button" className="btn-ghost" onClick={finishSection}>
              生成笔记
            </button>
          )}
        </div>
      </div>

      {showNote && <NotePanel context={noteCtx} onClose={() => setShowNote(false)} />}
    </div>
  )
}
