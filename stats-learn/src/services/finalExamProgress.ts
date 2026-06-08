import type { AppState } from '../types'
import type { FinalExamAttemptRecord, FinalExamPaper } from '../types/finalExam'
import { STORAGE_KEY, loadBackupState } from './storage'
import { loadExamDraft } from '../utils/finalExamExport'
import {
  buildResultRows,
  flattenPaperQuestions,
  type FinalExamResultRow,
} from '../utils/finalExamUtils'

export function createAttemptRecord(
  paper: FinalExamPaper,
  results: FinalExamResultRow[],
  elapsedMinutes: number
): FinalExamAttemptRecord {
  const objective = results.filter((r) => r.q.type !== 'calc')
  return {
    paperId: paper.id,
    paperTitle: paper.title,
    completedAt: new Date().toISOString(),
    elapsedMinutes,
    objectiveEarned: objective.reduce((s, r) => s + r.earned, 0),
    objectiveTotal: objective.reduce((s, r) => s + r.q.points, 0),
    correctCount: objective.filter((r) => r.correct === true).length,
    wrongCount: objective.filter((r) => r.correct === false).length,
    items: results.map((r) => ({
      questionId: r.q.id,
      userAnswer: r.userAnswer,
      correct: r.correct,
      earned: r.earned,
    })),
  }
}

export function resultsFromRecord(paper: FinalExamPaper, record: FinalExamAttemptRecord): FinalExamResultRow[] {
  const map = Object.fromEntries(record.items.map((i) => [i.questionId, i]))
  return flattenPaperQuestions(paper).map((q) => {
    const item = map[q.id]
    const ua = item?.userAnswer ?? ''
    if (q.type === 'calc') {
      return { q, userAnswer: ua, correct: null, earned: 0 }
    }
    const earned = item?.earned ?? 0
    const correct = item?.correct ?? false
    return { q, userAnswer: ua, correct, earned }
  })
}

export function saveFinalExamAttempt(
  state: AppState,
  paper: FinalExamPaper,
  answers: Record<string, string>,
  elapsedMinutes: number
): AppState {
  const questions = flattenPaperQuestions(paper)
  const results = buildResultRows(questions, answers)
  const record = createAttemptRecord(paper, results, elapsedMinutes)
  return {
    ...state,
    finalExamAttempts: {
      ...state.finalExamAttempts,
      [paper.id]: record,
    },
    sessions: [
      ...state.sessions,
      {
        id: `final-exam-${paper.id}-${Date.now()}`,
        startedAt: new Date(Date.now() - elapsedMinutes * 60000).toISOString(),
        endedAt: record.completedAt,
        type: 'exam',
        knowledgePointIds: [],
        questionIds: record.items.map((i) => i.questionId),
        correctCount: record.correctCount,
        totalCount: record.items.filter((i) => mapQuestionType(paper, i.questionId) !== 'calc').length,
        summary: `${paper.title} 客观题 ${record.objectiveEarned}/${record.objectiveTotal} 分`,
      },
    ],
  }
}

function mapQuestionType(paper: FinalExamPaper, qid: string) {
  for (const s of paper.sections) {
    const q = s.questions.find((x) => x.id === qid)
    if (q) return q.type
  }
  return 'single'
}

export function getFinalExamAttempt(state: AppState, paperId: string): FinalExamAttemptRecord | undefined {
  return state.finalExamAttempts[paperId]
}

function parseAttemptsFromJson(raw: string | null): Record<string, FinalExamAttemptRecord> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as { finalExamAttempts?: Record<string, FinalExamAttemptRecord>; state?: { finalExamAttempts?: Record<string, FinalExamAttemptRecord> } }
    return parsed.finalExamAttempts ?? parsed.state?.finalExamAttempts ?? {}
  } catch {
    return {}
  }
}

/** 从 localStorage / 作答草稿 / 备份里找回未同步的交卷记录 */
export function recoverMissingFinalExamAttempts(state: AppState, papers: FinalExamPaper[]): AppState {
  const merged: Record<string, FinalExamAttemptRecord> = { ...state.finalExamAttempts }
  let changed = false

  const fromMain = parseAttemptsFromJson(typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null)
  const backup = loadBackupState()
  const fromBackup = backup?.finalExamAttempts ?? {}

  for (const src of [fromMain, fromBackup]) {
    for (const [pid, rec] of Object.entries(src)) {
      if (rec?.paperId && !merged[pid]) {
        merged[pid] = rec
        changed = true
      }
    }
  }

  for (const paper of papers) {
    if (merged[paper.id]) continue
    const draft = loadExamDraft(paper.id)
    if (!draft) continue
    const questions = flattenPaperQuestions(paper)
    const answered = questions.filter((q) => (draft.answers[q.id] ?? '').trim()).length
    if (answered < Math.min(28, questions.length - 2)) continue
    const results = buildResultRows(questions, draft.answers)
    const mins = Math.max(1, Math.round((Date.now() - draft.startTime) / 60000))
    merged[paper.id] = createAttemptRecord(paper, results, mins)
    changed = true
  }

  if (!changed) return state
  return { ...state, finalExamAttempts: merged }
}

export function importFinalExamAttempt(state: AppState, record: FinalExamAttemptRecord): AppState {
  return {
    ...state,
    finalExamAttempts: {
      ...state.finalExamAttempts,
      [record.paperId]: record,
    },
  }
}
