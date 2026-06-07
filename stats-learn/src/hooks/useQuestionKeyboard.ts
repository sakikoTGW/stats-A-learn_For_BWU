import { useEffect } from 'react'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return target.isContentEditable
}

export interface QuestionKeyboardOptions {
  optionCount: number
  selected: number | null
  showResult?: boolean
  disabled?: boolean
  onSelect: (index: number) => void
  onSubmit: () => void
  onNext?: () => void
}

/** 1–4 / A–D 选题，Enter / Space 提交或下一题 */
export function useQuestionKeyboard({
  optionCount,
  selected,
  showResult = false,
  disabled = false,
  onSelect,
  onSubmit,
  onNext,
}: QuestionKeyboardOptions): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled || isTypingTarget(e.target)) return

      const key = e.key.toLowerCase()

      if (!showResult) {
        let index: number | null = null
        if (key >= '1' && key <= '9') index = Number(key) - 1
        else if (key >= 'a' && key <= 'd') index = key.charCodeAt(0) - 97

        if (index !== null && index >= 0 && index < optionCount) {
          e.preventDefault()
          onSelect(index)
          return
        }
      }

      if (key !== 'enter' && key !== ' ') return
      e.preventDefault()

      if (showResult && onNext) {
        onNext()
        return
      }

      if (!showResult && selected !== null) {
        onSubmit()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [optionCount, selected, showResult, disabled, onSelect, onSubmit, onNext])
}

/** 切题时滚回题目区域 */
export function useScrollToQuestion(deps: unknown[]): void {
  useEffect(() => {
    const el = document.querySelector('.question-card')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
