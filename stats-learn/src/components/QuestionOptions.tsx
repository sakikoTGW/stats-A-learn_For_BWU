export function getOptionClass(
  index: number,
  selected: number | null,
  correctIndex: number,
  showResult: boolean
): string {
  if (showResult) {
    if (index === correctIndex) return 'correct'
    if (selected === index) return 'wrong'
    return ''
  }
  return selected === index ? 'selected' : ''
}

export function QuestionOptions({
  options,
  selected,
  correctIndex,
  showResult,
  disabled,
  name = 'opt',
  onSelect,
}: {
  options: string[]
  selected: number | null
  correctIndex: number
  showResult: boolean
  disabled?: boolean
  name?: string
  onSelect: (index: number) => void
}) {
  return (
    <ul className="options">
      {options.map((opt, i) => (
        <li key={i}>
          <label className={getOptionClass(i, selected, correctIndex, showResult)}>
            <input
              type="radio"
              name={name}
              disabled={disabled || showResult}
              checked={selected === i}
              onChange={() => onSelect(i)}
            />
            <kbd>{i + 1}</kbd>
            {String.fromCharCode(65 + i)}. {opt}
          </label>
        </li>
      ))}
    </ul>
  )
}

export function QuestionKeyboardHint({ phase }: { phase: 'answer' | 'result' }) {
  if (phase === 'result') {
    return (
      <p className="keyboard-hint-bar">
        <kbd>Enter</kbd> / <kbd>Space</kbd> 下一题
      </p>
    )
  }
  return (
    <p className="keyboard-hint-bar">
      <kbd>1</kbd>–<kbd>4</kbd> 或 <kbd>A</kbd>–<kbd>D</kbd> 选题 · <kbd>Enter</kbd> / <kbd>Space</kbd> 提交
    </p>
  )
}
