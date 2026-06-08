/** 期末模拟卷题型 */
export type FinalExamQType = 'single' | 'multi' | 'judge' | 'fill' | 'calc'

export interface FinalExamQuestion {
  id: string
  type: FinalExamQType
  /** 题干（计算题可含小问 a/b/c） */
  stem: string
  options?: string[]
  /** 单选/判断：A/B/对/错；多选：ABC；填空：标准答案；计算：要点或数值 */
  answer: string
  explanation: string
  knowledgePointIds: string[]
  chapterId: string
  points: number
  /** 计算题评分要点 */
  rubric?: string
}

export interface FinalExamSection {
  title: string
  instruction?: string
  questions: FinalExamQuestion[]
}

export interface FinalExamPaper {
  id: string
  title: string
  subtitle: string
  focus: string
  durationMinutes: number
  totalPoints: number
  sections: FinalExamSection[]
}

export interface FinalExamAttemptAnswer {
  questionId: string
  userAnswer: string
  correct: boolean
  pointsEarned: number
}

/** 交卷记录（localStorage 持久化） */
export interface FinalExamAttemptRecord {
  paperId: string
  paperTitle: string
  completedAt: string
  elapsedMinutes: number
  objectiveEarned: number
  objectiveTotal: number
  correctCount: number
  wrongCount: number
  items: {
    questionId: string
    userAnswer: string
    correct: boolean | null
    earned: number
  }[]
}
