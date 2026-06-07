import { useState } from 'react'
import type { NoteGenerateContext, StudyNote } from '../types'
import { createStudyNote, copyMarkdown, downloadMarkdown } from '../services/notes'
import { useAppState } from '../hooks/useAppState'
import { useTutor } from '../context/TutorContext'
import { useToast } from './Toast'
import { proactiveNoteHint } from '../services/tutor'

interface NotePanelProps {
  context: NoteGenerateContext
  onSaved?: (note: StudyNote) => void
  onClose?: () => void
}

export function NotePanel({ context, onSaved, onClose }: NotePanelProps) {
  const { patch } = useAppState()
  const { pushTutorMessage } = useTutor()
  const { showToast } = useToast()
  const [preview, setPreview] = useState(() => createStudyNote(context))
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleRegenerate = () => {
    setPreview(createStudyNote(context))
    setSaved(false)
    showToast('笔记已重新生成')
  }

  const handleSave = () => {
    const note = preview
    patch((s) => ({ ...s, studyNotes: [note, ...s.studyNotes] }))
    setSaved(true)
    onSaved?.(note)
    showToast('笔记已保存到历史')
    pushTutorMessage('笔记已保存！考前可在「学习笔记」里复习导出。')
  }

  const handleCopy = async () => {
    const ok = await copyMarkdown(preview.markdown)
    setCopied(ok)
    if (ok) showToast('已复制到剪贴板')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="note-panel">
      <div className="note-panel-header">
        <h3>📝 学习笔记</h3>
        {onClose && (
          <button type="button" className="btn-ghost" onClick={onClose}>
            关闭
          </button>
        )}
      </div>
      <p className="note-hint">{proactiveNoteHint()}</p>
      <div className="note-preview">
        <pre>{preview.markdown}</pre>
      </div>
      <div className="note-actions">
        <button type="button" className="btn-secondary" onClick={handleRegenerate}>
          重新生成
        </button>
        <button type="button" className="btn-secondary" onClick={handleCopy}>
          {copied ? '已复制' : '复制 Markdown'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => downloadMarkdown(preview)}>
          导出 .md
        </button>
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saved}>
          {saved ? '已保存到历史' : '保存笔记'}
        </button>
      </div>
    </div>
  )
}
