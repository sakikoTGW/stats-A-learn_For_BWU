import type { AppState } from '../types'
import type { TodayFlowSession } from './todayFlow'
import { generateDailyPlan } from './plan'

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

/** 根据今日 flow 进度自动勾选对应计划项 */
export function applyFlowToDailyPlan(state: AppState, flow: TodayFlowSession): AppState {
  const date = todayKey()
  const base = state.dailyPlans[date] ?? generateDailyPlan(state)
  const ch = flow.chapterId

  const items = base.items.map((item) => {
    if (item.completed) return item

    if (flow.diagnosticDone && item.type === 'diagnostic' && item.chapterId === ch) {
      return { ...item, completed: true }
    }

    if (flow.learnDone && item.type === 'learn' && item.chapterId === ch) {
      return { ...item, completed: true }
    }

    if (
      flow.practiceCount >= flow.targetQuestionCount &&
      item.type === 'practice' &&
      item.chapterId === ch
    ) {
      return { ...item, completed: true }
    }

    if (flow.completed && item.type === 'summary') {
      return { ...item, completed: true }
    }

    return item
  })

  return {
    ...state,
    dailyPlans: {
      ...state.dailyPlans,
      [date]: { ...base, items },
    },
  }
}
