const STREAK_KEY = 'stats-learn-streak-v1'

export interface StreakData {
  count: number
  lastDate: string
}

export function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    if (!raw) return { count: 0, lastDate: '' }
    return JSON.parse(raw) as StreakData
  } catch {
    return { count: 0, lastDate: '' }
  }
}

function saveStreak(data: StreakData): void {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

/** 完成今日一键流程时调用，更新连续学习天数 */
export function recordStudyDay(): StreakData {
  const today = todayKey()
  const prev = loadStreak()
  if (prev.lastDate === today) return prev

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yKey = yesterday.toISOString().slice(0, 10)

  const count = prev.lastDate === yKey ? prev.count + 1 : 1
  const next = { count, lastDate: today }
  saveStreak(next)
  return next
}

export function streakLabel(): string {
  const { count, lastDate } = loadStreak()
  if (lastDate !== todayKey() || count === 0) return '今日还未打卡'
  return `连续学习 ${count} 天`
}
