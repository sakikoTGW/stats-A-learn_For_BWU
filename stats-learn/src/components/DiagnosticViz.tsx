import type { DiagnosticResult } from '../types'

interface Props {
  result: DiagnosticResult
  weakTitles: string[]
}

export function DiagnosticViz({ result, weakTitles }: Props) {
  const bars = [
    { label: '正确', value: result.correct, color: 'var(--success)' },
    { label: '错误', value: result.total - result.correct, color: 'var(--danger)' },
  ]
  const max = Math.max(result.total, 1)

  const tags = [
    ...result.weakTags.map((t) => ({ text: t, size: 'lg' as const })),
    ...weakTitles.map((t) => ({ text: t, size: 'md' as const })),
  ]

  return (
    <div className="diagnostic-viz">
      <div className="viz-bars">
        <p className="viz-title">正确率分布</p>
        {bars.map((b) => (
          <div key={b.label} className="viz-bar-row">
            <span className="viz-bar-label">{b.label}</span>
            <div className="viz-bar-track">
              <div
                className="viz-bar-fill"
                style={{ width: `${(b.value / max) * 100}%`, background: b.color }}
              />
            </div>
            <span className="viz-bar-num">{b.value}</span>
          </div>
        ))}
        <p className="viz-accuracy-center">
          <strong>{result.accuracy}%</strong> 总正确率
        </p>
      </div>

      {tags.length > 0 && (
        <div className="viz-tag-cloud">
          <p className="viz-title">薄弱标签云</p>
          <div className="tag-cloud">
            {tags.map((t, i) => (
              <span key={`${t.text}-${i}`} className={`cloud-tag size-${t.size}`}>
                {t.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
