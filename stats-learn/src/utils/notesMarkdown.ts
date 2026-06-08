/** 常见 LaTeX → 可读文本（统计学笔记） */
function convertFrac(input: string): string {
  let s = input
  let prev = ''
  const re = /\\frac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/
  while (re.test(s) && s !== prev) {
    prev = s
    s = s.replace(re, (_, num, den) => `(${convertFrac(num.trim())})/(${convertFrac(den.trim())})`)
  }
  return s
}

const GREEK: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  rho: 'ρ',
  mu: 'μ',
  sigma: 'σ',
  pi: 'π',
  Delta: 'Δ',
  delta: 'δ',
  chi: 'χ',
  lambda: 'λ',
  theta: 'θ',
  varepsilon: 'ε',
}

const SUB_DIGITS = '₀₁₂₃₄₅₆₇₈₉'

function toSubscript(text: string): string {
  return text
    .split('')
    .map((c) => (/[0-9]/.test(c) ? SUB_DIGITS[Number(c)] : c))
    .join('')
}

export function latexToReadable(latex: string): string {
  let s = latex.trim()

  s = s.replace(/\\sum/g, 'Σ')
  s = s.replace(/\\prod/g, 'Π')
  for (const [name, sym] of Object.entries(GREEK)) {
    s = s.replace(new RegExp(`\\\\${name}\\b`, 'g'), sym)
  }

  s = convertFrac(s)

  s = s.replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, '$1√($2)')
  s = s.replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
  s = s.replace(/\\bar\{([^}]+)\}/g, '$1̄')
  s = s.replace(/\\hat\{([^}]+)\}/g, '$1̂')
  s = s.replace(/\\overline\{([^}]+)\}/g, '$1̄')
  s = s.replace(/\\cdot/g, '·')
  s = s.replace(/\\times/g, '×')
  s = s.replace(/\\div/g, '÷')
  s = s.replace(/\\pm/g, '±')
  s = s.replace(/\\mp/g, '∓')
  s = s.replace(/\\leq/g, '≤')
  s = s.replace(/\\geq/g, '≥')
  s = s.replace(/\\neq/g, '≠')
  s = s.replace(/\\approx/g, '≈')
  s = s.replace(/\\cdots/g, '…')
  s = s.replace(/\\ldots/g, '…')
  s = s.replace(/\\left|\\right/g, '')
  s = s.replace(/\\text\{([^}]*)\}/g, '$1')

  s = s.replace(/_\{([^}]+)\}/g, (_, sub) => toSubscript(sub))
  s = s.replace(/_([0-9a-zA-Z])/g, (_, sub) => toSubscript(sub))
  s = s.replace(/\^\{([^}]+)\}/g, (_, sup) => {
    if (sup === '2') return '²'
    if (sup === '3') return '³'
    return `^${sup}`
  })
  s = s.replace(/\^2/g, '²')
  s = s.replace(/\^3/g, '³')

  s = s.replace(/\\([a-zA-Z]+)/g, (_, cmd) => GREEK[cmd] ?? cmd)
  s = s.replace(/[{}\\]/g, (c) => (c === '\\' ? '' : ''))
  s = s.replace(/[{}]/g, '')
  s = s.replace(/\s+/g, ' ')
  return s.trim()
}

/** 笔记 LaTeX → 可读 Markdown（不用反引号包公式） */
export function preprocessNotesMarkdown(markdown: string): string {
  let s = markdown

  s = s.replace(/\\\[([\s\S]*?)\\\]/g, (_, body) => {
    const text = latexToReadable(body)
    return `\n\n> **公式**\n> ${text.split('\n').join('\n> ')}\n\n`
  })

  s = s.replace(/\\\(([\s\S]*?)\\\)/g, (_, body) => {
    const text = latexToReadable(body)
    return text ? `**${text}**` : ''
  })

  return s
}
