import { builtinQuestions } from '../data/questions'
import { knowledgePoints } from '../data/chapters'
import type { AppState, DiagnosticResult, Question } from '../types'

const TARGET_COUNT = 6
const MIN_COUNT = 5
const MAX_COUNT = 8

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 为章节抽取学前摸底题（5–8 道，尽量覆盖不同知识点） */
export function pickDiagnosticQuestions(chapterId: string): Question[] {
  const pool = builtinQuestions.filter((q) => q.chapterId === chapterId)
  if (pool.length === 0) return []

  const byKp = new Map<string, Question[]>()
  for (const q of pool) {
    const kpId = q.knowledgePointIds[0] ?? 'misc'
    if (!byKp.has(kpId)) byKp.set(kpId, [])
    byKp.get(kpId)!.push(q)
  }

  const picked: Question[] = []
  const kpOrder = shuffle([...byKp.keys()])
  for (const kpId of kpOrder) {
    if (picked.length >= MAX_COUNT) break
    const qs = shuffle(byKp.get(kpId)!)
    if (qs[0] && !picked.some((p) => p.id === qs[0].id)) picked.push(qs[0])
  }

  const remaining = shuffle(pool.filter((q) => !picked.some((p) => p.id === q.id)))
  for (const q of remaining) {
    if (picked.length >= MAX_COUNT) break
    picked.push(q)
  }

  const count = Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.min(TARGET_COUNT, pool.length)))
  return shuffle(picked).slice(0, Math.min(count, picked.length))
}

export function hasDiagnostic(state: AppState, chapterId: string): boolean {
  return Boolean(state.diagnostics[chapterId])
}

export function getDiagnostic(state: AppState, chapterId: string): DiagnosticResult | undefined {
  return state.diagnostics[chapterId]
}

export function buildDiagnosticResult(
  chapterId: string,
  answers: { questionId: string; correct: boolean }[]
): DiagnosticResult {
  const total = answers.length
  const correct = answers.filter((a) => a.correct).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  const wrongQids = new Set(answers.filter((a) => !a.correct).map((a) => a.questionId))
  const weakKpSet = new Set<string>()
  const weakTagSet = new Set<string>()

  for (const q of builtinQuestions) {
    if (!wrongQids.has(q.id) || q.chapterId !== chapterId) continue
    for (const kpId of q.knowledgePointIds) {
      weakKpSet.add(kpId)
      const kp = knowledgePoints.find((k) => k.id === kpId)
      kp?.tags.forEach((t) => weakTagSet.add(t))
    }
  }

  const chapterKps = knowledgePoints.filter((k) => k.chapterId === chapterId)
  const weakIds = [...weakKpSet]
  const strongIds = chapterKps.map((k) => k.id).filter((id) => !weakKpSet.has(id))

  const suggestedOrder = [
    ...weakIds,
    ...strongIds.filter((id) => !weakIds.includes(id)),
  ]

  if (suggestedOrder.length === 0) {
    suggestedOrder.push(...chapterKps.map((k) => k.id))
  }

  return {
    chapterId,
    completedAt: new Date().toISOString(),
    total,
    correct,
    accuracy,
    weakKnowledgePointIds: weakIds,
    weakTags: [...weakTagSet],
    suggestedOrder,
    answers,
  }
}

export function saveDiagnostic(state: AppState, result: DiagnosticResult): AppState {
  return {
    ...state,
    diagnostics: { ...state.diagnostics, [result.chapterId]: result },
    lastChapterId: result.chapterId,
  }
}

export function getChapterAccuracy(state: AppState, chapterId: string): number | null {
  const attempts = state.questionAttempts.filter((a) => a.chapterId === chapterId)
  if (attempts.length === 0) return null
  const correct = attempts.filter((a) => a.correct).length
  return Math.round((correct / attempts.length) * 100)
}

export function diagnosticStatusLabel(state: AppState, chapterId: string): string {
  const d = state.diagnostics[chapterId]
  if (!d) return '未摸底'
  return `已摸底 ${d.accuracy}%`
}
