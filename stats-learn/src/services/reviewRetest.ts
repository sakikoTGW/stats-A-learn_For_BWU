import { builtinQuestions } from '../data/questions'
import { knowledgePoints } from '../data/chapters'
import { getDueKnowledgePoints } from './review'
import type { AppState, Question } from '../types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 复习页「再测」：到期 KP 关联题 + 错题池，混合难度，5–10 题 */
export function pickRetestQuestions(state: AppState, count = 8): Question[] {
  const n = Math.min(10, Math.max(5, count))
  const due = getDueKnowledgePoints(knowledgePoints, state.knowledgeProgress)
  const dueKpIds = new Set(due.map((k) => k.id))

  const duePool = shuffle(
    builtinQuestions.filter((q) => q.knowledgePointIds.some((id) => dueKpIds.has(id)))
  )
  const wrongPool = shuffle(
    builtinQuestions.filter((q) => state.wrongQuestionIds.includes(q.id))
  )
  const all = shuffle(builtinQuestions)

  const picked: Question[] = []
  const used = new Set<string>()

  const take = (pool: Question[], max: number) => {
    for (const q of pool) {
      if (picked.length >= n || picked.length >= max) break
      if (used.has(q.id)) continue
      used.add(q.id)
      picked.push(q)
    }
  }

  take(duePool, Math.ceil(n * 0.55))
  take(wrongPool, Math.ceil(n * 0.4))
  take(all, n)

  return shuffle(picked).slice(0, n)
}
