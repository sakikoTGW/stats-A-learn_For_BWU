import { chapters, knowledgePoints } from '../data/chapters'
import { builtinQuestions } from '../data/questions'
import type { AppState, TutorMessage } from '../types'
import { getDiagnostic, hasDiagnostic } from './diagnostic'

export interface TutorContext {
  chapterId: string
  chapterTitle: string
  diagnosticAccuracy: number | null
  diagnosticDone: boolean
  weakKpTitles: string[]
  wrongCount: number
  practiceAccuracy: number | null
}

export interface TutorSuggestion {
  id: string
  text: string
  reason: string
  action?: { label: string; path: string }
}

export function buildTutorContext(state: AppState, chapterId?: string): TutorContext {
  const chId = chapterId ?? state.lastChapterId ?? 'ch1'
  const ch = chapters.find((c) => c.id === chId)
  const diag = getDiagnostic(state, chId)
  const weakKpTitles = (diag?.weakKnowledgePointIds ?? [])
    .map((id) => knowledgePoints.find((k) => k.id === id)?.title)
    .filter(Boolean) as string[]

  const chapterAttempts = state.questionAttempts.filter((a) => a.chapterId === chId)
  const practiceAccuracy =
    chapterAttempts.length > 0
      ? Math.round(
          (chapterAttempts.filter((a) => a.correct).length / chapterAttempts.length) * 100
        )
      : null

  const wrongInChapter = state.wrongQuestionIds.filter((qid) => {
    const q = builtinQuestions.find((x) => x.id === qid)
    return q?.chapterId === chId
  }).length

  return {
    chapterId: chId,
    chapterTitle: ch?.title ?? chId,
    diagnosticAccuracy: diag?.accuracy ?? null,
    diagnosticDone: hasDiagnostic(state, chId),
    weakKpTitles,
    wrongCount: wrongInChapter,
    practiceAccuracy,
  }
}

export function generateSuggestions(state: AppState, ctx: TutorContext): TutorSuggestion[] {
  const suggestions: TutorSuggestion[] = []
  const diag = getDiagnostic(state, ctx.chapterId)
  const chShort = ctx.chapterTitle.replace(/^第.+章\s*/, '')

  if (!ctx.diagnosticDone) {
    suggestions.push({
      id: 'diag-first',
      text: `${chShort} 还没摸底，先花 3 分钟做学前测验。`,
      reason: `你 ${ctx.chapterId} 尚未摸底，无法判断薄弱点。`,
      action: { label: '开始摸底', path: `/diagnostic/${ctx.chapterId}` },
    })
  } else if (diag && diag.accuracy < 60 && diag.weakKnowledgePointIds[0]) {
    const firstWeak = knowledgePoints.find((k) => k.id === diag.weakKnowledgePointIds[0])
    suggestions.push({
      id: 'learn-weak',
      text: `建议先学「${firstWeak?.title ?? '薄弱点'}」。`,
      reason: `你 ${ctx.chapterId} 摸底 ${diag.correct}/${diag.total}（${diag.accuracy}%），这块最弱。`,
      action: {
        label: '去学',
        path: `/learn?chapter=${ctx.chapterId}&kp=${diag.weakKnowledgePointIds[0]}`,
      },
    })
  } else if (diag && diag.accuracy >= 80) {
    suggestions.push({
      id: 'practice-good',
      text: `摸底 ${diag.accuracy}%，可以刷题巩固。`,
      reason: `正确率 ≥80%，适合用题目加深记忆。`,
      action: { label: '去刷题', path: `/practice?chapter=${ctx.chapterId}` },
    })
  }

  if (ctx.wrongCount > 0) {
    suggestions.push({
      id: 'wrong-review',
      text: `本章错题 ${ctx.wrongCount} 道，去错题本过一遍。`,
      reason: '重复错题是提分最快的方式之一。',
      action: { label: '错题本', path: '/wrong-book' },
    })
  }

  if (ctx.practiceAccuracy !== null && ctx.practiceAccuracy < 70) {
    suggestions.push({
      id: 'practice-low',
      text: `刷题正确率 ${ctx.practiceAccuracy}%，回知识点卡片补一遍。`,
      reason: '历史作答低于 70%，说明概念还不稳。',
      action: { label: '补知识点', path: `/learn?chapter=${ctx.chapterId}` },
    })
  }

  const unlearned = knowledgePoints.filter(
    (k) => k.chapterId === ctx.chapterId && (state.knowledgeProgress[k.id]?.mastery ?? 0) < 2
  )
  if (unlearned.length > 0 && suggestions.length < 3) {
    suggestions.push({
      id: 'plan-learn',
      text: `今日还可学「${unlearned[0].title}」。`,
      reason: '掌握度未到「理解」，按顺序推进更省力。',
      action: { label: '开始学习', path: `/learn?chapter=${ctx.chapterId}&kp=${unlearned[0].id}` },
    })
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: 'default',
      text: '点「开始今日学习」一键走完摸底→学习→刷题。',
      reason: '你当前没有紧急薄弱项，保持节奏即可。',
      action: { label: '今日计划', path: '/' },
    })
  }

  return suggestions.slice(0, 4)
}

const KEYWORD_RULES: { keys: string[]; reply: (ctx: TutorContext, state: AppState) => string }[] = [
  {
    keys: ['怎么学', '如何学', '学习方法', '从哪开始'],
    reply: (ctx, state) => {
      const diag = getDiagnostic(state, ctx.chapterId)
      if (!diag) {
        return `建议流程：先做「${ctx.chapterTitle}」学前摸底 → 按推荐顺序学知识点 → 刷题巩固。点「开始摸底」即可。`
      }
      const order = diag.suggestedOrder
        .slice(0, 3)
        .map((id) => knowledgePoints.find((k) => k.id === id)?.title)
        .filter(Boolean)
        .join(' → ')
      return `你 ${ctx.chapterId} 摸底 ${diag.accuracy}%。推荐顺序：${order || '按章节卡片顺序'}。薄弱处多停留，掌握度标到「理解」以上再刷题。`
    },
  },
  {
    keys: ['错题', '错了', '做错'],
    reply: (ctx) =>
      ctx.wrongCount > 0
        ? `本章错题 ${ctx.wrongCount} 道。去「复习」页巩固，或刷题时看解析；搞懂后再生成笔记沉淀。`
        : '本章暂无记录错题，继续保持！刷题时答错的题会自动进入错题池。',
  },
  {
    keys: ['计划', '今日', '任务'],
    reply: () => '打开「今日计划」看推荐任务；完成摸底后计划会自动偏向你的薄弱点。可随时点「重新生成计划」。',
  },
  {
    keys: ['笔记', '总结', '归纳'],
    reply: () =>
      '学完一节或刷完题后，点「生成笔记」可自动拼要点与错题；保存后在「学习笔记」里查看、导出 Markdown。',
  },
  {
    keys: ['摸底', '测验', '诊断', '测评'],
    reply: (ctx) =>
      ctx.diagnosticDone
        ? `你已做过 ${ctx.chapterTitle} 摸底（${ctx.diagnosticAccuracy}%）。想重测可到学习页点「重新摸底」。`
        : `学前摸底约 5–8 道题，帮你找出薄弱点。入口：今日计划、学习页横幅，或 /diagnostic/${ctx.chapterId}。`,
  },
  {
    keys: ['鼓励', '难', '不会', '灰心'],
    reply: (ctx) =>
      `统计是循序渐进的，${ctx.chapterTitle} 拆成小块就好。你${ctx.diagnosticDone ? `摸底 ${ctx.diagnosticAccuracy}%，` : ''}一步一步来，我陪你。`,
  },
]

export function answerUserQuestion(
  input: string,
  ctx: TutorContext,
  state: AppState
): string {
  const text = input.trim().toLowerCase()
  if (!text) return '可以说：怎么学、错题、计划、笔记、摸底……我来帮你想下一步。'

  for (const rule of KEYWORD_RULES) {
    if (rule.keys.some((k) => text.includes(k))) {
      return rule.reply(ctx, state)
    }
  }

  if (text.includes('你好') || text.includes('嗨')) {
    return `你好！我是你的统计课学伴。当前章节：${ctx.chapterTitle}。有什么想问的直接说～`
  }

  return `关于「${input.slice(0, 20)}」，我建议：先看今日计划，或告诉我更具体的问题（如怎么学、错题、笔记）。`
}

export function createTutorMessage(role: 'tutor' | 'user', text: string): TutorMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    text,
    createdAt: new Date().toISOString(),
  }
}

export function proactiveAfterDiagnostic(result: { chapterId: string; accuracy: number }): string {
  const ch = chapters.find((c) => c.id === result.chapterId)
  if (result.accuracy >= 80) {
    return `🎉 ${ch?.title ?? result.chapterId} 摸底 ${result.accuracy}%，基础不错！按今日计划学知识点，再刷几道题巩固。`
  }
  if (result.accuracy >= 50) {
    return `摸底完成：${result.accuracy}%。薄弱点已标好，建议按推荐顺序学，别跳章。`
  }
  return `摸底 ${result.accuracy}%，别灰心～先从第一个薄弱知识点开始，我已在学习页帮你标出来了。`
}

export function proactiveAfterPractice(_chapterId: string, sessionCorrect: number, sessionTotal: number): string {
  const rate = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0
  if (rate >= 80) return `本轮刷题 ${rate}% 正确率，很棒！要生成笔记沉淀一下吗？`
  if (rate >= 50) return `刷题结束，正确率 ${rate}%。错题可看解析，需要的话去复习页再过一遍。`
  return `这轮正确率 ${rate}%，建议回知识点卡片复习，再刷一次会好很多。`
}

export function proactiveNoteHint(): string {
  return '本节内容学完了？点「生成笔记」可以自动整理要点和错题，方便考前复习。'
}

/** 答一题后的即时短反馈（摸底/刷题） */
export function instantAnswerFeedback(correct: boolean, hint?: string): string {
  if (correct) {
    const cheers = ['对了！', '很好～', '没错！', '棒！']
    return cheers[Math.floor(Math.random() * cheers.length)]
  }
  const tip = hint ? hint.slice(0, 48) + (hint.length > 48 ? '…' : '') : '看看解析'
  return `这题错了，${tip}`
}

export const TUTOR_QUICK_CHIPS = [
  { id: 'got-it', label: '我懂了', reply: '好！掌握了就继续下一题，或点「开始今日学习」保持节奏。' },
  {
    id: 'simpler',
    label: '再讲简单点',
    reply: (ctx: TutorContext) =>
      ctx.weakKpTitles[0]
        ? `「${ctx.weakKpTitles[0]}」用大白话：先记定义，再套一个小例子，别一次啃公式。`
        : '把大问题拆成：①这题在问什么 ②用哪个公式/概念 ③代数字算。一步一步来。',
  },
  { id: 'next-q', label: '下一题', reply: '继续刷题吧，键盘按 1–4 选题、Enter 提交更快。' },
  {
    id: 'tired',
    label: '今天累了',
    reply: '没问题，今日进度已保存。明天点「开始今日学习」就能接着来，休息好更重要。',
  },
] as const

export function replyForChip(
  chipId: string,
  ctx: TutorContext
): string {
  const chip = TUTOR_QUICK_CHIPS.find((c) => c.id === chipId)
  if (!chip) return '有需要随时问我～'
  return typeof chip.reply === 'function' ? chip.reply(ctx) : chip.reply
}
