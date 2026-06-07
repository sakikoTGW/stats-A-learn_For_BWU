import type { Question } from '../types'

/** 简单字符串哈希，保证同一题每次打开选项顺序一致 */
function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function shuffleOrder(length: number, seed: string): number[] {
  const order = Array.from({ length }, (_, i) => i)
  let state = hashSeed(seed) || 1
  for (let i = length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const j = state % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

/** 展示前打乱选项，避免大量题库正确答案固定在 A */
export function prepareQuestionForDisplay(q: Question): Question {
  if (q.options.length <= 1) return q
  const order = shuffleOrder(q.options.length, q.id)
  const options = order.map((i) => q.options[i])
  const correctIndex = order.indexOf(q.correctIndex)
  if (correctIndex < 0) return q
  return { ...q, options, correctIndex }
}
