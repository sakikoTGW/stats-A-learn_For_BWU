import { builtinQuestions } from '../data/questions'
import { knowledgePoints } from '../data/chapters'
import type { AppState, Question } from '../types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 章节期末卷：15–20 题，混合难度 */
export function pickChapterExamQuestions(
  chapterId: string,
  state: AppState,
  count = 18
): Question[] {
  const all = shuffle(
    [...builtinQuestions, ...state.customQuestions].filter((q) => q.chapterId === chapterId)
  )
  const target = Math.min(count, all.length)
  const easy = all.filter((q) => q.difficulty === 'easy')
  const medium = all.filter((q) => q.difficulty === 'medium')
  const hard = all.filter((q) => q.difficulty === 'hard')
  const easyN = Math.round(target * 0.4)
  const hardN = Math.round(target * 0.2)
  const mediumN = target - easyN - hardN
  const picked: Question[] = []
  const used = new Set<string>()
  const pull = (pool: Question[], n: number) => {
    for (const q of pool) {
      if (picked.length >= target) break
      if (picked.filter((x) => x.difficulty === q.difficulty).length >= n) continue
      if (used.has(q.id)) continue
      used.add(q.id)
      picked.push(q)
    }
  }
  pull(easy, easyN)
  pull(medium, mediumN)
  pull(hard, hardN)
  for (const q of all) {
    if (picked.length >= target) break
    if (!used.has(q.id)) {
      used.add(q.id)
      picked.push(q)
    }
  }
  return shuffle(picked)
}

export function weakKpIdsFromExam(
  chapterId: string,
  answers: { questionId: string; correct: boolean }[]
): string[] {
  const wrongQids = new Set(answers.filter((a) => !a.correct).map((a) => a.questionId))
  const kpScores = new Map<string, { wrong: number; total: number }>()

  for (const q of builtinQuestions) {
    if (q.chapterId !== chapterId) continue
    for (const kpId of q.knowledgePointIds) {
      const cur = kpScores.get(kpId) ?? { wrong: 0, total: 0 }
      cur.total++
      if (wrongQids.has(q.id)) cur.wrong++
      kpScores.set(kpId, cur)
    }
  }

  return [...kpScores.entries()]
    .filter(([, s]) => s.wrong > 0)
    .sort((a, b) => b[1].wrong / Math.max(1, b[1].total) - a[1].wrong / Math.max(1, a[1].total))
    .map(([id]) => id)
    .slice(0, 5)
}

export function weakKpTitles(ids: string[]): string[] {
  return ids
    .map((id) => knowledgePoints.find((k) => k.id === id)?.title)
    .filter(Boolean) as string[]
}
