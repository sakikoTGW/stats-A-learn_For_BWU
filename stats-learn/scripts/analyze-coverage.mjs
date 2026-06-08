import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const chapters = fs.readFileSync(path.join(root, 'src/data/chapters.ts'), 'utf8')
const files = ['questions.ts', 'homeworkQuestions.ts', 'supplementQuestions.ts', 'ch78910Questions.ts', 'kpDrillQuestions.ts']

const kps = [...chapters.matchAll(/id: '(kp[^']+)'/g)].map((m) => m[1])
const kpMeta = [...chapters.matchAll(/id: '(kp[^']+)',\s*chapterId: '(ch\d+)',\s*title: '([^']+)'/g)]
const kpTitle = Object.fromEntries(kpMeta.map(([, id, , title]) => [id, title]))

const kpQ = Object.fromEntries(kps.map((id) => [id, 0]))
const qIds = new Set()
let totalRefs = 0

for (const f of files) {
  const text = fs.readFileSync(path.join(root, 'src/data', f), 'utf8')
  for (const m of text.matchAll(/id: '([^']+)'/g)) qIds.add(m[1])
  for (const m of text.matchAll(/knowledgePointIds: (\[[^\]]+\])/g)) {
    const ids = JSON.parse(m[1].replace(/'/g, '"'))
    totalRefs += ids.length
    for (const id of ids) if (kpQ[id] !== undefined) kpQ[id]++
  }
}

const hist = {}
for (const n of Object.values(kpQ)) hist[n] = (hist[n] || 0) + 1

const exactly2 = Object.entries(kpQ).filter(([, n]) => n === 2)
const ge5 = Object.entries(kpQ).filter(([, n]) => n >= 5)
const ch7_10 = Object.entries(kpQ).filter(([id]) => /^kp[789]|^kp10/.test(id.replace(/^kp(\d+)-.*/, (_, d) => d)))

console.log('KP总数:', kps.length)
console.log('独立题目数:', qIds.size)
console.log('题-KP引用次数:', totalRefs)
console.log('每KP题数分布:', hist)
console.log('仅2题的KP数:', exactly2.length, '/', kps.length)
console.log('≥5题的KP数:', ge5.length)

const thin = exactly2
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([id]) => `${id} ${kpTitle[id] ?? ''}`)
console.log('\n仅2题的知识点（补全题为主，深度可能不足）:')
for (const line of thin) console.log(' ', line)

const chThin = {}
for (const [id, n] of Object.entries(kpQ)) {
  const ch = id.match(/^kp(\d+)-/)?.[1] ?? '?'
  const key = `ch${ch}`
  if (!chThin[key]) chThin[key] = { total: 0, only2: 0, qs: 0 }
  chThin[key].total++
  if (n === 2) chThin[key].only2++
  chThin[key].qs += n
}
console.log('\n各章 KP 题量概况（only2=仅2题的KP数，avg=平均题/KP）:')
for (const ch of Object.keys(chThin).sort((a, b) => +a.slice(2) - +b.slice(2))) {
  const { total, only2, qs } = chThin[ch]
  console.log(`  ${ch}: ${total} KP, ${only2} 个仅2题, 平均 ${(qs / total).toFixed(1)} 题/KP`)
}

console.log('\n第7–10章 KP 题量明细（≤3题标出）:')
for (const ch of ['ch7', 'ch8', 'ch9', 'ch10']) {
  const rows = Object.entries(kpQ)
    .filter(([id]) => id.startsWith('kp' + ch.slice(2) + '-'))
    .sort((a, b) => a[0].localeCompare(b[0]))
  const thin = rows.filter(([, n]) => n <= 3)
  console.log(`  ${ch}: ${rows.length} KP, ≤3题 ${thin.length} 个`)
  for (const [id, n] of thin) {
    console.log(`    ${id}(${n}) ${kpTitle[id] ?? ''}`)
  }
}
