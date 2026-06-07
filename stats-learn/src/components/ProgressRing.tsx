interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  label?: string
}

export function ProgressRing({ value, max = 100, size = 56, label }: ProgressRingProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <div className="progress-ring" style={{ width: size, height: size }} title={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="progress-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth="5"
        />
        <circle
          className="progress-ring-fg"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth="5"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="progress-ring-text">{pct}%</span>
      {label && <span className="progress-ring-label">{label}</span>}
    </div>
  )
}
