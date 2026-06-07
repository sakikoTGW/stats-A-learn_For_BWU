import { chapters, knowledgePoints } from '../data/chapters'
import { getKpNoteSnippet } from '../data/chapterNotes'
import { getHomeworkTableSnippet, getKpSectionFromUserMd, getChapterIntroFromUserMd } from '../data/userChapterMarkdown'
import { builtinQuestions } from '../data/questions'
import type { AppState } from '../types'
import { chatCompletion, getLlmConfig, hasLlmConfig } from './llm'
import { getDiagnostic } from './diagnostic'
import type { TutorContext } from './tutor'

const SYSTEM_PROMPT =
  '你是统计课程备考学伴，用简体中文、大白话解释概念，结合学生当前章节与薄弱点，每次回答 3–6 句，不要堆砌术语。'

export function buildRichContextBlock(state: AppState, chapterId: string): string {
  const ch = chapters.find((c) => c.id === chapterId)
  const diag = getDiagnostic(state, chapterId)
  const weakIds = diag?.weakKnowledgePointIds ?? []
  const weakTitles = weakIds
    .map((id) => knowledgePoints.find((k) => k.id === id)?.title)
    .filter(Boolean)

  const wrongStems = state.wrongQuestionIds
    .slice(-5)
    .map((qid) => builtinQuestions.find((q) => q.id === qid))
    .filter((q) => q?.chapterId === chapterId)
    .map((q) => q!.stem.slice(0, 60))

  const lowMastery = knowledgePoints
    .filter((k) => k.chapterId === chapterId && (state.knowledgeProgress[k.id]?.mastery ?? 0) < 2)
    .slice(0, 3)
    .map((k) => k.title)

  const intro = getChapterIntroFromUserMd(chapterId)
  const hw = getHomeworkTableSnippet(chapterId)

  const lines = [
    `当前章节：${ch?.title ?? chapterId}`,
    diag ? `摸底正确率：${diag.accuracy}%` : '尚未完成本章摸底',
    weakTitles.length ? `薄弱知识点：${weakTitles.join('、')}` : '',
    lowMastery.length ? `掌握度偏低：${lowMastery.join('、')}` : '',
    wrongStems.length ? `最近错题题干：${wrongStems.join('；')}` : '',
    intro ? `章节笔记提要：${intro.slice(0, 280)}…` : '',
    hw ? `课后题速记（节选）：${hw.slice(0, 200)}…` : '',
  ].filter(Boolean)
  return lines.join('\n')
}

/** 无 LLM 时的针对性长解释 */
export function explainWithoutLlm(
  userInput: string,
  ctx: TutorContext,
  state: AppState
): string {
  const block = buildRichContextBlock(state, ctx.chapterId)
  const diag = getDiagnostic(state, ctx.chapterId)
  const firstWeak = diag?.weakKnowledgePointIds[0]
  const kp = firstWeak ? knowledgePoints.find((k) => k.id === firstWeak) : undefined

  if (userInput.includes('错题') || userInput.includes('错了')) {
    const wrongQs = state.wrongQuestionIds
      .map((id) => builtinQuestions.find((q) => q.id === id))
      .filter((q) => q && q.chapterId === ctx.chapterId)
      .slice(0, 3)
    if (wrongQs.length === 0) {
      return `${ctx.chapterTitle} 暂无记录错题。建议：先完成今日学习或刷 6 道题，错题会自动进入错题本，再到复习页「再测」巩固。`
    }
    const tips = wrongQs
      .map((q) => `·「${q!.stem.slice(0, 40)}…」→ 正确项：${q!.options[q!.correctIndex]}。${q!.explanation.slice(0, 50)}`)
      .join('\n')
    return `【${ctx.chapterTitle} 错题讲解】\n${block}\n\n近期错题要点：\n${tips}\n\n建议：先弄懂解析，再在复习页「再测 5–10 题」验证。`
  }

  if (kp) {
    const section = getKpSectionFromUserMd(ctx.chapterId, kp.id) || getKpNoteSnippet(ctx.chapterId, kp.id)
    const hw = getHomeworkTableSnippet(ctx.chapterId)
    const hwBit = hw ? `\n【课后题速记】\n${hw.slice(0, 350)}…` : ''
    return `【针对薄弱点：${kp.title}】\n${block}\n\n${section}${hwBit}\n\n${kp.plainExplanation}\n\n要点：${kp.keyPoints.slice(0, 3).join('；')}\n${kp.mnemonic ? `口诀：${kp.mnemonic}` : ''}\n\n建议：章节重点 → 完整笔记，再刷本章题。`
  }

  const chKps = knowledgePoints.filter((k) => k.chapterId === ctx.chapterId).slice(0, 2)
  const kpText = chKps.map((k) => `·${k.title}：${k.plainExplanation.slice(0, 80)}…`).join('\n')

  return `【${ctx.chapterTitle}】\n${block}\n\n本章可先关注：\n${kpText}\n\n关于「${userInput.slice(0, 40)}」：把问题拆成「考什么概念→用哪个公式/图→代数字」。需要更细可点「再讲简单点」或去设置页配置学伴 API。`
}

export async function explainWithLlmOrTemplate(
  userInput: string,
  ctx: TutorContext,
  state: AppState
): Promise<string> {
  if (!hasLlmConfig(state)) {
    return explainWithoutLlm(userInput, ctx, state)
  }
  const config = getLlmConfig(state)
  const contextBlock = buildRichContextBlock(state, ctx.chapterId)
  const userPrompt = `${contextBlock}\n\n学生问题：${userInput}`
  const llm = await chatCompletion(config, SYSTEM_PROMPT, userPrompt)
  if (llm) return llm
  return explainWithoutLlm(userInput, ctx, state) + '\n\n（学伴 API 暂时不可用，已改用本地针对性讲解。）'
}

export async function explainWrongQuestion(
  questionId: string,
  state: AppState
): Promise<string> {
  const q = builtinQuestions.find((x) => x.id === questionId)
  if (!q) return '未找到该题。'
  const kpTitles = q.knowledgePointIds
    .map((id) => knowledgePoints.find((k) => k.id === id)?.title)
    .filter(Boolean)
    .join('、')

  if (!hasLlmConfig(state)) {
    return `【错题讲解】${q.stem}\n\n正确：${q.options[q.correctIndex]}\n解析：${q.explanation}\n关联知识点：${kpTitles || '见本章'}。\n易混项：${q.options.filter((_, i) => i !== q.correctIndex).slice(0, 2).join(' / ')}。建议回到学习页复习相关卡片后再做同类题。`
  }

  const config = getLlmConfig(state)
  const prompt = `题目：${q.stem}\n选项：${q.options.map((o, i) => `${String.fromCharCode(65 + i)}.${o}`).join(' ')}\n正确答案：${q.options[q.correctIndex]}\n教材解析：${q.explanation}\n知识点：${kpTitles}\n请用大白话讲清为什么对、其他项错在哪，3-5句。`
  const llm = await chatCompletion(config, SYSTEM_PROMPT, prompt)
  return llm ?? `正确：${q.options[q.correctIndex]}。${q.explanation}`
}
