import type { TodayFlowSession } from '../services/todayFlow'
import { flowStepLabel } from '../services/todayFlow'

interface Props {
  session: TodayFlowSession
  onSkip?: () => void
}

export function TodayFlowStepper({ session, onSkip }: Props) {
  const steps = [1, 2, 3, 4] as const
  const pct = ((session.currentStep - 1) / 3) * 100

  return (
    <div className="flow-stepper card">
      <div className="flow-stepper-head">
        <span className="flow-step-label">
          第 {session.currentStep}/4 步 · {flowStepLabel(session.currentStep, session)}
        </span>
        {onSkip && session.currentStep < 4 && (
          <button type="button" className="btn-ghost btn-sm" onClick={onSkip}>
            跳过本步
          </button>
        )}
      </div>
      <div className="flow-step-dots">
        {steps.map((n) => (
          <span
            key={n}
            className={`flow-dot ${n < session.currentStep ? 'done' : ''} ${n === session.currentStep ? 'current' : ''}`}
            title={flowStepLabel(n, session)}
          />
        ))}
      </div>
      <div className="progress-bar flow-progress">
        <div style={{ width: `${pct + 25}%` }} />
      </div>
    </div>
  )
}
