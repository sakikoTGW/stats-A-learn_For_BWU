import { useState } from 'react'
import { useToast } from './Toast'
import type { FinalExamPaper } from '../types/finalExam'
import {
  copyTextToClipboard,
  downloadTextFile,
  type FinalExamExportMode,
  formatPaperForAi,
} from '../utils/finalExamExport'
import type { FinalExamResultRow } from '../utils/finalExamUtils'

const MODE_LABEL: Record<FinalExamExportMode, string> = {
  exam: '仅题目',
  answer: '题目+解答',
  review: '我的复盘',
  wrong: '仅错题',
}

export function FinalExamCopyBar({
  paper,
  results,
  compact,
}: {
  paper: FinalExamPaper
  results?: FinalExamResultRow[]
  compact?: boolean
}) {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)

  const modes: FinalExamExportMode[] = results
    ? ['wrong', 'review', 'answer', 'exam']
    : ['answer', 'exam']

  const handleCopy = async (mode: FinalExamExportMode) => {
    const text = formatPaperForAi(paper, mode, results)
    if (mode === 'wrong' && results && !results.some((r) => r.q.type !== 'calc' && r.correct === false)) {
      showToast('没有错题可复制')
      return
    }
    const ok = await copyTextToClipboard(text)
    showToast(ok ? `已复制：${MODE_LABEL[mode]}` : '复制失败，请手动全选')
    setOpen(false)
  }

  const handleDownload = (mode: FinalExamExportMode) => {
    const text = formatPaperForAi(paper, mode, results)
    const suffix = { exam: '题目', answer: '题目与解答', review: '复盘', wrong: '错题' }[mode]
    downloadTextFile(`${paper.id}-${suffix}.txt`, text)
    showToast(`已下载 ${suffix}.txt`)
  }

  if (compact) {
    return (
      <div className="final-exam-copy-bar compact">
        <button type="button" className="btn btn-sm" onClick={() => handleCopy('answer')}>
          复制题目+解答
        </button>
        {results && (
          <button type="button" className="btn btn-sm" onClick={() => handleCopy('wrong')}>
            复制错题
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="plain-box final-exam-copy-bar">
      <strong>📋 复制给 AI 讲解</strong>
      <p className="muted">一键复制格式化文本，粘贴到 ChatGPT / Claude 等即可逐题问。</p>
      <div className="final-exam-copy-actions">
        {modes.map((mode) => (
          <button key={mode} type="button" className="btn btn-sm" onClick={() => handleCopy(mode)}>
            复制{MODE_LABEL[mode]}
          </button>
        ))}
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setOpen((o) => !o)}>
          下载 txt
        </button>
      </div>
      {open && (
        <div className="final-exam-copy-actions">
          {modes.map((mode) => (
            <button key={`dl-${mode}`} type="button" className="btn btn-sm btn-ghost" onClick={() => handleDownload(mode)}>
              下载{MODE_LABEL[mode]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
