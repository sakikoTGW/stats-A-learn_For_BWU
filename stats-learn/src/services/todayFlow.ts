import type { AppState } from '../types'
import { chapters } from '../data/chapters'
import { hasDiagnostic, getDiagnostic } from './diagnostic'
import { knowledgePoints } from '../data/chapters'
import { getIntensityPlan } from './studyIntensity'

const FLOW_KEY = 'stats-learn-today-flow-v1'

export type FlowStepKey = 'diagnostic' | 'learn' | 'practice' | 'celebrate'

export interface TodayFlowSession {
  active: boolean
  date: string
  chapterId: string
  currentStep: 1 | 2 | 3 | 4
  skipped: Partial<Record<FlowStepKey, boolean>>
  practiceCount: number
  targetKpCount: number
  targetQuestionCount: number
  learnKpId?: string
  learnKpIdsDone: string[]
  learnDone: boolean
  diagnosticDone: boolean
  completed: boolean
}

const STEP_KEYS: FlowStepKey[] = ['diagnostic', 'learn', 'practice', 'celebrate']

export function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function pickFlowChapter(state: AppState): string {
  const undiagnosed = chapters.find((c) => !hasDiagnostic(state, c.id))
  if (undiagnosed) return undiagnosed.id
  if (state.lastChapterId && chapters.some((c) => c.id === state.lastChapterId)) {
    return state.lastChapterId
  }
  return chapters[0].id
}

export function weakKpForChapter(state: AppState, chapterId: string): string | undefined {
  const diag = getDiagnostic(state, chapterId)
  if (diag?.weakKnowledgePointIds[0]) return diag.weakKnowledgePointIds[0]
  const kp = knowledgePoints.find(
    (k) => k.chapterId === chapterId && (state.knowledgeProgress[k.id]?.mastery ?? 0) < 2
  )
  return kp?.id
}

export function nextLearnKp(state: AppState, chapterId: string, doneIds: string[]): string | undefined {
  const diag = getDiagnostic(state, chapterId)
  const order = diag?.suggestedOrder ?? []
  const chapterKps = knowledgePoints.filter((k) => k.chapterId === chapterId)
  const notDone = (id: string) => !doneIds.includes(id)

  for (const id of order) {
    if (notDone(id)) return id
  }
  const weak = chapterKps.find(
    (k) => notDone(k.id) && (state.knowledgeProgress[k.id]?.mastery ?? 0) < 2
  )
  if (weak) return weak.id
  // 薄弱点不够时，仍从本章未完成的 KP 里继续（避免「要求 3 个但过不了」）
  return chapterKps.find((k) => notDone(k.id))?.id
}

/** 今日学习：实际需完成的知识点数（不超过本章 KP 总数） */
export function effectiveLearnTarget(session: TodayFlowSession): number {
  const chapterTotal = knowledgePoints.filter((k) => k.chapterId === session.chapterId).length
  return Math.min(session.targetKpCount, chapterTotal)
}

export function loadTodayFlow(): TodayFlowSession | null {
  try {
    const raw = sessionStorage.getItem(FLOW_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as TodayFlowSession
    if (s.date !== todayDateKey()) {
      sessionStorage.removeItem(FLOW_KEY)
      return null
    }
    return {
      ...s,
      learnKpIdsDone: s.learnKpIdsDone ?? [],
      targetKpCount: s.targetKpCount ?? 2,
      targetQuestionCount: s.targetQuestionCount ?? 6,
    }
  } catch {
    return null
  }
}

export function saveTodayFlow(session: TodayFlowSession | null): void {
  if (!session) {
    sessionStorage.removeItem(FLOW_KEY)
    return
  }
  sessionStorage.setItem(FLOW_KEY, JSON.stringify(session))
}

export function startTodayFlow(state: AppState): TodayFlowSession {
  const plan = getIntensityPlan(state.settings.studyIntensity)
  const chapterId = pickFlowChapter(state)
  const needsDiag = !hasDiagnostic(state, chapterId)
  const session: TodayFlowSession = {
    active: true,
    date: todayDateKey(),
    chapterId,
    currentStep: needsDiag ? 1 : 2,
    skipped: {},
    practiceCount: 0,
    targetKpCount: plan.kpCount,
    targetQuestionCount: plan.questionCount,
    learnKpId: weakKpForChapter(state, chapterId),
    learnKpIdsDone: [],
    learnDone: false,
    diagnosticDone: !needsDiag,
    completed: false,
  }
  if (!needsDiag) session.currentStep = 2
  saveTodayFlow(session)
  return session
}

export function stepKeyForIndex(n: 1 | 2 | 3 | 4): FlowStepKey {
  return STEP_KEYS[n - 1]
}

export function skipFlowStep(session: TodayFlowSession, key: FlowStepKey): TodayFlowSession {
  const next = { ...session, skipped: { ...session.skipped, [key]: true } }
  if (key === 'diagnostic') next.diagnosticDone = true
  if (key === 'learn') {
    next.learnDone = true
    next.learnKpIdsDone = Array.from({ length: next.targetKpCount }, (_, i) => `skip-${i}`)
  }
  if (key === 'practice') next.practiceCount = next.targetQuestionCount
  const idx = STEP_KEYS.indexOf(key)
  if (idx >= 0 && session.currentStep === idx + 1) {
    next.currentStep = Math.min(4, idx + 2) as 1 | 2 | 3 | 4
  }
  saveTodayFlow(next)
  return next
}

export function advanceFlow(
  session: TodayFlowSession,
  patch: Partial<TodayFlowSession>
): TodayFlowSession {
  let next = { ...session, ...patch }
  if (patch.diagnosticDone && next.currentStep === 1) {
    next.currentStep = 2
  }
  if (patch.learnDone && next.currentStep <= 2) next.currentStep = 3
  if (
    patch.practiceCount !== undefined &&
    next.practiceCount >= next.targetQuestionCount &&
    next.currentStep <= 3
  ) {
    next.currentStep = 4
  }
  if (patch.completed) {
    next.active = false
    next.completed = true
    next.currentStep = 4
  }
  saveTodayFlow(next)
  return next
}

export function completeTodayFlow(session: TodayFlowSession): TodayFlowSession {
  const next: TodayFlowSession = {
    ...session,
    active: false,
    completed: true,
    currentStep: 4,
  }
  saveTodayFlow(next)
  return next
}

export function flowPath(session: TodayFlowSession, state: AppState): string {
  const ch = session.chapterId
  const kp = session.learnKpId ?? weakKpForChapter(state, ch) ?? ''
  switch (session.currentStep) {
    case 1:
      return `/diagnostic/${ch}?flow=today`
    case 2:
      return `/learn?chapter=${ch}&kp=${kp}&flow=today`
    case 3:
      return `/practice?chapter=${ch}&flow=today&limit=${session.targetQuestionCount}`
    case 4:
      return '/?celebrate=1'
    default:
      return '/'
  }
}

export function flowStepLabel(step: 1 | 2 | 3 | 4, session?: TodayFlowSession): string {
  const kpN = session ? effectiveLearnTarget(session) : 2
  const qN = session?.targetQuestionCount ?? 6
  return [
    '学前摸底',
    `学 ${kpN} 个知识点`,
    `刷 ${qN} 道题`,
    '今日完成',
  ][step - 1]
}
