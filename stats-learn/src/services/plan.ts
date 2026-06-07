import type { AppState, DailyPlan, DailyPlanItem } from '../types'
import { chapters } from '../data/chapters'
import { knowledgePoints } from '../data/chapters'
import { builtinQuestions } from '../data/questions'
import { getDueKnowledgePoints } from './review'
import { hasDiagnostic, getDiagnostic } from './diagnostic'

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function generateDailyPlan(state: AppState): DailyPlan {
  const date = todayKey()
  const due = getDueKnowledgePoints(knowledgePoints, state.knowledgeProgress)
  const weakChapters = new Set(
    state.wrongQuestionIds
      .map((qid) => builtinQuestions.find((q) => q.id === qid)?.chapterId)
      .filter(Boolean) as string[]
  )

  const items: DailyPlanItem[] = []
  let priority = 100

  const activeChapter = state.lastChapterId ?? chapters[0].id
  if (!hasDiagnostic(state, activeChapter)) {
    const chTitle = chapters.find((c) => c.id === activeChapter)?.title ?? ''
    items.push({
      id: `diagnostic-${activeChapter}`,
      type: 'diagnostic',
      title: `学前摸底：${chTitle}`,
      description: '先摸底再学习，学伴会按薄弱点推荐顺序',
      chapterId: activeChapter,
      priority: priority--,
      completed: false,
    })
  }

  if (due.length > 0) {
    items.push({
      id: `review-${date}`,
      type: 'review',
      title: '复习到期知识点',
      description: `共 ${due.length} 个知识点待复习（遗忘曲线）`,
      priority: priority--,
      completed: false,
    })
  }

  const diag = getDiagnostic(state, activeChapter)
  const learnTarget = diag?.suggestedOrder[0]
    ? knowledgePoints.find((k) => k.id === diag.suggestedOrder[0])
    : knowledgePoints.find(
        (kp) =>
          kp.chapterId === activeChapter && (state.knowledgeProgress[kp.id]?.mastery ?? 0) < 2
      )

  if (learnTarget) {
    items.push({
      id: `learn-${learnTarget.id}`,
      type: 'learn',
      title: diag?.weakKnowledgePointIds.includes(learnTarget.id)
        ? `优先学习：${learnTarget.title}`
        : `学习：${learnTarget.title}`,
      description: chapters.find((c) => c.id === learnTarget.chapterId)?.title ?? '',
      targetId: learnTarget.id,
      chapterId: learnTarget.chapterId,
      priority: priority--,
      completed: false,
    })
  } else {
    const unlearned = knowledgePoints.filter(
      (kp) => (state.knowledgeProgress[kp.id]?.mastery ?? 0) < 2
    )
    if (unlearned.length > 0) {
      const kp = unlearned[0]
      items.push({
        id: `learn-${kp.id}`,
        type: 'learn',
        title: `学习：${kp.title}`,
        description: chapters.find((c) => c.id === kp.chapterId)?.title ?? '',
        targetId: kp.id,
        chapterId: kp.chapterId,
        priority: priority--,
        completed: false,
      })
    }
  }

  const practiceChapter =
    diag?.chapterId ??
    ([...weakChapters][0] ?? chapters[Math.floor(Math.random() * chapters.length)].id)
  const chTitle = chapters.find((c) => c.id === practiceChapter)?.title ?? ''
  items.push({
    id: `practice-${practiceChapter}`,
    type: 'practice',
    title: '章节刷题',
    description: weakChapters.size
      ? `薄弱章节强化：${chTitle}`
      : `巩固练习：${chTitle}`,
    chapterId: practiceChapter,
    priority: priority--,
    completed: false,
  })

  items.push({
    id: `summary-${date}`,
    type: 'summary',
    title: '今日学习小结',
    description: '回顾今日进度并生成笔记',
    priority: priority--,
    completed: false,
  })

  return { date, items, generatedAt: new Date().toISOString() }
}

export function ensureTodayPlan(state: AppState): AppState {
  const date = todayKey()
  if (state.dailyPlans[date]) return state
  return {
    ...state,
    dailyPlans: { ...state.dailyPlans, [date]: generateDailyPlan(state) },
  }
}
