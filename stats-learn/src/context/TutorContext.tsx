import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { TutorMessage } from '../types'
import { createTutorMessage } from '../services/tutor'
import {
  clearTutorStorage,
  loadTutorMessages,
  loadTutorPrefs,
  MESSAGES_KEY,
  PREFS_KEY,
  saveTutorMessages,
  saveTutorPrefs,
} from '../services/tutorPrefs'

interface TutorContextValue {
  open: boolean
  setOpen: (v: boolean) => void
  halfScreen: boolean
  setHalfScreen: (v: boolean) => void
  messages: TutorMessage[]
  pushTutorMessage: (text: string) => void
  pushUserMessage: (text: string) => void
  unread: number
  clearUnread: () => void
  resetTutor: () => void
}

const TutorContext = createContext<TutorContextValue | null>(null)

const WELCOME = createTutorMessage(
  'tutor',
  '你好，我是你的统计课学伴 🎓 点下面快捷回复也行；学完会提醒你下一步。'
)

function initialMessages(): TutorMessage[] {
  const saved = loadTutorMessages()
  return saved.length > 0 ? saved : [WELCOME]
}

export function TutorProvider({ children }: { children: ReactNode }) {
  const initPrefs = loadTutorPrefs()
  const [open, setOpenState] = useState(initPrefs.preferOpen)
  const [halfScreen, setHalfScreenState] = useState(initPrefs.halfScreen)
  const [messages, setMessages] = useState<TutorMessage[]>(initialMessages)
  const [unread, setUnread] = useState(initPrefs.unread)
  const openRef = useRef(open)

  openRef.current = open

  const appendMessages = useCallback((updater: (prev: TutorMessage[]) => TutorMessage[]) => {
    setMessages((prev) => {
      const next = updater(prev)
      saveTutorMessages(next)
      return next
    })
  }, [])

  const setOpen = useCallback((v: boolean) => {
    setOpenState(v)
    if (v) {
      setUnread(0)
      saveTutorPrefs({ preferOpen: true, unread: 0 })
    } else {
      saveTutorPrefs({ preferOpen: false })
    }
  }, [])

  const setHalfScreen = useCallback((v: boolean) => {
    setHalfScreenState(v)
    saveTutorPrefs({ halfScreen: v })
  }, [])

  const pushTutorMessage = useCallback(
    (text: string) => {
      appendMessages((prev) => [...prev, createTutorMessage('tutor', text)])
      if (!openRef.current) {
        setUnread((n) => {
          const next = n + 1
          saveTutorPrefs({ unread: next })
          return next
        })
      }
    },
    [appendMessages]
  )

  const pushUserMessage = useCallback(
    (text: string) => {
      appendMessages((prev) => [...prev, createTutorMessage('user', text)])
    },
    [appendMessages]
  )

  const clearUnread = useCallback(() => {
    setUnread(0)
    saveTutorPrefs({ unread: 0 })
  }, [])

  const resetTutor = useCallback(() => {
    clearTutorStorage()
    const welcome = createTutorMessage(
      'tutor',
      '你好，我是你的统计课学伴 🎓 点下面快捷回复也行；学完会提醒你下一步。'
    )
    setOpenState(false)
    setHalfScreenState(false)
    setUnread(0)
    setMessages([welcome])
    saveTutorPrefs({ preferOpen: false, halfScreen: false, unread: 0 })
    saveTutorMessages([welcome])
  }, [])

  /** 其它标签页改了 localStorage 时同步 */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREFS_KEY && e.newValue) {
        try {
          const prefs = { ...loadTutorPrefs(), ...JSON.parse(e.newValue) }
          setOpenState(prefs.preferOpen)
          setHalfScreenState(prefs.halfScreen)
          setUnread(prefs.unread ?? 0)
        } catch {
          /* ignore */
        }
      }
      if (e.key === MESSAGES_KEY && e.newValue) {
        try {
          const list = JSON.parse(e.newValue) as TutorMessage[]
          if (Array.isArray(list)) setMessages(list)
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(
    () => ({
      open,
      setOpen,
      halfScreen,
      setHalfScreen,
      messages,
      pushTutorMessage,
      pushUserMessage,
      unread,
      clearUnread,
      resetTutor,
    }),
    [
      open,
      setOpen,
      halfScreen,
      setHalfScreen,
      messages,
      pushTutorMessage,
      pushUserMessage,
      unread,
      clearUnread,
      resetTutor,
    ]
  )

  return <TutorContext.Provider value={value}>{children}</TutorContext.Provider>
}

export function useTutor(): TutorContextValue {
  const ctx = useContext(TutorContext)
  if (!ctx) throw new Error('useTutor must be used within TutorProvider')
  return ctx
}
