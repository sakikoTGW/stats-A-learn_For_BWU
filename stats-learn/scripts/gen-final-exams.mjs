/**
 * 从 scripts/final-exam-data.mjs 生成 TypeScript 数据与 Markdown 文档
 * 运行：node scripts/gen-final-exams.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { finalExamPapers } from './final-exam-data.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const tsOut = path.join(root, 'src/data/finalExamPapers.ts')
const docsDir = path.join(root, 'docs/期末模拟卷')

const LETTER_LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function escapeTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
}

function serializeQuestion(q) {
  const parts = [
    `id: '${q.id}'`,
    `type: '${q.type}'`,
    `stem: '${escapeTs(q.stem)}'`,
  ]
  if (q.options?.length) {
    parts.push(`options: [${q.options.map((o) => `'${escapeTs(o)}'`).join(', ')}]`)
  }
  parts.push(`answer: '${escapeTs(String(q.answer))}'`)
  parts.push(`explanation: '${escapeTs(q.explanation)}'`)
  parts.push(`knowledgePointIds: [${q.knowledgePointIds.map((k) => `'${k}'`).join(', ')}]`)
  parts.push(`chapterId: '${q.chapterId}'`)
  parts.push(`points: ${q.points}`)
  if (q.rubric) parts.push(`rubric: '${escapeTs(q.rubric)}'`)
  return `    {\n      ${parts.join(',\n      ')}\n    }`
}

function serializePaper(p) {
  const sections = p.sections
    .map((s) => {
      const qs = s.questions.map(serializeQuestion).join(',\n')
      const instr = s.instruction ? `\n    instruction: '${escapeTs(s.instruction)}',` : ''
      return `  {\n    title: '${escapeTs(s.title)}',${instr}\n    questions: [\n${qs}\n    ]\n  }`
    })
    .join(',\n')
  return `  {\n    id: '${p.id}',\n    title: '${escapeTs(p.title)}',\n    subtitle: '${escapeTs(p.subtitle)}',\n    focus: '${escapeTs(p.focus)}',\n    durationMinutes: ${p.durationMinutes},\n    totalPoints: ${p.totalPoints},\n    sections: [\n${sections}\n    ]\n  }`
}

function writeTsFile() {
  const body = finalExamPapers.map(serializePaper).join(',\n')
  const content = `/** 自动生成 — 运行 node scripts/gen-final-exams.mjs 更新 */
import type { FinalExamPaper } from '../types/finalExam'

export const finalExamPapers: FinalExamPaper[] = [
${body}
]
`
  fs.writeFileSync(tsOut, content, 'utf8')
  console.log('Wrote', tsOut)
}

function formatOptions(q, prefix = '') {
  if (!q.options?.length) return ''
  return q.options
    .map((opt, i) => `${prefix}${LETTER_LABELS[i]}. ${opt}`)
    .join('\n')
}

function questionStemMd(q, num) {
  const pts = q.points ? `（${q.points}分）` : ''
  let md = `${num}. ${q.stem}${pts}\n\n`
  if (q.type === 'single' || q.type === 'multi') {
    md += formatOptions(q) + '\n\n'
  } else if (q.type === 'judge') {
    md += '（  ）\n\n'
  } else if (q.type === 'fill') {
    md += '答：____________\n\n'
  }
  return md
}

function writePaperMd(paper, letter) {
  const lines = [
    `# ${paper.title}`,
    '',
    `> ${paper.subtitle}`,
    '',
    `**侧重**：${paper.focus}`,
    '',
    `**考试时间**：${paper.durationMinutes} 分钟　**满分**：${paper.totalPoints} 分`,
    '',
    '---',
    '',
  ]

  for (const section of paper.sections) {
    lines.push(`## ${section.title}`, '')
    if (section.instruction) {
      lines.push(`> ${section.instruction}`, '')
    }
    section.questions.forEach((q, i) => {
      lines.push(questionStemMd(q, i + 1).trimEnd())
      lines.push('')
    })
  }

  const outPath = path.join(docsDir, `卷${letter}.md`)
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8')
  console.log('Wrote', outPath)
}

function writeAnswerMd(paper, letter) {
  const lines = [
    `# ${paper.title} · 参考答案`,
    '',
    `> ${paper.subtitle}`,
    '',
    '---',
    '',
  ]

  for (const section of paper.sections) {
    lines.push(`## ${section.title}`, '')
    section.questions.forEach((q, i) => {
      lines.push(`**${i + 1}.** 答案：\`${q.answer}\``, '')
      lines.push(`解析：${q.explanation}`, '')
      if (q.rubric) {
        lines.push(`评分要点：${q.rubric}`, '')
      }
      lines.push(`知识点：${q.knowledgePointIds.join('、')}`, '')
      lines.push('')
    })
  }

  const outPath = path.join(docsDir, `卷${letter}-参考答案.md`)
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8')
  console.log('Wrote', outPath)
}

function formatOptionsForAi(q) {
  if (!q.options?.length) return ''
  return q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')
}

const TYPE_LABEL_AI = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  calc: '计算',
}

function formatOneQuestionAi(q, num, mode) {
  const lines = []
  lines.push(`### ${num}. [${TYPE_LABEL_AI[q.type] || q.type}·${q.points}分] ${q.stem}`)
  if (q.type === 'single' || q.type === 'multi') {
    const opts = formatOptionsForAi(q)
    if (opts) lines.push(opts)
  } else if (q.type === 'judge') {
    lines.push('（判断：对 / 错）')
  } else if (q.type === 'fill') {
    lines.push('（填空）')
  }
  if (mode === 'exam') return lines.join('\n')
  const ans = q.type === 'multi' ? q.answer.split('').join('、') : q.answer
  lines.push(`【参考答案】${ans}`)
  lines.push(`【解析】${q.explanation}`)
  if (q.rubric) lines.push(`【评分要点】${q.rubric}`)
  lines.push(`【知识点】${q.knowledgePointIds.join('、')} · ${q.chapterId}`)
  return lines.join('\n')
}

function formatPaperForAiMd(paper, mode) {
  const header = [
    `# ${paper.title}`,
    `> ${paper.subtitle}`,
    `> 侧重：${paper.focus}`,
    '',
    mode === 'exam'
      ? '以下为题目（不含答案），可复制给 AI 请其出题讲解或模拟作答。'
      : '以下为题目 + 参考答案 + 解析，可复制给 AI 逐题讲解。',
    '',
    '---',
    '',
  ].join('\n')
  const blocks = [header]
  let globalNum = 0
  for (const section of paper.sections) {
    blocks.push(`## ${section.title}`, '')
    if (section.instruction) blocks.push(`> ${section.instruction}`, '')
    for (const q of section.questions) {
      globalNum++
      blocks.push(formatOneQuestionAi(q, globalNum, mode))
      blocks.push('')
    }
  }
  return blocks.join('\n').trim() + '\n'
}

function writeAiCopyTxt(paper, letter) {
  const aiDir = path.join(docsDir, 'AI复制')
  ensureDir(aiDir)
  const examPath = path.join(aiDir, `卷${letter}-仅题目.txt`)
  const answerPath = path.join(aiDir, `卷${letter}-题目与解答.txt`)
  fs.writeFileSync(examPath, formatPaperForAiMd(paper, 'exam'), 'utf8')
  fs.writeFileSync(answerPath, formatPaperForAiMd(paper, 'answer'), 'utf8')
  console.log('Wrote', examPath)
  console.log('Wrote', answerPath)
}

function writeAllAiCopyTxt() {
  const aiDir = path.join(docsDir, 'AI复制')
  ensureDir(aiDir)
  const all = finalExamPapers.map((p) => formatPaperForAiMd(p, 'answer')).join('\n\n==========\n\n')
  const allPath = path.join(aiDir, '全部五套-题目与解答.txt')
  fs.writeFileSync(allPath, all, 'utf8')
  console.log('Wrote', allPath)
}

function writeReadme() {
  const rows = finalExamPapers.map((p, i) => {
    const letter = LETTER_LABELS[i]
    const qCount = p.sections.reduce((n, s) => n + s.questions.length, 0)
    return `| [卷${letter}](./卷${letter}.md) | [参考答案](./卷${letter}-参考答案.md) | [题目+解答 txt](./AI复制/卷${letter}-题目与解答.txt) | ${p.title} | ${p.focus} | ${qCount} |`
  })

  const content = `# 期末模拟卷

共 **${finalExamPapers.length}** 套模拟试卷，每套 100 分、120 分钟。

| 试卷 | 参考答案 | AI 复制 | 名称 | 侧重 | 题量 |
|------|----------|---------|------|------|------|
${rows.join('\n')}

## 题型结构（每套）

| 题型 | 题量 | 分值 |
|------|------|------|
| 单项选择题 | 10 | 20 |
| 多项选择题 | 5 | 15 |
| 判断题 | 10 | 10 |
| 填空题 | 5 | 10 |
| 计算与分析题 | 3 | 45 |

## AI 复制格式

\`docs/期末模拟卷/AI复制/\` 下每套有 **仅题目** 与 **题目+解答** 两个 \`.txt\`，可直接粘贴给 ChatGPT / Claude 逐题讲解。另有 [全部五套-题目与解答.txt](./AI复制/全部五套-题目与解答.txt)。

## 重新生成

\`\`\`bash
node scripts/gen-final-exams.mjs
\`\`\`

数据源：\`scripts/final-exam-data.mjs\`
`
  fs.writeFileSync(path.join(docsDir, 'README.md'), content, 'utf8')
  console.log('Wrote', path.join(docsDir, 'README.md'))
}

function summarize() {
  const totals = { single: 0, multi: 0, judge: 0, fill: 0, calc: 0 }
  const chapters = {}
  for (const p of finalExamPapers) {
    for (const s of p.sections) {
      for (const q of s.questions) {
        totals[q.type] = (totals[q.type] || 0) + 1
        chapters[q.chapterId] = (chapters[q.chapterId] || 0) + 1
      }
    }
  }
  console.log('\n=== 题目统计 ===')
  console.log('试卷数:', finalExamPapers.length)
  console.log('各题型:', totals)
  console.log('总题量:', Object.values(totals).reduce((a, b) => a + b, 0))
  console.log('章节分布:', chapters)
}

ensureDir(docsDir)
writeTsFile()
finalExamPapers.forEach((p, i) => {
  const letter = LETTER_LABELS[i]
  writePaperMd(p, letter)
  writeAnswerMd(p, letter)
  writeAiCopyTxt(p, letter)
})
writeAllAiCopyTxt()
writeReadme()
summarize()
