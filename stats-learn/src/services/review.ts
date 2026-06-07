import type { KnowledgeProgress, KnowledgePoint } from '../types'

export function defaultProgress(kpId: string): KnowledgeProgress {
  return {
    knowledgePointId: kpId,
    mastery: 0,
    reviewIntervalDays: 1,
    easeFactor: 2.5,
    repetitions: 0,
  }
}

/** 简化 SM-2：根据掌握度反馈更新复习间隔 */
export function scheduleReview(
  prog: KnowledgeProgress,
  quality: number
): KnowledgeProgress {
  const q = Math.max(0, Math.min(5, quality))
  let { easeFactor, repetitions, reviewIntervalDays } = prog

  if (q < 3) {
    repetitions = 0
    reviewIntervalDays = 1
  } else {
    repetitions += 1
    if (repetitions === 1) reviewIntervalDays = 1
    else if (repetitions === 2) reviewIntervalDays = 3
    else reviewIntervalDays = Math.round(reviewIntervalDays * easeFactor)
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    )
  }

  const next = new Date()
  next.setDate(next.getDate() + reviewIntervalDays)

  return {
    ...prog,
    easeFactor,
    repetitions,
    reviewIntervalDays,
    nextReviewAt: next.toISOString(),
    lastStudiedAt: new Date().toISOString(),
  }
}

export function getDueKnowledgePoints(
  all: KnowledgePoint[],
  progress: Record<string, KnowledgeProgress>
): KnowledgePoint[] {
  const now = Date.now()
  return all.filter((kp) => {
    const p = progress[kp.id]
    if (!p || p.mastery < 2) return true
    if (!p.nextReviewAt) return true
    return new Date(p.nextReviewAt).getTime() <= now
  })
}
