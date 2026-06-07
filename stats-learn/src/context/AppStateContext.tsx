import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppState } from '../types'
import { loadState, saveState } from '../services/storage'
import { ensureTodayPlan } from '../services/plan'

interface AppStateContextValue {
  state: AppState
  patch: (updater: (s: AppState) => AppState) => void
  refresh: () => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => ensureTodayPlan(loadState()))

  useEffect(() => {
    saveState(state)
  }, [state])

  const patch = useCallback((updater: (s: AppState) => AppState) => {
    setState((prev) => updater(prev))
  }, [])

  const refresh = useCallback(() => {
    setState(ensureTodayPlan(loadState()))
  }, [])

  const value = useMemo(() => ({ state, patch, refresh }), [state, patch, refresh])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
