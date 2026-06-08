import type { FinalExamPaper, FinalExamQuestion } from '../types/finalExam'
import { TYPE_LABEL, formatDisplayAnswer, questionGlobalIndex } from './finalExamUtils'
import type { FinalExamResultRow } from './finalExamUtils'

export type FinalExamExportMode = 'exam' | 'answer' | 'review' | 'wrong'

function formatOptions(q: FinalExamQuestion): string {
  if (!q.options?.length) return ''
  return q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')
}

function formatOneQuestion(
  q: FinalExamQuestion,
  num: number,
  mode: FinalExamExportMode,
  row?: FinalExamResultRow
): string {
  const lines: string[] = []
  lines.push(`### ${num}. [${TYPE_LABEL[q.type]}·${q.points}分] ${q.stem}`)

  if (q.type === 'single' || q.type === 'multi') {
    const opts = formatOptions(q)
    if (opts) lines.push(opts)
  } else if (q.type === 'judge') {
    lines.push('（判断：对 / 错）')
  } else if (q.type === 'fill') {
    lines.push('（填空）')
  }

  if (mode === 'exam') return lines.join('\n')

  if (mode === 'review' || mode === 'wrong') {
    if (row) {
      lines.push(`【你的答案】${formatDisplayAnswer(q, row.userAnswer)}`)
      if (row.correct === true) lines.push('【结果】正确')
      if (row.correct === false) lines.push('【结果】错误')
    }
  }

  lines.push(`【参考答案】${q.type === 'multi' ? q.answer.split('').join('、') : q.answer}`)
  lines.push(`【解析】${q.explanation}`)
  if (q.rubric) lines.push(`【评分要点】${q.rubric}`)
  lines.push(`【知识点】${q.knowledgePointIds.join('、')} · ${q.chapterId}`)

  return lines.join('\n')
}

export function formatPaperForAi(
  paper: FinalExamPaper,
  mode: FinalExamExportMode,
  results?: FinalExamResultRow[]
): string {
  const header = [
    `# ${paper.title}`,
    `> ${paper.subtitle}`,
    `> 侧重：${paper.focus}`,
    '',
    mode === 'exam'
      ? '以下为题目（不含答案），可复制给 AI 请其出题讲解或模拟作答。'
      : mode === 'answer'
        ? '以下为题目 + 参考答案 + 解析，可复制给 AI 逐题讲解。'
        : mode === 'wrong'
          ? '以下为你的错题 + 参考答案，可复制给 AI 针对性补漏。'
          : '以下为你的作答复盘，可复制给 AI 分析薄弱点。',
    '',
    '---',
    '',
  ].join('\n')

  const blocks: string[] = [header]

  for (const section of paper.sections) {
    blocks.push(`## ${section.title}`, '')
    if (section.instruction) blocks.push(`> ${section.instruction}`, '')

    section.questions.forEach((q) => {
      const num = questionGlobalIndex(paper, q.id)
      const row = results?.find((r) => r.q.id === q.id)
      if (mode === 'wrong') {
        if (q.type === 'calc') return
        if (row?.correct !== false) return
      }
      blocks.push(formatOneQuestion(q, num, mode, row))
      blocks.push('')
    })
  }

  if (mode === 'review' && results) {
    const objective = results.filter((r) => r.q.type !== 'calc')
    const earned = objective.reduce((s, r) => s + r.earned, 0)
    const total = objective.reduce((s, r) => s + r.q.points, 0)
    const wrong = objective.filter((r) => r.correct === false).length
    blocks.push(
      '---',
      '',
      `【交卷摘要】客观题 ${earned}/${total} 分；错题 ${wrong} 道；计算题 3 道请对照上文评分要点自评。`
    )
  }

  return blocks.join('\n').trim() + '\n'
}

export function formatAllPapersAnswerKey(papers: FinalExamPaper[]): string {
  return papers.map((p) => formatPaperForAi(p, 'answer')).join('\n\n==========\n\n')
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }
}

export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** 作答草稿 key（自动保存，防止刷新丢失） */
export function draftKey(paperId: string) {
  return `stats-learn-final-exam-draft-${paperId}`
}

export function loadExamDraft(paperId: string): {
  answers: Record<string, string>
  submitted: Record<string, boolean>
  qi: number
  startTime: number
} | null {
  try {
    const raw = localStorage.getItem(draftKey(paperId))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveExamDraft(
  paperId: string,
  data: { answers: Record<string, string>; submitted: Record<string, boolean>; qi: number; startTime: number }
) {
  localStorage.setItem(draftKey(paperId), JSON.stringify(data))
}

export function clearExamDraft(paperId: string) {
  localStorage.removeItem(draftKey(paperId))
}
