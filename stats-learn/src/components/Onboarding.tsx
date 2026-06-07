import { useState } from 'react'
import { useAppState } from '../hooks/useAppState'

const STEPS = [
  {
    title: '① 学前摸底',
    body: '每章开学前做 5–8 道快题，找出薄弱点，学伴会按结果推荐学习顺序。',
  },
  {
    title: '② 按计划学习',
    body: '今日计划 → 针对性学知识点 → 刷题巩固 → 复习错题，流程清晰不迷路。',
  },
  {
    title: '③ 学伴陪你',
    body: '右下角「学伴」随时给建议、答疑；学完可一键生成笔记保存。',
  },
]

export function Onboarding() {
  const { state, patch } = useAppState()
  const [step, setStep] = useState(0)

  if (state.settings.onboardingDone) return null

  const finish = () => {
    patch((s) => ({
      ...s,
      settings: { ...s.settings, onboardingDone: true },
    }))
  }

  const current = STEPS[step]

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true">
      <div className="onboarding-card">
        <h3>欢迎使用统计课学习助手</h3>
        <p className="onboarding-step">{current.title}</p>
        <p>{current.body}</p>
        <div className="onboarding-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={i === step ? 'dot active' : 'dot'} />
          ))}
        </div>
        <div className="row-actions">
          {step > 0 && (
            <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
              上一步
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn-primary" onClick={() => setStep((s) => s + 1)}>
              下一步
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={finish}>
              开始学习
            </button>
          )}
          <button type="button" className="btn-ghost" onClick={finish}>
            跳过
          </button>
        </div>
      </div>
    </div>
  )
}
