import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { chapters, knowledgePoints } from '../data/chapters'
import { useAppState } from '../hooks/useAppState'
import { defaultProgress } from '../services/review'
import { MASTERY_LABELS, type MasteryLevel } from '../types'
import { countQuestionsForKp } from '../services/questionStats'
import { getDiagnostic } from '../services/diagnostic'
import { KpNoteAside } from './ChapterNotes'
import { KpMiniPractice } from '../components/KpMiniPractice'
import { MarkdownView } from '../components/MarkdownView'
import { getBookKnowledgeTreeMd } from '../data/userChapterMarkdown'

const bookTreeMd = (() => {
  const md = getBookKnowledgeTreeMd()
  const m = md.match(/```mermaid[\s\S]*?```/)
  return m ? `## 全书知识导图\n\n${m[0]}` : '## 全书结构\n\n见章节重点笔记。'
})()

export function KpTreeReview() {
  const [params, setParams] = useSearchParams()
  const { state, patch } = useAppState()
  const initialChapter = params.get('chapter') ?? 'ch1'

  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => new Set([initialChapter]))
  const [tab, setTab] = useState<'learn' | 'practice'>('learn')

  const kpsByChapter = useMemo(() => {
    const map: Record<string, typeof knowledgePoints> = {}
    for (const ch of chapters) map[ch.id] = []
    for (const kp of knowledgePoints) {
      if (map[kp.chapterId]) map[kp.chapterId].push(kp)
    }
    return map
  }, [])

  const chapterId = params.get('chapter') ?? initialChapter
  const kpId = params.get('kp') ?? kpsByChapter[chapterId]?.[0]?.id ?? 'kp1-1'
  const kp = knowledgePoints.find((k) => k.id === kpId)
  const diag = getDiagnostic(state, chapterId)
  const weakSet = useMemo(() => new Set(diag?.weakKnowledgePointIds ?? []), [diag])

  useEffect(() => {
    setExpandedChapters((prev) => new Set(prev).add(chapterId))
  }, [chapterId])

  const selectKp = (ch: string, id: string) => {
    setParams({ chapter: ch, kp: id })
    setTab('learn')
  }

  const toggleChapter = (ch: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      if (next.has(ch)) next.delete(ch)
      else next.add(ch)
      return next
    })
  }

  const setMastery = (m: MasteryLevel) => {
    if (!kp) return
    const base = state.knowledgeProgress[kp.id] ?? defaultProgress(kp.id)
    patch((s) => ({
      ...s,
      knowledgeProgress: {
        ...s.knowledgeProgress,
        [kp.id]: { ...base, mastery: m },
      },
    }))
  }

  const prog = kp ? state.knowledgeProgress[kp.id] ?? defaultProgress(kp.id) : null
  const chapterKpCount = kpsByChapter[chapterId]?.length ?? 0
  const chapterQCount = kpsByChapter[chapterId]?.reduce((s, k) => s + countQuestionsForKp(k.id), 0) ?? 0

  return (
    <div className="page kp-tree-page">
      <div className="page-header">
        <div>
          <h2>按知识点复习</h2>
          <p className="page-sub">
            全书 {knowledgePoints.length} 个知识点 · 左侧树选 KP · 右侧学笔记 + 刷题
          </p>
        </div>
        <Link to="/chapter-notes?view=tree" className="btn-ghost btn-sm">
          全书导图
        </Link>
      </div>

      <div className="card kp-book-tree-preview">
        <strong>全书结构（导图预览）</strong>
        <MarkdownView markdown={bookTreeMd} compact className="kp-book-mermaid" />
      </div>

      <div className="kp-tree-layout">
        <aside className="kp-tree-sidebar card">
          <div className="kp-tree-sidebar-head">
            <strong>知识点树</strong>
            <span className="muted-sm">{chapters.length} 章</span>
          </div>
          <ul className="kp-chapter-tree">
            {chapters.map((ch) => {
              const kps = kpsByChapter[ch.id] ?? []
              const open = expandedChapters.has(ch.id)
              const mastered = kps.filter((k) => (state.knowledgeProgress[k.id]?.mastery ?? 0) >= 3).length
              return (
                <li key={ch.id} className={chapterId === ch.id ? 'active-chapter' : ''}>
                  <button type="button" className="kp-chapter-row" onClick={() => toggleChapter(ch.id)}>
                    <span className="kp-tree-chevron">{open ? '▼' : '▶'}</span>
                    <span className="kp-chapter-title">{ch.title.replace(/^第.+章\s*/, 'Ch')}</span>
                    <span className="kp-chapter-meta">
                      {mastered}/{kps.length}
                    </span>
                  </button>
                  {open && (
                    <ul className="kp-leaf-list">
                      {kps.map((k) => {
                        const m = state.knowledgeProgress[k.id]?.mastery ?? 0
                        const qn = countQuestionsForKp(k.id)
                        const active = k.id === kpId
                        return (
                          <li key={k.id}>
                            <button
                              type="button"
                              className={`kp-leaf-btn ${active ? 'active' : ''} mastery-${m}`}
                              onClick={() => selectKp(ch.id, k.id)}
                            >
                              <span className="kp-leaf-mastery" title={MASTERY_LABELS[m as MasteryLevel]}>
                                {m}
                              </span>
                              <span className="kp-leaf-title">
                                {weakSet.has(k.id) && '⭐ '}
                                {k.title}
                              </span>
                              <span className="kp-leaf-q">{qn}题</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="kp-tree-main">
          {!kp ? (
            <div className="card empty-state">请从左侧选择一个知识点</div>
          ) : (
            <>
              <div className="card kp-tree-main-head">
                <div>
                  <p className="breadcrumb-sm">
                    {chapters.find((c) => c.id === chapterId)?.title} · {chapterKpCount} KP · {chapterQCount} 题
                  </p>
                  <h3>{kp.title}</h3>
                </div>
                <div className="kp-tab-row">
                  <button
                    type="button"
                    className={tab === 'learn' ? 'chip active' : 'chip'}
                    onClick={() => setTab('learn')}
                  >
                    📖 学知识
                  </button>
                  <button
                    type="button"
                    className={tab === 'practice' ? 'chip active' : 'chip'}
                    onClick={() => setTab('practice')}
                  >
                    ✏️ 刷本题 ({countQuestionsForKp(kp.id)})
                  </button>
                  <Link to={`/learn?chapter=${chapterId}&kp=${kpId}`} className="btn-ghost btn-sm">
                    完整学习页
                  </Link>
                </div>
              </div>

              {tab === 'learn' ? (
                <div className="card learn-card kp-tree-learn">
                  <div className="plain-box">
                    <strong>通俗讲</strong>
                    <p>{kp.plainExplanation}</p>
                  </div>
                  {kp.formulas && kp.formulas.length > 0 && (
                    <div className="formula-strip">
                      {kp.formulas.map((f) => (
                        <code key={f}>{f}</code>
                      ))}
                    </div>
                  )}
                  {kp.mnemonic && <div className="tip-box">🎯 口诀：{kp.mnemonic}</div>}
                  {kp.analogy && <div className="tip-box">💡 类比：{kp.analogy}</div>}
                  <KpNoteAside chapterId={chapterId} kpId={kpId} />
                  <div className="mastery-row">
                    <span>掌握度：</span>
                    {([0, 1, 2, 3, 4] as MasteryLevel[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={prog?.mastery === m ? 'chip active' : 'chip'}
                        onClick={() => setMastery(m)}
                      >
                        {MASTERY_LABELS[m]}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="btn-primary" onClick={() => setTab('practice')}>
                    学完 · 刷 {countQuestionsForKp(kp.id)} 道题
                  </button>
                </div>
              ) : (
                <KpMiniPractice chapterId={chapterId} kpId={kpId} />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
