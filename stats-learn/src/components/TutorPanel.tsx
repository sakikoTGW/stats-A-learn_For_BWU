import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'
import { useTutor } from '../context/TutorContext'
import {
  answerUserQuestion,
  buildTutorContext,
  generateSuggestions,
  replyForChip,
  TUTOR_QUICK_CHIPS,
} from '../services/tutor'
import { explainWithLlmOrTemplate } from '../services/tutorExplain'
import { chapterIdFromRoute } from '../services/tutorRouteContext'

export function TutorPanel() {
  const { state } = useAppState()
  const location = useLocation()
  const params = useParams()
  const {
    open,

    setOpen,

    halfScreen,

    setHalfScreen,

    messages,

    pushTutorMessage,

    pushUserMessage,

    unread,

    clearUnread,

  } = useTutor()

  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)

  const routeChapter =
    chapterIdFromRoute(location.pathname, location.search, params) ?? state.lastChapterId
  const ctx = buildTutorContext(state, routeChapter)
  const suggestions = generateSuggestions(state, ctx)



  useEffect(() => {

    if (open) clearUnread()

  }, [open, clearUnread])



  useEffect(() => {

    if (open && listRef.current) {

      listRef.current.scrollTop = listRef.current.scrollHeight

    }

  }, [messages, open])



  const handleSend = async () => {

    const q = input.trim()

    if (!q || sending) return

    pushUserMessage(q)

    setInput('')

    setSending(true)

    let reply = answerUserQuestion(q, ctx, state)

    if (reply.length < 80 || q.length > 4) {

      const enhanced = await explainWithLlmOrTemplate(q, ctx, state)

      if (enhanced.length > reply.length) reply = enhanced

    }

    pushTutorMessage(reply)

    setSending(false)

  }



  const handleChip = (chipId: string, label: string) => {

    pushUserMessage(label)

    pushTutorMessage(replyForChip(chipId, ctx))

  }



  if (!open) {
    return (
      <button
        type="button"
        className="tutor-fab"
        onClick={() => setOpen(true)}
        aria-label={unread > 0 ? `打开学伴，${unread} 条未读` : '打开学伴'}
      >
        🎓 学伴
        {unread > 0 && <span className="tutor-badge">{unread > 99 ? '99+' : unread}</span>}
      </button>
    )
  }



  const panelClass = `tutor-panel ${halfScreen ? 'tutor-panel-half' : ''}`



  return (

    <aside className={panelClass} aria-label="AI 学伴">

      <header className="tutor-panel-header">

        <div>

          <strong>🎓 学伴教练</strong>

          <p className="tutor-context-line">

            {ctx.chapterTitle}

            {ctx.diagnosticDone ? ` · 摸底 ${ctx.diagnosticAccuracy}%` : ' · 未摸底'}

            {ctx.wrongCount > 0 ? ` · 错题 ${ctx.wrongCount}` : ''}

          </p>

        </div>

        <div className="tutor-header-actions">

          <button

            type="button"

            className="btn-ghost btn-sm"

            onClick={() => setHalfScreen(!halfScreen)}

            title={halfScreen ? '改为小窗' : '改为半屏'}

          >

            {halfScreen ? '小窗' : '半屏'}

          </button>

          <button
            type="button"
            className="btn-ghost btn-sm tutor-close-btn"
            onClick={() => setOpen(false)}
            aria-label="关闭学伴"
            title="关闭"
          >
            ✕
          </button>
        </div>
      </header>



      <div className="tutor-suggestions">

        <span className="tutor-suggest-label">建议行动</span>

        <ul>

          {suggestions.map((s) => (

            <li key={s.id}>

              <p className="suggest-text">{s.text}</p>

              <p className="suggest-reason">{s.reason}</p>

              {s.action && (

                <Link to={s.action.path} className="btn-secondary btn-sm" onClick={() => setOpen(false)}>

                  {s.action.label}

                </Link>

              )}

            </li>

          ))}

        </ul>

      </div>



      <div className="tutor-chips">

        {TUTOR_QUICK_CHIPS.map((c) => (

          <button key={c.id} type="button" className="chip tutor-chip" onClick={() => handleChip(c.id, c.label)}>

            {c.label}

          </button>

        ))}

      </div>



      <div className="tutor-messages" ref={listRef}>

        {messages.map((m) => (

          <div key={m.id} className={`tutor-msg ${m.role}`}>

            {m.text}

          </div>

        ))}

      </div>



      <div className="tutor-input-row">

        <input

          type="text"

          placeholder="问：怎么学、错题、计划、笔记…"

          value={input}

          onChange={(e) => setInput(e.target.value)}

          onKeyDown={(e) => e.key === 'Enter' && void handleSend()}

        />

        <button type="button" className="btn-primary" onClick={() => void handleSend()} disabled={sending}>

          {sending ? '…' : '发送'}

        </button>

      </div>

    </aside>

  )

}

