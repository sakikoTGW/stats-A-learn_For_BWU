import { useMemo, useState } from 'react'
import { chapters } from '../data/chapters'
import { useAppState } from '../hooks/useAppState'
import { copyMarkdown, downloadMarkdown } from '../services/notes'
import type { StudyNote } from '../types'

export function Notes() {
  const { state } = useAppState()
  const [chapterFilter, setChapterFilter] = useState('all')
  const [selected, setSelected] = useState<StudyNote | null>(null)
  const [copied, setCopied] = useState(false)

  const sorted = useMemo(() => {
    return [...state.studyNotes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [state.studyNotes])

  const filtered = useMemo(() => {
    if (chapterFilter === 'all') return sorted
    return sorted.filter((n) => n.chapterId === chapterFilter)
  }, [sorted, chapterFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, StudyNote[]>()
    for (const n of filtered) {
      const day = n.createdAt.slice(0, 10)
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(n)
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  const handleCopy = async (md: string) => {
    const ok = await copyMarkdown(md)
    setCopied(ok)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>学习笔记</h2>
        <p className="subtitle">历史笔记保存在浏览器本地（localStorage）</p>
      </div>

      <div className="card">
        <label>
          按章节筛选
          <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)}>
            <option value="all">全部章节</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty">
          <p>还没有保存的笔记。</p>
          <p>在学知识点、刷题或复习结束后，点击「生成笔记」并保存即可出现在这里。</p>
        </div>
      ) : (
        <div className="notes-layout">
          <aside className="notes-sidebar">
            {grouped.map(([day, notes]) => (
              <div key={day} className="notes-group">
                <h4>{day}</h4>
                <ul>
                  {notes.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        className={selected?.id === n.id ? 'note-item active' : 'note-item'}
                        onClick={() => setSelected(n)}
                      >
                        <span className="note-source">{n.source}</span>
                        {n.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>
          {selected && (
            <div className="notes-detail card">
              <h3>{selected.title}</h3>
              <p className="subtitle">{selected.chapterTitle} · {new Date(selected.createdAt).toLocaleString('zh-CN')}</p>
              <div className="note-preview">
                <pre>{selected.markdown}</pre>
              </div>
              <div className="note-actions">
                <button type="button" className="btn-secondary" onClick={() => handleCopy(selected.markdown)}>
                  {copied ? '已复制' : '复制'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => downloadMarkdown(selected)}>
                  导出 .md
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
