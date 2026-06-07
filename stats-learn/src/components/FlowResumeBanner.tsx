import { Link, useLocation } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'
import { flowPath, flowStepLabel, loadTodayFlow } from '../services/todayFlow'

/** 今日流程进行中但用户从导航切走时，提示继续 */
export function FlowResumeBanner() {
  const { pathname, search } = useLocation()
  const { state } = useAppState()
  const flow = loadTodayFlow()

  if (!flow?.active || search.includes('flow=today')) return null
  if (pathname === '/' && search.includes('celebrate=1')) return null

  return (
    <div className="flow-resume-banner" role="status">
      <span>
        今日学习进行中 · 第 {flow.currentStep}/4 步 ·{' '}
        {flowStepLabel(flow.currentStep, flow)}
      </span>
      <Link to={flowPath(flow, state)} className="btn-secondary btn-sm">
        继续
      </Link>
    </div>
  )
}
