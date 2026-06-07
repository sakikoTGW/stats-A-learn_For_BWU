/**
 * 对照全书导图叶节点清单，检查 chapters.ts 是否已收录。
 * 运行：node scripts/audit-kp-coverage.mjs
 */
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const chapters = readFileSync(join(root, 'src/data/chapters.ts'), 'utf8')
const kps = [...chapters.matchAll(/id: '(kp[^']+)',\s*chapterId: '(ch\d+)',\s*title: '([^']+)'/g)]

const byCh = {}
for (const [, id, ch, title] of kps) {
  if (!byCh[ch]) byCh[ch] = []
  byCh[ch].push({ id, title })
}

console.log('知识点总数:', kps.length)
for (const ch of Object.keys(byCh).sort()) {
  console.log(`  ${ch}: ${byCh[ch].length} 个`)
}
console.log('\n各章 KP 列表见 chapters.ts；对照源：章节重点笔记/全书知识点树图.md')
