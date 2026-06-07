import type { NoteGenerateContext, StudyNote, Question } from '../types'
import { chapters, knowledgePoints } from '../data/chapters'
import { builtinQuestions } from '../data/questions'
import { loadState } from './storage'

const FORMULA_HINTS: Record<string, string[]> = {
  'kp2-8': ['组距=上限−下限', '组中值=(下限+上限)/2'],
  'kp4-5': ['计划完成程度=实际/计划×100%'],
  'kp4-6': ['结构相对数=部分/总体×100%'],
  'kp4-7': ['比例相对数=部分/部分'],
  'kp4-8': ['比较相对数=甲地区/乙地区'],
  'kp4-9': ['强度相对数=总量/总量（如人均GDP）'],
  'kp5-2': ['算术平均数：x̄ = Σx / n', 'Σ(x−x̄)=0'],
  'kp5-3': ['加权平均：x̄ = Σ(x·f) / Σf'],
  'kp5-5': ['调和平均：H = n / Σ(1/x)'],
  'kp5-6': ['几何平均：ⁿ√(x₁·x₂·…·xₙ)'],
  'kp6-1': ['极差 R = max − min', 'IQR = Q3 − Q1'],
  'kp6-3': ['总体方差 σ²=Σ(x−x̄)²/n', 'σ=√σ²'],
  'kp6-4': ['样本标准差分母 n−1'],
  'kp6-6': ['0-1 方差 σ²=p(1−p)'],
  'kp6-7': ['离散系数 V = σ / x̄'],
}

const COMMON_MISTAKES: Record<string, string[]> = {
  'kp1-5': ['把描述统计与推断统计混为一谈'],
  'kp1-7': ['把品质标志的编码数字当成真正的计量'],
  'kp2-1': ['混淆普查与抽样'],
  'kp2-8': ['组界归属错误（如80分计入哪一组）'],
  'kp2-9': ['把登记误差当成抽样误差'],
  'kp3-5': ['连续数据用条形图代替直方图'],
  'kp3-6': ['饼图类别过多', '折线图误用于无时间顺序的分类'],
  'kp3-8': ['统计表缺单位或合计', '截断坐标轴误导'],
  'kp4-2': ['混淆时期指标与时点指标'],
  'kp4-6': ['结构相对数分母不是总体'],
  'kp4-10': ['只写相对数不写绝对数'],
  'kp5-2': ['算术平均数受极端值影响仍用于偏态代表'],
  'kp5-6': ['增长率简单算术平均（应几何平均）'],
  'kp5-5': ['平均速度用算术平均（应调和平均）'],
  'kp5-9': ['偏态分布仍只报算术平均'],
  'kp6-4': ['样本标准差仍用分母 n'],
  'kp6-7': ['不同量纲直接比标准差（应比离散系数）'],
  'kp6-6': ['0-1 方差公式记错'],
}

function allQuestions(): Question[] {
  const s = loadState()
  return [...builtinQuestions, ...s.customQuestions]
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })
}

function sourceLabel(source: NoteGenerateContext['source']): string {
  const map = {
    learn: '知识点学习',
    practice: '刷题练习',
    review: '复习巩固',
    mixed: '综合学习',
  }
  return map[source]
}

/** 模板拼装 Markdown 笔记（无 LLM） */
export function generateNoteMarkdown(ctx: NoteGenerateContext): string {
  const state = loadState()
  const chapter = chapters.find((c) => c.id === ctx.chapterId)
  const kps = knowledgePoints.filter((kp) => ctx.knowledgePointIds.includes(kp.id))
  const questions = allQuestions().filter((q) => ctx.questionIds.includes(q.id))

  const wrongAttempts = state.questionAttempts.filter(
    (a) => ctx.questionIds.includes(a.questionId) && !a.correct
  )
  const wrongIds = new Set([
    ...wrongAttempts.map((a) => a.questionId),
    ...state.wrongQuestionIds.filter((id) => ctx.questionIds.includes(id)),
  ])

  const lines: string[] = []
  const title = `${chapter?.title ?? '统计学习'} · ${sourceLabel(ctx.source)}笔记`
  lines.push(`# ${title}`)
  lines.push('')
  lines.push(`> 生成时间：${formatDate(new Date().toISOString())}`)
  lines.push(`> 来源：${sourceLabel(ctx.source)}`)
  lines.push('')

  lines.push('## 本节要点')
  if (kps.length === 0) {
    lines.push('- （本节暂无关联知识点，建议先完成学习）')
  } else {
    for (const kp of kps) {
      lines.push(`### ${kp.title}`)
      for (const p of kp.keyPoints) lines.push(`- ${p}`)
      lines.push('')
    }
  }

  lines.push('## 通俗解释摘要')
  if (kps.length === 0) {
    lines.push('_暂无_')
  } else {
    for (const kp of kps) {
      lines.push(`**${kp.title}**：${kp.plainExplanation}`)
      if (kp.analogy) lines.push(`- 类比：${kp.analogy}`)
      if (kp.mnemonic) lines.push(`- 口诀：${kp.mnemonic}`)
      lines.push('')
    }
  }

  lines.push('## 易错点提醒')
  const mistakes = new Set<string>()
  for (const kp of kps) {
    for (const m of COMMON_MISTAKES[kp.id] ?? []) mistakes.add(m)
  }
  for (const q of questions) {
    if (wrongIds.has(q.id)) mistakes.add(`「${q.stem.slice(0, 30)}…」→ ${q.explanation}`)
  }
  if (mistakes.size === 0) {
    lines.push('- 本节暂无记录错题，继续保持！')
  } else {
    for (const m of mistakes) lines.push(`- ⚠️ ${m}`)
  }
  lines.push('')

  lines.push('## 相关公式与概念')
  const formulas = new Set<string>()
  for (const kp of kps) {
    for (const f of FORMULA_HINTS[kp.id] ?? []) formulas.add(f)
    for (const t of kp.tags) formulas.add(`概念：${t}`)
  }
  if (formulas.size === 0) lines.push('- 见各章教材定义')
  else for (const f of formulas) lines.push(`- ${f}`)
  lines.push('')

  lines.push('## 个人错题摘录')
  const wrongQs = questions.filter((q) => wrongIds.has(q.id))
  if (wrongQs.length === 0) {
    lines.push('- 本次无错题记录 🎉')
  } else {
    for (const q of wrongQs) {
      lines.push(`### ${q.stem}`)
      lines.push(
        `- 你的易混项：${q.options.filter((_, i) => i !== q.correctIndex).slice(0, 2).join(' / ')}`
      )
      lines.push(`- **正确答案**：${q.options[q.correctIndex]}`)
      lines.push(`- 解析：${q.explanation}`)
      lines.push('')
    }
  }

  if (ctx.sessionSummary) {
    lines.push('## 学习小结')
    lines.push(ctx.sessionSummary)
    lines.push('')
  }

  lines.push('---')
  lines.push('*由统计课学习助手自动生成（模板模式）*')
  return lines.join('\n')
}

export function createStudyNote(ctx: NoteGenerateContext): StudyNote {
  const chapter = chapters.find((c) => c.id === ctx.chapterId)
  const markdown = generateNoteMarkdown(ctx)
  const title = `${chapter?.title ?? '学习'} · ${sourceLabel(ctx.source)} · ${new Date().toLocaleDateString('zh-CN')}`

  return {
    id: `note-${Date.now()}`,
    title,
    chapterId: ctx.chapterId,
    chapterTitle: chapter?.title ?? '',
    source: ctx.source,
    knowledgePointIds: ctx.knowledgePointIds,
    questionIds: ctx.questionIds,
    createdAt: new Date().toISOString(),
    markdown,
  }
}

export function downloadMarkdown(note: StudyNote): void {
  const blob = new Blob([note.markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${note.title.replace(/[\\/:*?"<>|]/g, '_')}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyMarkdown(markdown: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(markdown)
    return true
  } catch {
    return false
  }
}

export function getRecentWrongForChapter(chapterId: string) {
  const state = loadState()
  return state.questionAttempts
    .filter((a) => a.chapterId === chapterId && !a.correct)
    .slice(-10)
}
