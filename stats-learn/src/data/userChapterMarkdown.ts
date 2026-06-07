/**
 * 直接挂载用户编写的「章节重点笔记」原文（非脚本生成）。
 * 修改笔记请编辑 d:\统计课\章节重点笔记\*.md 后重新 npm run dev。
 */

import { knowledgePoints } from './chapters'

const files = import.meta.glob('../../../章节重点笔记/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const CHAPTER_MAP: Record<string, string> = {
  '第01章-统计和统计学.md': 'ch1',
  '第02章-统计调查.md': 'ch2',
  '第03章-统计数据的整理与显示.md': 'ch3',
  '第04章-总量指标与相对指标.md': 'ch4',
  '第05章-平均指标.md': 'ch5',
  '第06章-标志变异指标.md': 'ch6',
  '第07章-抽样推断.md': 'ch7',
  '第08章-相关与回归分析.md': 'ch8',
  '第09章-时间数列分析.md': 'ch9',
  '第10章-统计指数.md': 'ch10',
}

export type UserChapterMarkdown = {
  chapterId: string
  fileName: string
  title: string
  markdown: string
}

function parseTitle(fileName: string, markdown: string): string {
  const m = markdown.match(/^#\s+(.+)$/m)
  if (m) return m[1].trim()
  return fileName.replace(/\.md$/, '')
}

export const userChapterMarkdown: UserChapterMarkdown[] = Object.entries(files)
  .map(([path, markdown]) => {
    const fileName = path.split('/').pop() ?? path
    const chapterId = CHAPTER_MAP[fileName]
    if (!chapterId) return null
    return {
      chapterId,
      fileName,
      title: parseTitle(fileName, markdown),
      markdown,
    }
  })
  .filter((x): x is UserChapterMarkdown => x !== null)
  .sort((a, b) => a.chapterId.localeCompare(b.chapterId))

export function getUserChapterMarkdown(chapterId: string): UserChapterMarkdown | undefined {
  return userChapterMarkdown.find((c) => c.chapterId === chapterId)
}

/** 提取「课后题速记」表格段落，供学伴/学习页引用 */
export function getHomeworkTableSnippet(chapterId: string): string {
  const md = getUserChapterMarkdown(chapterId)?.markdown
  if (!md) return ''
  const m = md.match(/##\s*[^\n]*课后题[^\n]*\n([\s\S]*?)(?=\n##\s|$)/)
  if (!m) return ''
  return m[1].trim().slice(0, 1200)
}

/** 按知识点标题在笔记中找最相关的 ## 小节 */
export function getKpSectionFromUserMd(chapterId: string, kpId: string): string {
  const md = getUserChapterMarkdown(chapterId)?.markdown
  const kp = knowledgePoints.find((k) => k.id === kpId)
  if (!md || !kp) return ''

  const sections = md.split(/(?=^##\s)/m).filter((s) => s.trim())
  const title = kp.title.replace(/（.*?）/g, '').trim()

  let best = ''
  let bestScore = 0
  for (const sec of sections) {
    const head = sec.match(/^##\s+(.+)/)?.[1] ?? ''
    let score = 0
    if (head.includes(title) || title.includes(head.replace(/^[一二三四五六七八九十]+[、．.]?\s*/, ''))) {
      score += 10
    }
    for (const tag of kp.tags) {
      if (sec.includes(tag)) score += 2
    }
    for (const kw of title.split(/[/、\s]/).filter((w) => w.length >= 2)) {
      if (sec.includes(kw)) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      best = sec.trim()
    }
  }

  if (!best) return ''
  return best.length > 900 ? `${best.slice(0, 900)}…` : best
}

export function getChapterIntroFromUserMd(chapterId: string): string {
  const md = getUserChapterMarkdown(chapterId)?.markdown
  if (!md) return ''
  const parts = md.split(/^---$/m)
  const intro = parts[1] ?? parts[0]
  return intro.replace(/^#\s+.+$/m, '').trim().slice(0, 500)
}

const treeGlob = import.meta.glob('../../../章节重点笔记/全书知识点树图.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const gapGlob = import.meta.glob('../../../章节重点笔记/挖漏对照清单.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const exerciseGlob = import.meta.glob('../../../章节重点笔记/第*章-*-习题逐题.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function getBookKnowledgeTreeMd(): string {
  const entry = Object.values(treeGlob)[0]
  return entry ?? ''
}

export function getGapChecklistMd(): string {
  const entry = Object.values(gapGlob)[0]
  return entry ?? ''
}

function exerciseChapterId(fileName: string): string | null {
  const m = fileName.match(/^第(\d+)章-/)
  if (!m) return null
  return `ch${Number(m[1])}`
}

export function getChapterExerciseMd(chapterId: string): { fileName: string; markdown: string } | null {
  for (const [path, markdown] of Object.entries(exerciseGlob)) {
    const fileName = path.split('/').pop() ?? path
    if (exerciseChapterId(fileName) === chapterId) {
      return { fileName, markdown }
    }
  }
  return null
}
