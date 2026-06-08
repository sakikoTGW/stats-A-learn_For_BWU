import { builtinQuestions } from '../data/questions'

export function countQuestionsForKp(kpId: string): number {
  return builtinQuestions.filter((q) => q.knowledgePointIds.includes(kpId)).length
}

export function countQuestionsForChapter(chapterId: string): number {
  return builtinQuestions.filter((q) => q.chapterId === chapterId).length
}
