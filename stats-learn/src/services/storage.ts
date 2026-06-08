import type { AppState } from '../types'

export const STORAGE_KEY = 'stats-learn-state-v1'
const BACKUP_KEY = 'stats-learn-state-backup-v1'

const defaultState = (): AppState => ({
  knowledgeProgress: {},
  questionAttempts: [],
  wrongQuestionIds: [],
  sessions: [],
  dailyPlans: {},
  customQuestions: [],
  studyNotes: [],
  diagnostics: {},
  finalExamAttempts: {},
  settings: { dailyGoalMinutes: 30, studyIntensity: 'standard' },
})

export interface StateSummary {
  knowledgePointCount: number
  questionAttemptCount: number
  wrongCount: number
  diagnosticCount: number
  noteCount: number
  lastChapterId?: string
  storageBytes: number
  hasBackup: boolean
  backupBytes: number
}

function normalizeParsed(parsed: Partial<AppState>): AppState {
  return {
    ...defaultState(),
    ...parsed,
    settings: { ...defaultState().settings, ...parsed.settings },
    studyNotes: parsed.studyNotes ?? [],
    diagnostics: parsed.diagnostics ?? {},
    finalExamAttempts: parsed.finalExamAttempts ?? {},
  }
}

export function summarizeState(state: AppState): Omit<
  StateSummary,
  'storageBytes' | 'hasBackup' | 'backupBytes'
> {
  return {
    knowledgePointCount: Object.keys(state.knowledgeProgress).length,
    questionAttemptCount: state.questionAttempts.length,
    wrongCount: state.wrongQuestionIds.length,
    diagnosticCount: Object.keys(state.diagnostics).length,
    noteCount: state.studyNotes.length,
    lastChapterId: state.lastChapterId,
  }
}

export function getStorageSummary(): StateSummary {
  const raw = localStorage.getItem(STORAGE_KEY) ?? ''
  const backup = localStorage.getItem(BACKUP_KEY) ?? ''
  let parsed: AppState
  try {
    parsed = raw ? normalizeParsed(JSON.parse(raw)) : defaultState()
  } catch {
    parsed = defaultState()
  }
  return {
    ...summarizeState(parsed),
    storageBytes: raw.length,
    hasBackup: backup.length > 200,
    backupBytes: backup.length,
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return normalizeParsed(JSON.parse(raw) as Partial<AppState>)
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  try {
    const prev = localStorage.getItem(STORAGE_KEY)
    const next = JSON.stringify(state)
    if (prev && prev.length > 200 && prev !== next) {
      localStorage.setItem(BACKUP_KEY, prev)
    }
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

export function exportStateJson(state?: AppState): string {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    state: state ?? loadState(),
  }
  return JSON.stringify(payload, null, 2)
}

export function importStateJson(json: string, mode: 'replace' | 'merge' = 'replace'): AppState {
  const parsed = JSON.parse(json) as { state?: Partial<AppState> } | Partial<AppState>
  const incoming = normalizeParsed(('state' in parsed && parsed.state ? parsed.state : parsed) as Partial<AppState>)

  if (mode === 'replace') {
    saveState(incoming)
    return incoming
  }

  const current = loadState()
  const merged: AppState = {
    ...current,
    knowledgeProgress: { ...current.knowledgeProgress, ...incoming.knowledgeProgress },
    questionAttempts: [...current.questionAttempts, ...incoming.questionAttempts],
    wrongQuestionIds: [...new Set([...current.wrongQuestionIds, ...incoming.wrongQuestionIds])],
    sessions: [...current.sessions, ...incoming.sessions],
    dailyPlans: { ...current.dailyPlans, ...incoming.dailyPlans },
    customQuestions: [...current.customQuestions, ...incoming.customQuestions],
    studyNotes: [...incoming.studyNotes, ...current.studyNotes],
    diagnostics: { ...current.diagnostics, ...incoming.diagnostics },
    finalExamAttempts: { ...current.finalExamAttempts, ...incoming.finalExamAttempts },
    settings: { ...current.settings, ...incoming.settings },
    lastChapterId: incoming.lastChapterId ?? current.lastChapterId,
    lastActiveDate: incoming.lastActiveDate ?? current.lastActiveDate,
  }
  saveState(merged)
  return merged
}

export function loadBackupState(): AppState | null {
  try {
    const raw = localStorage.getItem(BACKUP_KEY)
    if (!raw) return null
    return normalizeParsed(JSON.parse(raw) as Partial<AppState>)
  } catch {
    return null
  }
}

export function restoreFromBackup(): AppState | null {
  const backup = loadBackupState()
  if (!backup) return null
  saveState(backup)
  return backup
}

export function updateState(updater: (s: AppState) => AppState): AppState {
  const next = updater(loadState())
  saveState(next)
  return next
}
