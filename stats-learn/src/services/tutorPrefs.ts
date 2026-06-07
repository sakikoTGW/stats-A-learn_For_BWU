import type { TutorMessage } from '../types'

const PREFS_KEY = 'stats-learn-tutor-prefs-v2'
const MESSAGES_KEY = 'stats-learn-tutor-messages-v1'
const LEGACY_PREFS_KEY = 'stats-learn-tutor-prefs-v1'
const MAX_MESSAGES = 100

export interface TutorPrefs {
  /** 学伴面板是否展开（跨页面、刷新后恢复） */
  preferOpen: boolean
  /** 半屏 / 小窗 */
  halfScreen: boolean
  /** 面板关闭时的未读条数 */
  unread: number
}

const defaults = (): TutorPrefs => ({
  preferOpen: false,
  halfScreen: false,
  unread: 0,
})

function migrateLegacyPrefs(): TutorPrefs | null {
  try {
    const raw = localStorage.getItem(LEGACY_PREFS_KEY)
    if (!raw) return null
    const old = JSON.parse(raw) as { preferOpen?: boolean; halfScreen?: boolean }
    const next: TutorPrefs = {
      preferOpen: old.preferOpen ?? false,
      halfScreen: old.halfScreen ?? false,
      unread: 0,
    }
    localStorage.setItem(PREFS_KEY, JSON.stringify(next))
    return next
  } catch {
    return null
  }
}

export function loadTutorPrefs(): TutorPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) {
      const migrated = migrateLegacyPrefs()
      return migrated ?? defaults()
    }
    return { ...defaults(), ...JSON.parse(raw) }
  } catch {
    return defaults()
  }
}

export function saveTutorPrefs(prefs: Partial<TutorPrefs>): TutorPrefs {
  const next = { ...loadTutorPrefs(), ...prefs }
  localStorage.setItem(PREFS_KEY, JSON.stringify(next))
  return next
}

export function loadTutorMessages(): TutorMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as TutorMessage[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function saveTutorMessages(messages: TutorMessage[]): void {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)))
}

export function clearTutorStorage(): void {
  localStorage.removeItem(MESSAGES_KEY)
  localStorage.removeItem(PREFS_KEY)
  localStorage.removeItem(LEGACY_PREFS_KEY)
}

export { PREFS_KEY, MESSAGES_KEY }
