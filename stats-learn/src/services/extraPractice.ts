import type { Question } from '../types'
import { builtinQuestions } from '../data/questions'

/** 从本章内置题库抽加练题，不用模板伪造「AI 题」 */
export function pickExtraPracticeQuestions(
  chapterId: string,
  options: {
    count?: number
    excludeIds?: string[]
    knowledgePointIds?: string[]
  } = {}
): Question[] {
  const { count = 3, excludeIds = [], knowledgePointIds = [] } = options
  const exclude = new Set(excludeIds)

  let pool = builtinQuestions.filter(
    (q) => q.chapterId === chapterId && !exclude.has(q.id) && q.source !== 'ai'
  )

  if (knowledgePointIds.length > 0) {
    const related = pool.filter((q) =>
      q.knowledgePointIds.some((id) => knowledgePointIds.includes(id))
    )
    if (related.length >= count) pool = related
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
