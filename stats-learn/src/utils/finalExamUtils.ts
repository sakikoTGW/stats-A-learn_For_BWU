import type { FinalExamPaper, FinalExamQuestion, FinalExamQType } from '../types/finalExam'

export const TYPE_LABEL: Record<FinalExamQType, string> = {
  single: '单选题',
  multi: '多选题',
  judge: '判断题',
  fill: '填空题',
  calc: '计算题',
}

export const TYPE_HINT: Record<FinalExamQType, string> = {
  single: '四选一',
  multi: '至少选两项（勾选多个字母）',
  judge: '判断对 / 错',
  fill: '在输入框填写答案',
  calc: '在纸上计算，再点「查看解析」',
}

export type FinalExamResultRow = {
  q: FinalExamQuestion
  userAnswer: string
  correct: boolean | null
  earned: number
}

export function normalizeAnswer(s: string): string {
  return s
    .replace(/\s+/g, '')
    .replace(/，/g, ',')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .toLowerCase()
}

export function checkAnswer(q: FinalExamQuestion, user: string): boolean {
  const u = normalizeAnswer(user)
  const a = normalizeAnswer(q.answer)
  if (q.type === 'multi') {
    const sort = (x: string) => [...x.replace(/[^a-e]/gi, '')].sort().join('').toUpperCase()
    return sort(u) === sort(a)
  }
  if (q.type === 'fill') {
    if (u === a) return true
    const alts = a.split(/[|/]/).map(normalizeAnswer)
    return alts.some((alt) => u === alt || u.includes(alt) || alt.includes(u))
  }
  return u === a
}

export function formatDisplayAnswer(q: FinalExamQuestion, raw: string): string {
  if (!raw.trim()) return '（未作答）'
  if (q.type === 'multi') {
    return raw
      .replace(/[^A-E]/gi, '')
      .split('')
      .join('、')
  }
  return raw
}

export function questionGlobalIndex(paper: FinalExamPaper, qid: string): number {
  let n = 0
  for (const s of paper.sections) {
    for (const item of s.questions) {
      n++
      if (item.id === qid) return n
    }
  }
  return 0
}

export function buildResultRows(
  questions: FinalExamQuestion[],
  answers: Record<string, string>
): FinalExamResultRow[] {
  return questions.map((item) => {
    const ua = answers[item.id] ?? ''
    if (item.type === 'calc') {
      return { q: item, userAnswer: ua, correct: null, earned: 0 }
    }
    const ok = ua ? checkAnswer(item, ua) : false
    return { q: item, userAnswer: ua, correct: ok, earned: ok ? item.points : 0 }
  })
}

export function flattenPaperQuestions(paper: FinalExamPaper): FinalExamQuestion[] {
  return paper.sections.flatMap((s) => s.questions)
}
