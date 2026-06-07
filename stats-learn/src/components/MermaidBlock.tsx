import { useEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'

let mermaidReady = false

function ensureMermaid() {
  if (mermaidReady) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'strict',
    fontFamily: '"Noto Sans SC", system-ui, sans-serif',
  })
  mermaidReady = true
}

export function MermaidBlock({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '')
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let cancelled = false
    ensureMermaid()

    ;(async () => {
      try {
        const { svg } = await mermaid.render(`mmd-${id}-${Date.now()}`, chart.trim())
        if (!cancelled) {
          el.innerHTML = svg
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Mermaid 渲染失败')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [chart, id])

  if (error) {
    return (
      <div className="mermaid-fallback">
        <p className="hint-text">导图渲染失败，原文如下：</p>
        <pre>{chart}</pre>
      </div>
    )
  }

  return <div ref={ref} className="mermaid-diagram" aria-label="知识导图" />
}
