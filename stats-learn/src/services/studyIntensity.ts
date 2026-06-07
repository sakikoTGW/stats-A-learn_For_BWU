import type { StudyIntensity } from '../types'

export interface IntensityPlan {
  kpCount: number
  questionCount: number
  label: string
  subtitle: string
}

export const INTENSITY_OPTIONS: { value: StudyIntensity; plan: IntensityPlan }[] = [
  {
    value: 'light',
    plan: { kpCount: 1, questionCount: 3, label: '轻松', subtitle: '1 个知识点 + 3 题' },
  },
  {
    value: 'standard',
    plan: { kpCount: 2, questionCount: 6, label: '标准', subtitle: '2 个知识点 + 6 题' },
  },
  {
    value: 'sprint',
    plan: { kpCount: 3, questionCount: 10, label: '冲刺', subtitle: '3 个知识点 + 10 题' },
  },
]

export function getIntensityPlan(intensity?: StudyIntensity): IntensityPlan {
  const found = INTENSITY_OPTIONS.find((o) => o.value === (intensity ?? 'standard'))
  return found?.plan ?? INTENSITY_OPTIONS[1].plan
}
