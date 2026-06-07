import { useEffect, useState } from 'react'

import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useAppState } from '../hooks/useAppState'

import { ensureTodayPlan, generateDailyPlan } from '../services/plan'

import { useToast } from '../components/Toast'

import { ChapterCards } from '../components/ChapterCards'

import { TodayFlowStepper } from '../components/TodayFlowStepper'

import { CompletionCelebration } from '../components/CompletionCelebration'

import {

  loadTodayFlow,

  startTodayFlow,

  flowPath,

  skipFlowStep,

  stepKeyForIndex,

  completeTodayFlow,

} from '../services/todayFlow'

import type { TodayFlowSession } from '../services/todayFlow'

import { recordStudyDay, streakLabel, loadStreak } from '../services/streak'

import { useTutor } from '../context/TutorContext'

import { INTENSITY_OPTIONS, getIntensityPlan } from '../services/studyIntensity'

import { applyFlowToDailyPlan } from '../services/planFlowSync'



const TYPE_LABELS: Record<string, string> = {

  diagnostic: '摸底',

  learn: '学习',

  practice: '刷题',

  review: '复习',

  summary: '小结',

}



export function TodayPlan() {

  const { state, patch } = useAppState()

  const { showToast } = useToast()

  const navigate = useNavigate()

  const [params] = useSearchParams()

  const { pushTutorMessage } = useTutor()

  const date = new Date().toISOString().slice(0, 10)

  const plan = state.dailyPlans[date] ?? generateDailyPlan(state)



  const [flow, setFlow] = useState<TodayFlowSession | null>(() => loadTodayFlow())

  const [showCelebrate, setShowCelebrate] = useState(params.get('celebrate') === '1')

  const [streak, setStreak] = useState(loadStreak)



  useEffect(() => {
    if (params.get('celebrate') !== '1') return
    const f = loadTodayFlow()
    if (f && !f.completed) {
      const done = completeTodayFlow(f)
      setFlow(done)
      patch((s) => applyFlowToDailyPlan(s, done))
      const s = recordStudyDay()
      setStreak(s)
      pushTutorMessage('🎉 今日一键学习完成！明天继续点「开始今日学习」即可。')
    }
    setShowCelebrate(true)
  }, [params.get('celebrate'), pushTutorMessage])



  const handleStartToday = () => {

    const session = startTodayFlow(state)

    setFlow(session)

    patch((s) => ensureTodayPlan(s))

    navigate(flowPath(session, state))

    showToast('已开启今日学习，按步骤来即可')

  }



  const handleResumeFlow = () => {

    if (!flow) return

    navigate(flowPath(flow, state))

  }



  const handleSkipStep = () => {

    if (!flow) return

    const key = stepKeyForIndex(flow.currentStep)

    const next = skipFlowStep(flow, key)

    setFlow(next)

    patch((s) => applyFlowToDailyPlan(s, next))

    navigate(flowPath(next, state))

    showToast('已跳过本步')

  }



  const markDone = (id: string) => {

    patch((s) => {

      const p = s.dailyPlans[date]

      if (!p) return s

      return {

        ...s,

        dailyPlans: {

          ...s.dailyPlans,

          [date]: {

            ...p,

            items: p.items.map((i) => (i.id === id ? { ...i, completed: true } : i)),

          },

        },

      }

    })

    showToast('任务已标记完成')

  }



  const refreshPlan = () => {

    patch((s) => ({

      ...ensureTodayPlan(s),

      dailyPlans: { ...s.dailyPlans, [date]: generateDailyPlan(s) },

    }))

    showToast('今日计划已更新')

  }



  const done = plan.items.filter((i) => i.completed).length

  const flowActive = flow?.active && !flow.completed

  const intensityPlan = getIntensityPlan(state.settings.studyIntensity)

  const withFlow = (url: string) => {
    if (!flowActive) return url
    return url.includes('?') ? `${url}&flow=today` : `${url}?flow=today`
  }

  const linkFor = (type: string, targetId?: string, chapterId?: string) => {
    if (type === 'diagnostic') return withFlow(`/diagnostic/${chapterId ?? 'ch1'}`)

    if (type === 'learn') {
      const base = targetId
        ? `/learn?kp=${targetId}&chapter=${chapterId ?? ''}`
        : '/learn'
      return withFlow(base)
    }

    if (type === 'practice') return withFlow(chapterId ? `/practice?chapter=${chapterId}` : '/practice')

    if (type === 'review') return '/review'

    if (type === 'summary') return '/summary'

    return '/'
  }



  return (

    <div className="page">

      {showCelebrate && (

        <CompletionCelebration

          streak={streak}

          onClose={() => {

            setShowCelebrate(false)

            navigate('/', { replace: true })

          }}

          onNote={() => navigate('/notes')}

        />

      )}



      <div className="hero-today">

        <div className="hero-today-text">

          <p className="streak-pill">{streakLabel()}</p>

          <h2>今天学什么？</h2>

          <p className="subtitle">
            一键走完：摸底 → {intensityPlan.kpCount} 个知识点 → {intensityPlan.questionCount} 题 → 完成祝贺
          </p>
          <div className="intensity-row compact">
            {INTENSITY_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                className={`chip ${(state.settings.studyIntensity ?? 'standard') === o.value ? 'active' : ''}`}
                onClick={() =>
                  patch((s) => ({
                    ...s,
                    settings: { ...s.settings, studyIntensity: o.value },
                  }))
                }
              >
                {o.plan.label}
              </button>
            ))}
            <Link to="/settings" className="btn-ghost btn-sm">
              更多设置
            </Link>
          </div>

        </div>

        {flowActive ? (

          <button type="button" className="btn-hero" onClick={handleResumeFlow}>

            继续今日学习

          </button>

        ) : (

          <button type="button" className="btn-hero" onClick={handleStartToday}>

            开始今日学习

          </button>

        )}

      </div>



      {flowActive && flow && (

        <TodayFlowStepper session={flow} onSkip={handleSkipStep} />

      )}



      <ChapterCards state={state} />



      <details className="plan-details">

        <summary>展开今日任务清单（{done}/{plan.items.length}）</summary>

        <div className="plan-details-inner">

          <button type="button" className="btn-ghost btn-sm" onClick={refreshPlan}>

            重新生成计划

          </button>

          <ul className="plan-list">

            {plan.items.map((item) => (

              <li key={item.id} className={`plan-item ${item.completed ? 'done' : ''}`}>

                <div className="plan-item-body">

                  <span className="plan-type">{TYPE_LABELS[item.type] ?? item.type}</span>

                  <strong>{item.title}</strong>

                  <p>{item.description}</p>

                </div>

                <div className="plan-item-actions">

                  {!item.completed && (

                    <Link to={linkFor(item.type, item.targetId, item.chapterId)} className="btn-secondary">

                      开始

                    </Link>

                  )}

                  {!item.completed && (

                    <button type="button" className="btn-ghost" onClick={() => markDone(item.id)}>

                      标记完成

                    </button>

                  )}

                </div>

              </li>

            ))}

          </ul>

        </div>

      </details>



      <div className="quick-links">

        <Link to="/wrong-book" className="card link-card ghost-link">

          📕 错题本

        </Link>

        <Link to="/notes" className="card link-card ghost-link">

          📝 学习笔记

        </Link>

      </div>

    </div>

  )

}

