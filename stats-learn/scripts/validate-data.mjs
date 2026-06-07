/**
 * 仅做数据校验，不生成任何题目。运行：node scripts/validate-data.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const chapters = fs.readFileSync(path.join(root, 'src/data/chapters.ts'), 'utf8')
const questions = fs.readFileSync(path.join(root, 'src/data/questions.ts'), 'utf8')
const homework = fs.readFileSync(path.join(root, 'src/data/homeworkQuestions.ts'), 'utf8')
const supPath = path.join(root, 'src/data/supplementQuestions.ts')
const supplement = fs.existsSync(supPath) ? fs.readFileSync(supPath, 'utf8') : ''

const kps = [...chapters.matchAll(/id: '(kp[^']+)'/g)].map((m) => m[1])
const kpSet = new Set(kps)
const chIds = [...chapters.matchAll(/id: '(ch\d+)'/g)].map((m) => m[1])
const chSet = new Set(chIds)

let errors = 0
const allQ = questions + homework + supplement

for (const m of allQ.matchAll(/knowledgePointIds: (\[[^\]]+\])/g)) {
  const ids = JSON.parse(m[1].replace(/'/g, '"'))
  for (const id of ids) {
    if (!kpSet.has(id)) {
      console.error('无效 KP 引用:', id)
      errors++
    }
  }
}

for (const m of allQ.matchAll(/chapterId: '(ch\d+)'/g)) {
  if (!chSet.has(m[1])) {
    console.error('无效章节:', m[1])
    errors++
  }
}

if (/证明微积分定理|编写程序语法/.test(allQ)) {
  console.error('发现批量垃圾题文案')
  errors++
}

const kpQ = Object.fromEntries(kps.map((id) => [id, 0]))
for (const m of allQ.matchAll(/knowledgePointIds: (\[[^\]]+\])/g)) {
  const ids = JSON.parse(m[1].replace(/'/g, '"'))
  for (const id of ids) {
    if (kpQ[id] !== undefined) kpQ[id]++
  }
}
const low = Object.entries(kpQ).filter(([, n]) => n < 2)
if (low.length) {
  console.error('少于 2 题的知识点:', low.map(([id, n]) => `${id}(${n})`).join(', '))
  errors += low.length
}

const byCh = {}
for (const m of allQ.matchAll(/chapterId: '(ch\d+)'/g)) {
  byCh[m[1]] = (byCh[m[1]] || 0) + 1
}

console.log('KP 数:', kps.length)
console.log('各章题数:', byCh)
console.log(errors ? `失败：${errors} 项` : '校验通过')
process.exit(errors ? 1 : 0)
