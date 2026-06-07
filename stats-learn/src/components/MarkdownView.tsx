import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { MermaidBlock } from './MermaidBlock'

const CHAPTER_MD_TO_ID: Record<string, string> = {
  '第01章-统计和统计学.md': 'ch1',
  '第02章-统计调查.md': 'ch2',
  '第03章-统计数据的整理与显示.md': 'ch3',
  '第04章-总量指标与相对指标.md': 'ch4',
  '第05章-平均指标.md': 'ch5',
  '第06章-标志变异指标.md': 'ch6',
  '第07章-抽样推断.md': 'ch7',
  '第08章-相关与回归分析.md': 'ch8',
  '第09章-时间数列分析.md': 'ch9',
  '第10章-统计指数.md': 'ch10',
}

export function resolveNotesAssetUrl(src: string): string {
  const clean = src.replace(/^\.\//, '')
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
    return src
  }
  if (clean.startsWith('图片/')) {
    return `/notes-assets/${clean}`
  }
  return src
}

export function resolveNotesLink(href: string, view?: string): string | null {
  if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
    return null
  }

  const [pathPart, hash] = href.split('#')
  const file = pathPart.replace(/^\.\//, '')
  const chapterId = CHAPTER_MD_TO_ID[file]

  if (file === '全书知识点树图.md') {
    return `/chapter-notes?view=tree${hash ? `#${hash}` : ''}`
  }
  if (file === '挖漏对照清单.md') {
    return `/chapter-notes?view=gap${hash ? `#${hash}` : ''}`
  }

  const exerciseMatch = file.match(/^第(\d+)章-.+-习题逐题\.md$/)
  if (exerciseMatch) {
    return `/chapter-notes?chapter=ch${Number(exerciseMatch[1])}&view=exercises${hash ? `#${hash}` : ''}`
  }

  if (chapterId) {
    const viewParam = view ? `&view=${view}` : ''
    return `/chapter-notes?chapter=${chapterId}${viewParam}${hash ? `#${hash}` : ''}`
  }

  return null
}

type Segment = { type: 'md'; content: string } | { type: 'mermaid'; content: string }

function splitMarkdown(markdown: string): Segment[] {
  const re = /```mermaid\s*\n([\s\S]*?)```/g
  const segments: Segment[] = []
  let last = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(markdown)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'md', content: markdown.slice(last, match.index) })
    }
    segments.push({ type: 'mermaid', content: match[1].trim() })
    last = match.index + match[0].length
  }

  if (last < markdown.length) {
    segments.push({ type: 'md', content: markdown.slice(last) })
  }

  return segments.length ? segments : [{ type: 'md', content: markdown }]
}

function renderMarkdownHtml(markdown: string): string {
  const renderer = new marked.Renderer()

  renderer.link = ({ href, text }) => {
    const route = resolveNotesLink(href ?? '')
    if (route) {
      return `<a href="${route}" class="md-link md-internal-link">${text}</a>`
    }
    return `<a href="${href ?? '#'}" class="md-link" target="_blank" rel="noreferrer">${text}</a>`
  }

  renderer.image = ({ href, text }) => {
    const src = resolveNotesAssetUrl(href ?? '')
    const caption = text ? `<figcaption class="md-caption">${text}</figcaption>` : ''
    return `<figure class="md-figure"><img src="${src}" alt="${text ?? ''}" loading="lazy" class="md-img" />${caption}</figure>`
  }

  renderer.table = (token) => {
    const head = token.header
      .map((cell) => `<th>${cell.text}</th>`)
      .join('')
    const body = token.rows
      .map((row) => `<tr>${row.map((cell) => `<td>${cell.text}</td>`).join('')}</tr>`)
      .join('')
    return `<div class="md-table-wrap"><table class="md-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`
  }

  const raw = marked.parse(markdown, { gfm: true, breaks: false, renderer }) as string
  return DOMPurify.sanitize(raw, {
    ADD_ATTR: ['target', 'rel', 'loading'],
    ADD_TAGS: ['figure', 'figcaption'],
  })
}

function MarkdownHtml({ markdown }: { markdown: string }) {
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const html = useMemo(() => renderMarkdownHtml(markdown), [markdown])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a.md-internal-link') as HTMLAnchorElement | null
      if (!anchor) return
      event.preventDefault()
      const href = anchor.getAttribute('href')
      if (href) navigate(href)
    }

    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [html, navigate])

  return <div ref={ref} className="md-html" dangerouslySetInnerHTML={{ __html: html }} />
}

export function MarkdownView({
  markdown,
  className = '',
  compact = false,
}: {
  markdown: string
  className?: string
  compact?: boolean
}) {
  const segments = useMemo(() => splitMarkdown(markdown), [markdown])

  return (
    <div className={`markdown-body ${compact ? 'markdown-body-compact' : ''} ${className}`.trim()}>
      {segments.map((seg, i) =>
        seg.type === 'mermaid' ? (
          <MermaidBlock key={`m-${i}`} chart={seg.content} />
        ) : (
          <MarkdownHtml key={`t-${i}`} markdown={seg.content} />
        )
      )}
    </div>
  )
}
