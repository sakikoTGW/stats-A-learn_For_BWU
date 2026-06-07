import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { chapterNotes } from '../data/chapterNotes'
import {
  getBookKnowledgeTreeMd,
  getChapterExerciseMd,
  getGapChecklistMd,
  getHomeworkTableSnippet,
  getUserChapterMarkdown,
} from '../data/userChapterMarkdown'
import { MarkdownView } from '../components/MarkdownView'

type NoteView = 'full' | 'brief' | 'tree' | 'gap' | 'exercises'

export function ChapterNotes() {
  const [params] = useSearchParams()
  const [chapterId, setChapterId] = useState(params.get('chapter') ?? 'ch1')
  const initialView = (params.get('view') as NoteView) || 'full'
  const [view, setView] = useState<NoteView>(initialView)

  useEffect(() => {
    const c = params.get('chapter')
    if (c) setChapterId(c)
    const v = params.get('view') as NoteView
    if (v && ['full', 'brief', 'tree', 'gap', 'exercises'].includes(v)) setView(v)
  }, [params])

  const userMd = getUserChapterMarkdown(chapterId)
  const brief = chapterNotes.find((c) => c.chapterId === chapterId)
  const exerciseMd = getChapterExerciseMd(chapterId)
  const treeMd = getBookKnowledgeTreeMd()
  const gapMd = getGapChecklistMd()

  const viewTabs: { id: NoteView; label: string }[] = [
    { id: 'full', label: '完整笔记' },
    { id: 'brief', label: '精简提要' },
    { id: 'tree', label: '全书导图' },
    { id: 'gap', label: '挖漏清单' },
    { id: 'exercises', label: '习题逐题' },
  ]

  return (
    <div className="page textbook-page">
      <div className="page-header">
        <h2>章节重点笔记</h2>
        <p className="subtitle">
          直接读取 <code>章节重点笔记/</code> 下的 md，支持标题、表格、链接与 Mermaid 导图。
        </p>
        <div className="filters">
          <select value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          {viewTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={view === t.id ? 'chip active' : 'chip'}
              onClick={() => setView(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card textbook-actions">
        <Link to={`/learn?chapter=${chapterId}`} className="btn-primary">
          学知识点
        </Link>
        <Link to={`/practice?chapter=${chapterId}`} className="btn-secondary">
          刷题
        </Link>
        <Link to={`/diagnostic/${chapterId}`} className="btn-secondary">
          摸底
        </Link>
      </div>

      {view === 'tree' && (
        <article className="card textbook-body">
          <h3>全书知识点树图</h3>
          <p className="subtitle">源文件：全书知识点树图.md</p>
          {treeMd ? (
            <MarkdownView markdown={treeMd} />
          ) : (
            <p className="empty-state">未找到全书知识点树图.md</p>
          )}
        </article>
      )}

      {view === 'gap' && (
        <article className="card textbook-body">
          <h3>挖漏对照清单</h3>
          <p className="subtitle">源文件：挖漏对照清单.md</p>
          {gapMd ? (
            <MarkdownView markdown={gapMd} />
          ) : (
            <p className="empty-state">未找到挖漏对照清单.md</p>
          )}
        </article>
      )}

      {view === 'exercises' && (
        <article className="card textbook-body">
          <h3>{chapters.find((c) => c.id === chapterId)?.title} · 习题逐题精讲</h3>
          {exerciseMd ? (
            <>
              <p className="subtitle">源文件：{exerciseMd.fileName}</p>
              <MarkdownView markdown={exerciseMd.markdown} />
            </>
          ) : (
            <p className="empty-state">该章暂无习题逐题 md，请查看完整笔记文末习题区。</p>
          )}
        </article>
      )}

      {view === 'full' && userMd ? (
        <>
          {getHomeworkTableSnippet(chapterId) && (
            <div className="card highlight">
              <h3>课后题速记（备考优先背）</h3>
              <MarkdownView markdown={getHomeworkTableSnippet(chapterId)} compact />
            </div>
          )}
          <article className="card textbook-body">
            <h3>{userMd.title}</h3>
            <p className="subtitle">源文件：{userMd.fileName}</p>
            <MarkdownView markdown={userMd.markdown} />
          </article>
        </>
      ) : view === 'full' ? (
        <div className="card empty-state">
          <p>未找到该章笔记。请在「章节重点笔记」文件夹放入对应 md。</p>
        </div>
      ) : null}

      {view === 'brief' && brief ? (
        <>
          <div className="card">
            <h3>{brief.title} · 概要</h3>
            <p className="chapter-summary">{brief.summary}</p>
          </div>
          {brief.blocks.map((block) => (
            <div key={block.heading} className="card note-block">
              <h4>{block.heading}</h4>
              <p>{block.content}</p>
              {block.kpId && (
                <Link to={`/learn?chapter=${chapterId}&kp=${block.kpId}`} className="btn-ghost btn-sm">
                  对应知识点 →
                </Link>
              )}
            </div>
          ))}
        </>
      ) : view === 'brief' ? (
        <div className="card empty-state">
          <p>未找到该章精简提要。</p>
        </div>
      ) : null}
    </div>
  )
}

/** 供学习页内嵌的 KP 笔记片段 */
export function KpNoteAside({ chapterId, kpId }: { chapterId: string; kpId: string }) {
  const entry = chapterNotes.find((c) => c.chapterId === chapterId)
  const block = entry?.blocks.find((b) => b.kpId === kpId)
  if (!block) return null
  return (
    <div className="plain-box chapter-note-aside">
      <strong>📎 章节重点（笔记摘录）</strong>
      <p>{block.content}</p>
      <Link to={`/chapter-notes?chapter=${chapterId}`} className="btn-ghost btn-sm">
        查看完整章节笔记
      </Link>
    </div>
  )
}
