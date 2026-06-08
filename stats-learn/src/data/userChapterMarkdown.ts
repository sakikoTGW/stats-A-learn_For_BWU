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

/** KP → 笔记 ## 小节关键词（提高匹配命中率） */
const KP_NOTE_HINTS: Record<string, string[]> = {
  'kp5-2': ['算术平均', '加权'],
  'kp5-3': ['调和平均', 'H'],
  'kp5-4': ['几何平均', 'G', '比率'],
  'kp5-5': ['中位数', 'Me'],
  'kp5-6': ['几何平均', 'G', '发展速度'],
  'kp5-7': ['中位数', 'Me'],
  'kp5-8': ['众数', 'Mo'],
  'kp5-9': ['算术', '中位数', '众数'],
  'kp5-10': ['Excel', 'AVERAGE'],
  'kp5-11': ['四分位数', 'Q_1', 'Q_3'],
  'kp5-12': ['平移', '缩放'],
  'kp5-13': ['五种平均', '选用'],
  'kp5-14': ['结构变化', '总平均'],
  'kp7-1': ['抽样推断', '概述'],
  'kp7-2': ['抽样平均误差', '允许误差', 'μ'],
  'kp7-3': ['抽样分布', 't 分布', '正态'],
  'kp7-4': ['参数估计', '区间估计', '点估计'],
  'kp7-5': ['假设检验', 't 检验', 'Z 检验', 'P 值'],
  'kp7-6': ['样本容量'],
  'kp7-7': ['重置', '不重置', '放回'],
  'kp7-8': ['无偏', '有效', '一致', '优良性'],
  'kp7-9': ['两类错误', 'α', 'β'],
  'kp7-10': ['成数', '区间估计'],
  'kp7-11': ['参数', '统计量'],
  'kp8-1': ['函数关系', '相关关系'],
  'kp8-2': ['Pearson', '相关系数', 't 检验', 'ρ'],
  'kp8-3': ['一元线性回归', '最小二乘', 'ŷ=a+bx'],
  'kp8-4': ['R²', '判定系数', '估计标准误', '拟合优度'],
  'kp8-5': ['t 检验', 'F 检验', 'F 统计量', '回归'],
  'kp8-6': ['Excel', 'CORREL', '易混'],
  'kp8-7': ['SST', 'SSR', 'SSE', '自由度'],
  'kp8-8': ['相关类型', '复相关'],
  'kp8-9': ['非线性回归'],
  'kp8-10': ['相关分析', '回归分析', '区别'],
  'kp8-11': ['相关分析步骤'],
  'kp8-12': ['多元线性回归', 'F 检验'],
  'kp8-13': ['预测', '单向'],
  'kp9-1': ['环比', '定基', '发展速度'],
  'kp9-2': ['季节指数', '调整系数', '400%'],
  'kp9-3': ['移动平均', '长期趋势', '最小二乘'],
  'kp9-4': ['季节变动', '趋势剔除', '实际÷趋势'],
  'kp9-5': ['序时平均', '增长量', '水平分析'],
  'kp9-6': ['时间数列', '可比性', '基础'],
  'kp9-7': ['增长1%', '绝对值'],
  'kp9-8': ['循环', '不规则', 'T×S×C×I'],
  'kp9-9': ['偶数项', '移动平均'],
  'kp9-10': ['平均发展速度', '几何平均'],
  'kp9-11': ['时距扩大'],
  'kp9-12': ['ARMA', 'MA', '自相关'],
  'kp9-13': ['发展水平', '平均增长量'],
  'kp9-14': ['直线趋势', 'a+bt', '最小二乘'],
  'kp10-1': ['拉氏', '派氏'],
  'kp10-2': ['指数数列', '基期更换'],
  'kp10-3': ['CPI', '指数调整'],
  'kp10-4': ['指数体系', '因素分析'],
  'kp10-5': ['优良性', '颠倒测试'],
  'kp10-6': ['易混', '双10%'],
  'kp10-7': ['个体指数'],
  'kp10-8': ['平均指数', '算术', '调和'],
  'kp10-9': ['股票指数'],
  'kp10-10': ['理想指数', '马艾'],
  'kp10-11': ['统计指数', '概念'],
  'kp10-12': ['同度量因素'],
}

/** 按 ## 大节匹配笔记（含其下 ### 全文，避免只剩标题） */
export function getKpSectionFromUserMd(chapterId: string, kpId: string): string {
  const md = getUserChapterMarkdown(chapterId)?.markdown
  const kp = knowledgePoints.find((k) => k.id === kpId)
  if (!md || !kp) return ''

  const rawParts = md.split(/^##\s+/m)
  // 首段是 # 章标题 + 导语，不是 ## 小节
  const sections = rawParts
    .slice(1)
    .filter((s) => s.trim())
    .map((block) => {
      const nl = block.indexOf('\n')
      const head = (nl >= 0 ? block.slice(0, nl) : block).trim()
      const body = nl >= 0 ? block.slice(nl + 1).trim() : ''
      return { head, text: `## ${head}\n\n${body}`.trim() }
    })

  const title = kp.title.replace(/（.*?）/g, '').trim()
  const hints = KP_NOTE_HINTS[kpId] ?? []

  const SKIP_HEAD =
    /配套课件|自测|习题逐题精讲|本章知识导图|本章知识点树|本章在干什么|先读：|挖漏|全书知识点/

  let best = ''
  let bestScore = 0
  for (const { head, text } of sections) {
    if (SKIP_HEAD.test(head) || head.startsWith('#')) continue

    let score = 0
    const headPlain = head.replace(/^[一二三四五六七八九十]+[、．.]?\s*/, '')
    if (head.includes(title) || title.includes(headPlain) || headPlain.includes(title)) {
      score += 12
    }
    for (const hint of hints) {
      if (head.includes(hint) || text.includes(hint)) score += 4
    }
    for (const tag of kp.tags) {
      if (text.includes(tag)) score += 2
    }
    for (const kw of title.split(/[/、\s·]/).filter((w) => w.length >= 2)) {
      if (head.includes(kw) || text.includes(kw)) score += 1
    }
    if (text.length > 80) score += 3
    if (text.length > 400) score += 2

    if (score > bestScore) {
      bestScore = score
      best = text
    }
  }

  if (bestScore < 3) return ''
  if (/^##\s*#/.test(best) || /^#\s+第/.test(best)) return ''
  return best.length > 4800 ? `${best.slice(0, 4800)}…` : best
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
