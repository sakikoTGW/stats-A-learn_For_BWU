export type MasteryLevel = 0 | 1 | 2 | 3 | 4 // 未学→精通

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Chapter {
  id: string
  title: string
  order: number
}

export interface KnowledgePoint {
  id: string
  chapterId: string
  title: string
  plainExplanation: string
  keyPoints: string[]
  analogy?: string
  mnemonic?: string
  tags: string[]
}

export interface Question {
  id: string
  chapterId: string
  knowledgePointIds: string[]
  difficulty: Difficulty
  stem: string
  options: string[]
  correctIndex: number
  explanation: string
  source?: 'builtin' | 'imported' | 'ai'
}

export interface KnowledgeProgress {
  knowledgePointId: string
  mastery: MasteryLevel
  lastStudiedAt?: string
  nextReviewAt?: string
  reviewIntervalDays: number
  easeFactor: number
  repetitions: number
}

export interface QuestionAttempt {
  questionId: string
  correct: boolean
  timeMs: number
  answeredAt: string
  chapterId: string
}

export type StudyIntensity = 'light' | 'standard' | 'sprint'

export interface StudySession {
  id: string
  startedAt: string
  endedAt?: string
  type: 'learn' | 'practice' | 'review' | 'mixed' | 'diagnostic' | 'retest' | 'exam'
  knowledgePointIds: string[]
  questionIds: string[]
  correctCount: number
  totalCount: number
  summary?: string
}

export interface DailyPlanItem {
  id: string
  type: 'diagnostic' | 'learn' | 'practice' | 'review' | 'summary'
  title: string
  description: string
  targetId?: string
  chapterId?: string
  priority: number
  completed: boolean
}

export interface DailyPlan {
  date: string
  items: DailyPlanItem[]
  generatedAt: string
}

export type NoteSource = 'learn' | 'practice' | 'review' | 'mixed'

export interface StudyNote {
  id: string
  title: string
  chapterId: string
  chapterTitle: string
  source: NoteSource
  knowledgePointIds: string[]
  questionIds: string[]
  createdAt: string
  markdown: string
}

export interface NoteGenerateContext {
  source: NoteSource
  chapterId: string
  knowledgePointIds: string[]
  questionIds: string[]
  sessionSummary?: string
}

/** 章节课前摸底结果 */
export interface DiagnosticResult {
  chapterId: string
  completedAt: string
  total: number
  correct: number
  accuracy: number
  weakKnowledgePointIds: string[]
  weakTags: string[]
  suggestedOrder: string[]
  answers: { questionId: string; correct: boolean }[]
}

export interface TutorMessage {
  id: string
  role: 'tutor' | 'user'
  text: string
  createdAt: string
}

export interface AppState {
  knowledgeProgress: Record<string, KnowledgeProgress>
  questionAttempts: QuestionAttempt[]
  wrongQuestionIds: string[]
  sessions: StudySession[]
  dailyPlans: Record<string, DailyPlan>
  customQuestions: Question[]
  studyNotes: StudyNote[]
  diagnostics: Record<string, DiagnosticResult>
  settings: {
    dailyGoalMinutes: number
    studyIntensity?: StudyIntensity
    llmApiKey?: string
    llmEndpoint?: string
    llmModel?: string
    onboardingDone?: boolean
  }
  lastActiveDate?: string
  lastChapterId?: string
}

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  0: '未学',
  1: '了解',
  2: '理解',
  3: '熟练',
  4: '精通',
}
