/**
 * 从 _提取全文/课后*.txt 或 E:/下载/*.doc 解析课后习题，生成 docExerciseQuestions.ts
 * 运行：node scripts/gen-doc-homework.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const extractDir = path.join(root, '..', '_提取全文')
const outFile = path.join(root, 'src/data/docExerciseQuestions.ts')

/** 源文件 -> app chapterId（课本章号与 App 章号不一致处已映射） */
const SOURCES = [
  { file: '课后作业--第一章统计学及其基本概念', chapterId: 'ch1', label: '第一章' },
  { file: '课后习题--第二章数据的收集与整理', chapterId: 'ch2', label: '第二章' },
  { file: '课后习题--第三章统计表与统计图', chapterId: 'ch3', label: '第三章' },
  { file: '课后习题--第四、五章数据的描述性分析', chapterId: 'ch5', label: '第四五章·平均', split: 'ch5' },
  { file: '课后习题--第四、五章数据的描述性分析', chapterId: 'ch6', label: '第四五章·离散', split: 'ch6' },
  { file: '课后习题--第六章相关与回归分析', chapterId: 'ch8', label: '第六章相关回归' },
  { file: '课后习题 --第七章时间序列', chapterId: 'ch9', label: '第七章时间数列' },
  { file: '课后习题 --第八章统计指数', chapterId: 'ch10', label: '第八章统计指数' },
]

const AVG_KW = ['加权', '平均', '权', '调和', '几何', '极端', '劳动生产率', '管理人员', '众数', '中位数', '算术']
const DISP_KW = ['离散', '标准差', '极差', '偏度', '方差', '离散程度', '平均差', '均衡', '代表性', '左偏', '右偏', '成数', '扩大', '减去']
const REL_KW = ['相对', '结构', '比较', '强度', '动态', '计划完成', '时点', '时期', '总量', '指标']

function readSourceText(baseName) {
  const txt = path.join(extractDir, `${baseName}.txt`)
  if (fs.existsSync(txt)) {
    const raw = fs.readFileSync(txt, 'utf8')
    if (raw.length > 100 && !raw.startsWith('[ERROR]')) return raw
  }
  const docDir = 'E:/下载'
  const docPath = path.join(docDir, `${baseName}.doc`)
  if (!fs.existsSync(docPath)) return ''
  const py = `
import win32com.client
from pathlib import Path
p = Path(r"${docPath.replace(/\\/g, '/')}")
word = win32com.client.Dispatch("Word.Application")
word.Visible = False
doc = word.Documents.Open(str(p.resolve()))
text = doc.Content.Text
doc.Close(False)
word.Quit()
print(text, end="")
`
  const r = spawnSync('python', ['-c', py], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
  if (r.status !== 0) {
    console.warn('Word extract failed:', baseName, r.stderr?.slice(0, 200))
    return ''
  }
  const text = r.stdout || ''
  fs.writeFileSync(txt, text, 'utf8')
  return text
}

function normalize(text) {
  return text
    .replace(/\r/g, '\n')
    .replace(/\u0001/g, 'ŷ')
    .replace(/\u0002/g, 'β')
    .replace(/\u0003/g, 'α')
    .replace(/\u0004/g, 'μ')
    .replace(/\u0005/g, 'σ')
    .replace(/\u0006/g, 'ρ')
    .replace(/\u0007/g, 'Σ')
    .replace(/\u0008/g, 'π')
    .replace(/\u0009/g, 'Δ')
    .replace(/\u000b/g, 'χ')
    .replace(/\u000c/g, 'φ')
    .replace(/\u000e/g, 'λ')
    .replace(/\u000f/g, 'θ')
    .replace(/\u0010/g, 'γ')
    .replace(/\u0011/g, 'δ')
    .replace(/\u0012/g, 'ε')
    .replace(/\u0013/g, 'η')
    .replace(/\u0014/g, 'ξ')
    .replace(/\u0015/g, 'ψ')
    .replace(/\u0016/g, 'ω')
    .replace(/\u0017/g, 'τ')
    .replace(/\u0018/g, 'ν')
    .replace(/\u0019/g, 'κ')
    .replace(/\u001a/g, 'ζ')
    .replace(/\u001b/g, 'ι')
    .replace(/\u001c/g, 'υ')
    .replace(/\u001d/g, 'ο')
    .replace(/\u001e/g, 'π')
    .replace(/\u001f/g, 'ς')
    .replace(/\s+/g, ' ')
    .trim()
}

function splitCh45(stem) {
  const s = stem
  if (DISP_KW.some((k) => s.includes(k))) return 'ch6'
  if (AVG_KW.some((k) => s.includes(k))) return 'ch5'
  if (REL_KW.some((k) => s.includes(k))) return 'ch4'
  return 'ch4'
}

function parseOptions(block) {
  const opts = []
  const re = /([A-E])[．.、\s]+([^A-E答案]+?)(?=\s+[A-E][．.、\s]|答案|$)/g
  let m
  while ((m = re.exec(block)) !== null) {
    const text = m[2].replace(/\s+/g, ' ').trim()
    if (text.length > 0 && text.length < 300) opts.push(text)
  }
  if (opts.length >= 2) return opts.slice(0, 5)
  const parts = block.split(/(?=[A-E][．.、\s])/)
  for (const p of parts) {
    const mm = p.match(/^([A-E])[．.、\s]+(.+)/)
    if (mm) opts.push(mm[2].replace(/\s+/g, ' ').trim())
  }
  return opts.filter((o) => o.length > 0 && o.length < 300).slice(0, 5)
}

function answerToIndex(answer, optionCount) {
  const letters = answer.replace(/[^A-E]/gi, '').toUpperCase()
  if (letters.length === 1) {
    const idx = letters.charCodeAt(0) - 65
    return idx >= 0 && idx < optionCount ? idx : 0
  }
  return -1 // multi
}

function multiOptions(correct) {
  const letters = correct.replace(/[^A-E]/gi, '').toUpperCase().split('')
  const fmt = (arr) => arr.join('、')
  const set = new Set([fmt(letters)])
  const all = ['A', 'B', 'C', 'D', 'E']
  const distractors = []
  // drop one letter
  if (letters.length > 1) {
    distractors.push(fmt(letters.slice(0, -1)))
    distractors.push(fmt(letters.slice(1)))
  }
  // swap one
  if (letters.length >= 2) {
    const alt = [...letters]
    alt[0] = alt[0] === 'A' ? 'B' : 'A'
    distractors.push(fmt([...new Set(alt)].sort()))
  }
  // add extra wrong letter
  for (const L of all) {
    if (!letters.includes(L) && letters.length < 5) {
      distractors.push(fmt([...letters, L].sort()))
      break
    }
  }
  // single letter wrong
  if (letters.length >= 2) distractors.push(letters[0])
  const options = [fmt(letters)]
  for (const d of distractors) {
    const clean = d.replace(/、/g, '')
    if (!set.has(d) && clean !== correct && options.length < 4) {
      set.add(d)
      options.push(d)
    }
  }
  while (options.length < 4) {
    const pad = all.filter((x) => !letters.includes(x)).slice(0, 4 - options.length)
    if (pad.length === 0) break
    options.push(fmt(pad))
  }
  return options.slice(0, 4)
}

function parseQuestions(content, defaultChapter, splitMode) {
  const items = []
  const norm = content.replace(/\r/g, '\n')
  const parts = norm.split(/(?=(?:^|\n)\s*\d+[\.\．、]\s*)/m)
  for (const part of parts) {
    const block = part.trim()
    if (block.length < 15) continue
    const ansM = block.match(/答案[：:]?\s*([A-E]+(?:\s*[、,，]\s*[A-E]+)*|[A-E]+)/i)
    if (!ansM) continue
    const answer = ansM[1].replace(/[\s,，]/g, '').toUpperCase()
    let stemBlock = block.slice(0, ansM.index).trim()
    stemBlock = stemBlock.replace(/^\d+[\.\．、]\s*/, '')
    stemBlock = stemBlock.replace(/^[一二三四五六七八九十]+[、．.]\s*单项选择.*$/m, '')
    const optStart = stemBlock.search(/\sA[．.、\s]/)
    let stem = optStart >= 0 ? stemBlock.slice(0, optStart).trim() : stemBlock
    stem = normalize(stem)
    if (stem.length < 4) continue
    const optBlock = optStart >= 0 ? stemBlock.slice(optStart) : block
    let options = parseOptions(optBlock)
    let correctIndex = answerToIndex(answer, options.length)
    let multi = false
    if (correctIndex < 0 || answer.length > 1) {
      multi = true
      options = multiOptions(answer)
      correctIndex = 0
      stem = `【多选】${stem}`
    }
    if (options.length < 2) {
      // 公式题等选项缺失：用字母占位
      if (answer.length === 1) {
        const idx = answer.charCodeAt(0) - 65
        options = ['A', 'B', 'C', 'D'].map((L, i) => `选项 ${L}${i === idx ? '（正确）' : ''}`)
        correctIndex = idx
      } else continue
    }
    let chapterId = defaultChapter
    if (splitMode) chapterId = splitCh45(stem)
    if (splitMode && splitMode !== chapterId) continue
    items.push({ stem, options, correctIndex, answer, chapterId, multi })
  }
  return items
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ')
}

function main() {
  const all = []
  const seen = new Set()
  const readCache = new Map()

  for (const src of SOURCES) {
    if (!readCache.has(src.file)) {
      readCache.set(src.file, readSourceText(src.file))
    }
    const text = readCache.get(src.file)
    if (!text) {
      console.warn('Skip empty:', src.file)
      continue
    }
    const parsed = parseQuestions(text, src.chapterId, src.split)
    for (const q of parsed) {
      const key = q.stem.slice(0, 50)
      if (seen.has(key)) continue
      seen.add(key)
      all.push({ ...q, label: src.label })
    }
  }

  const lines = [
    "import type { Question } from '../types'",
    '',
    '/** 课后习题原文（Word 导入 · node scripts/gen-doc-homework.mjs） */',
    'export const docExerciseQuestions: Question[] = [',
  ]
  all.forEach((q, i) => {
    const id = `doc-${q.chapterId}-${i + 1}`
    const diff = q.multi ? 'hard' : q.stem.length > 60 ? 'medium' : 'easy'
    lines.push('  {')
    lines.push(`    id: '${id}',`)
    lines.push(`    chapterId: '${q.chapterId}',`)
    lines.push(`    knowledgePointIds: [],`)
    lines.push(`    difficulty: '${diff}',`)
    lines.push(`    stem: '${esc(q.stem)}',`)
    lines.push(`    options: [${q.options.map((o) => `'${esc(o)}'`).join(', ')}],`)
    lines.push(`    correctIndex: ${q.correctIndex},`)
    lines.push(`    explanation: '课后习题（${q.label}）答案：${q.answer}。',`)
    lines.push(`    source: 'imported',`)
    lines.push('  },')
  })
  lines.push(']')
  lines.push('')
  fs.writeFileSync(outFile, lines.join('\n'), 'utf8')
  console.log(`Wrote ${all.length} questions -> ${outFile}`)
  const byCh = {}
  for (const q of all) byCh[q.chapterId] = (byCh[q.chapterId] || 0) + 1
  console.log('By chapter:', byCh)
}

main()
