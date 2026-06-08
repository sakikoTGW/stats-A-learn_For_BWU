/**
 * 为每 KP 补到至少 MIN 道题 → src/data/kpDrillQuestions.ts
 * 运行：node scripts/gen-kp-drill.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const MIN = 8

const chaptersSrc = readFileSync(join(root, 'src/data/chapters.ts'), 'utf8')
const qFiles = [
  'src/data/questions.ts',
  'src/data/homeworkQuestions.ts',
  'src/data/supplementQuestions.ts',
  'src/data/ch78910Questions.ts',
]
let allQ = ''
for (const f of qFiles) {
  const p = join(root, f)
  if (existsSync(p)) allQ += readFileSync(p, 'utf8')
}

const kps = [...chaptersSrc.matchAll(/id: '(kp[^']+)'/g)].map((m) => m[1])
const kpMeta = {}
const kpKeyPoints = {}
const kpTags = {}

for (const m of chaptersSrc.matchAll(
  /id: '(kp[^']+)',\s*chapterId: '(ch\d+)',\s*title: '([^']+)'[\s\S]*?keyPoints: \[([\s\S]*?)\],/g
)) {
  kpMeta[m[1]] = { chapterId: m[2], title: m[3] }
  kpKeyPoints[m[1]] = [...m[4].matchAll(/'([^']+)'/g)].map((x) => x[1])
}

for (const m of chaptersSrc.matchAll(/id: '(kp[^']+)'[\s\S]*?tags: \[([\s\S]*?)\],/g)) {
  kpTags[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1])
}

const kpQ = Object.fromEntries(kps.map((id) => [id, 0]))
for (const m of allQ.matchAll(/knowledgePointIds: (\[[^\]]+\])/g)) {
  const ids = JSON.parse(m[1].replace(/'/g, '"'))
  for (const id of ids) if (kpQ[id] !== undefined) kpQ[id]++
}

const DISTRACTORS = [
  '与本知识点无关',
  '仅适用于品质数据',
  '属于描述统计而非推断',
  '只用于时间数列季节分析',
  '是登记误差而非抽样误差',
  '属于指数章拉氏公式',
  '只能用于完全相关',
  '须用算术平均而非几何平均',
]

function pickDistractors(n, title) {
  const pool = DISTRACTORS.filter((d) => !d.includes(title.slice(0, 2)))
  const out = []
  for (let i = 0; i < n; i++) out.push(pool[i % pool.length])
  return out
}

/** 手工高质量追加（检验/公式类） */
const MANUAL = {
  'kp8-2': [
    {
      difficulty: 'hard',
      stem: 'Pearson 相关检验 H0:ρ=0 的 t 统计量是（  ）。',
      options: ['t=r√(n−2)/√(1−r²)', 't=r√n', 't=F·√(n−2)', 't=√(1−r²)/r'],
      correctIndex: 0,
      explanation: '笔记 §四：t=r√(n−2)/√(1−r²)～t(n−2)。',
    },
    {
      difficulty: 'medium',
      stem: '|r| 在 0.8–1 之间通常表示（  ）。',
      options: ['高度相关', '微弱相关', '不相关', '完全无关'],
      correctIndex: 0,
      explanation: '1234 记忆：|r|<0.3 微弱；0.3–0.5 低；0.5–0.8 显著；0.8–1 高度。',
    },
  ],
  'kp8-5': [
    {
      difficulty: 'hard',
      stem: '一元回归方程整体显著性 F 与斜率 t 的关系是（  ）。',
      options: ['F=t²', 'F=t', 't=F²', '无关'],
      correctIndex: 0,
      explanation: '一元只有一个斜率，F 检验与 t 检验等价：F=t²。',
    },
    {
      difficulty: 'medium',
      stem: 'Excel 回归输出中的 F Stat 用于（  ）。',
      options: ['检验回归方程整体是否显著', '只检验截距', '算 Pearson r', '算季节指数'],
      correctIndex: 0,
      explanation: 'F=MSR/MSE 检整体；t Stat 检单个系数。',
    },
  ],
  'kp8-7': [
    {
      difficulty: 'hard',
      stem: 'Sy=√(SSE/(n−2)) 中 n−2 是（  ）。',
      options: ['残差平方和的自由度', '回归平方和的自由度', '总离差自由度', '自变量个数'],
      correctIndex: 0,
      explanation: '一元 SSE 自由度 n−2；SSR 自由度 1。',
    },
  ],
  'kp9-3': [
    {
      difficulty: 'medium',
      stem: '长期趋势测定方法包括（  ）。',
      options: ['移动平均、时距扩大、最小二乘', '只做 t 检验', '只做 F 检验', '只算 Pearson r'],
      correctIndex: 0,
      explanation: '笔记：移动平均、时距扩大、最小二乘并列（ABDE）。',
    },
  ],
  'kp9-4': [
    {
      difficulty: 'hard',
      stem: '趋势剔除法季节分析，各季季节比率之和应（  ）。',
      options: ['可调整为 400%（季度）', '必须等于 0', '等于 100%', '等于环比连乘'],
      correctIndex: 0,
      explanation: '季节指数和可经 k 调整至 400%（月 1200%）。',
    },
  ],
}

function synthQuestion(kpId, meta, point, variant) {
  const distractors = pickDistractors(3, meta.title)
  const stems = [
    `关于「${meta.title}」，正确的是（  ）。`,
    `【${meta.title}】下列表述符合笔记的是（  ）。`,
    `复习「${meta.title}」：${point.slice(0, 28)}… 本题选（  ）。`,
  ]
  const options = [point, ...distractors]
  // rotate correct index for variety
  const rot = variant % 4
  const rotated = [...options.slice(rot), ...options.slice(0, rot)]
  return {
    difficulty: variant % 3 === 0 ? 'hard' : variant % 2 ? 'medium' : 'easy',
    stem: stems[variant % stems.length],
    options: rotated.slice(0, 4),
    correctIndex: 0,
    explanation: `要点：${point}`,
  }
}

const lines = [
  "import type { Question } from '../types'",
  '',
  '/** 每 KP 至少 5 题 · 自动生成 + 手工（node scripts/gen-kp-drill.mjs） */',
  'export const kpDrillQuestions: Question[] = [',
]

let n = 0
for (const kpId of kps) {
  const meta = kpMeta[kpId]
  if (!meta) continue
  const have = kpQ[kpId] ?? 0
  let need = Math.max(0, MIN - have)
  if (need <= 0) continue

  const manual = MANUAL[kpId] ?? []
  const points = kpKeyPoints[kpId] ?? []
  const tags = kpTags[kpId] ?? []
  if (points.length === 0) points.push(meta.title, ...tags.slice(0, 2))

  let variant = 0
  for (const q of manual) {
    if (need <= 0) break
    const id = `drill-${kpId}-${++variant}`
    lines.push('  {')
    lines.push(`    id: '${id}',`)
    lines.push(`    chapterId: '${meta.chapterId}',`)
    lines.push(`    knowledgePointIds: ['${kpId}'],`)
    lines.push(`    difficulty: '${q.difficulty}',`)
    lines.push(`    stem: ${JSON.stringify(q.stem)},`)
    lines.push(`    options: ${JSON.stringify(q.options)},`)
    lines.push(`    correctIndex: ${q.correctIndex},`)
    lines.push(`    explanation: ${JSON.stringify(q.explanation)},`)
    lines.push('  },')
    n++
    need--
  }

  let pi = 0
  while (need > 0 && pi < points.length * 3) {
    const point = points[pi % points.length]
    const q = synthQuestion(kpId, meta, point, variant++)
    const id = `drill-${kpId}-${++variant}`
    lines.push('  {')
    lines.push(`    id: '${id}',`)
    lines.push(`    chapterId: '${meta.chapterId}',`)
    lines.push(`    knowledgePointIds: ['${kpId}'],`)
    lines.push(`    difficulty: '${q.difficulty}',`)
    lines.push(`    stem: ${JSON.stringify(q.stem)},`)
    lines.push(`    options: ${JSON.stringify(q.options)},`)
    lines.push(`    correctIndex: ${q.correctIndex},`)
    lines.push(`    explanation: ${JSON.stringify(q.explanation)},`)
    lines.push('  },')
    n++
    need--
    pi++
  }
}

lines.push(']')
lines.push('')

writeFileSync(join(root, 'src/data/kpDrillQuestions.ts'), lines.join('\n'), 'utf8')
console.log(`Wrote ${n} drill questions (target ≥${MIN}/KP) → kpDrillQuestions.ts`)
