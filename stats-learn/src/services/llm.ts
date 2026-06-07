import type { AppState } from '../types'

export interface LlmConfig {
  apiKey?: string
  endpoint?: string
  model?: string
}

export function getLlmConfig(state: AppState): LlmConfig {
  const envKey =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_LLM_API_KEY
      ? String(import.meta.env.VITE_LLM_API_KEY)
      : undefined
  const envEndpoint =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_LLM_ENDPOINT
      ? String(import.meta.env.VITE_LLM_ENDPOINT)
      : undefined
  const envModel =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_LLM_MODEL
      ? String(import.meta.env.VITE_LLM_MODEL)
      : undefined

  return {
    apiKey: state.settings.llmApiKey || envKey,
    endpoint: state.settings.llmEndpoint || envEndpoint || 'https://api.openai.com/v1/chat/completions',
    model: state.settings.llmModel || envModel || 'gpt-4o-mini',
  }
}

export function hasLlmConfig(state: AppState): boolean {
  const c = getLlmConfig(state)
  return Boolean(c.apiKey?.trim())
}

/** OpenAI 兼容 chat/completions */
export async function chatCompletion(
  config: LlmConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  if (!config.apiKey?.trim()) return null
  try {
    const res = await fetch(config.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 600,
      }),
    })
    if (!res.ok) {
      console.warn('[LLM] HTTP', res.status, await res.text().catch(() => ''))
      return null
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const text = data.choices?.[0]?.message?.content?.trim()
    return text || null
  } catch (e) {
    console.warn('[LLM] fetch failed', e)
    return null
  }
}
