import type { Question } from '../types'
import { knowledgePoints } from '../data/chapters'
import { pickExtraPracticeQuestions } from './extraPractice'

/** 从本章内置题库随机加练（非模板伪造题） */
export async function generateAIQuestions(
  kpIds: string[],
  count = 2,
  _options?: { apiKey?: string; endpoint?: string },
  chapterId?: string,
  excludeIds: string[] = []
): Promise<Question[]> {
  const ch =
    chapterId ?? knowledgePoints.find((k) => k.id === kpIds[0])?.chapterId ?? 'ch1'

  return pickExtraPracticeQuestions(ch, {
    count,
    knowledgePointIds: kpIds,
    excludeIds,
  })
}
