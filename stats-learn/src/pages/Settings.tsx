import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'
import { INTENSITY_OPTIONS } from '../services/studyIntensity'
import type { StudyIntensity } from '../types'
import { useToast } from '../components/Toast'
import { useTutor } from '../context/TutorContext'
import {
  exportStateJson,
  getStorageSummary,
  importStateJson,
  restoreFromBackup,
  summarizeState,
} from '../services/storage'

export function Settings() {
  const { state, patch, refresh } = useAppState()
  const { showToast } = useToast()
  const { resetTutor } = useTutor()
  const importRef = useRef<HTMLInputElement>(null)
  const [storageInfo, setStorageInfo] = useState(() => getStorageSummary())
  const summary = summarizeState(state)

  const [apiKey, setApiKey] = useState(state.settings.llmApiKey ?? '')
  const [endpoint, setEndpoint] = useState(
    state.settings.llmEndpoint ?? 'https://api.openai.com/v1/chat/completions'
  )
  const [model, setModel] = useState(state.settings.llmModel ?? 'gpt-4o-mini')
  const intensity = state.settings.studyIntensity ?? 'standard'

  const refreshStorageInfo = () => setStorageInfo(getStorageSummary())

  const save = () => {
    patch((s) => ({
      ...s,
      settings: {
        ...s.settings,
        llmApiKey: apiKey.trim() || undefined,
        llmEndpoint: endpoint.trim() || undefined,
        llmModel: model.trim() || undefined,
        studyIntensity: intensity,
      },
    }))
    showToast('设置已保存')
  }

  const setIntensity = (v: StudyIntensity) => {
    patch((s) => ({
      ...s,
      settings: { ...s.settings, studyIntensity: v },
    }))
  }

  const handleExport = () => {
    const blob = new Blob([exportStateJson(state)], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stats-learn-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('学习记录已导出')
  }

  const handleImport = async (file: File, mode: 'replace' | 'merge') => {
    try {
      const text = await file.text()
      importStateJson(text, mode)
      refresh()
      refreshStorageInfo()
      showToast(mode === 'merge' ? '已合并导入学习记录' : '已恢复学习记录')
    } catch {
      showToast('导入失败：文件格式不正确')
    }
  }

  const handleRestoreBackup = () => {
    const restored = restoreFromBackup()
    if (!restored) {
      showToast('没有可用的本地备份')
      return
    }
    refresh()
    refreshStorageInfo()
    showToast('已从本地备份恢复')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>学习设置</h2>
        <p className="subtitle">今日强度、学伴 API（可选）</p>
      </div>

      <div className="card">
        <h3>今日学习强度</h3>
        <p className="subtitle">影响首页「开始今日学习」的知识点数量与刷题量</p>
        <div className="intensity-row">
          {INTENSITY_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`chip ${intensity === o.value ? 'active' : ''}`}
              onClick={() => setIntensity(o.value)}
            >
              <strong>{o.plan.label}</strong>
              <span>{o.plan.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>学伴 LLM（OpenAI 兼容）</h3>
        <p className="subtitle">
          配置后，学伴对话与错题讲解将调用 API；失败时自动降级为本地针对性讲解。
        </p>
        <label className="field">
          API Key
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-… 或留空使用环境变量 VITE_LLM_API_KEY"
            autoComplete="off"
          />
        </label>
        <label className="field">
          API Endpoint
          <input
            type="url"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://api.openai.com/v1/chat/completions"
          />
        </label>
        <label className="field">
          Model
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-4o-mini"
          />
        </label>
        <p className="hint-text">
          也可在项目根目录 <code>.env</code> 中设置 <code>VITE_LLM_API_KEY</code>、
          <code>VITE_LLM_ENDPOINT</code>、<code>VITE_LLM_MODEL</code>（构建时注入）。
        </p>
        <button type="button" className="btn-primary" onClick={save}>
          保存设置
        </button>
      </div>

      <div className="card">
        <h3>学伴</h3>
        <p className="subtitle">清空后恢复欢迎语；开关状态与聊天记录保存在本浏览器。</p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            resetTutor()
            showToast('学伴记录已清空')
          }}
        >
          清空学伴聊天记录
        </button>
      </div>

      <div className="card">
        <h3>学习记录</h3>
        <p className="subtitle">
          进度保存在本浏览器的 localStorage。换浏览器（如 Cursor 内置浏览器 ↔ Chrome）或换地址（
          <code>localhost</code> ↔ <code>127.0.0.1</code>）会看到不同的记录。
        </p>
        <ul className="storage-stats">
          <li>已学知识点：{summary.knowledgePointCount}</li>
          <li>做题次数：{summary.questionAttemptCount}</li>
          <li>错题：{summary.wrongCount}</li>
          <li>摸底章节：{summary.diagnosticCount}</li>
          <li>笔记：{summary.noteCount}</li>
          {summary.lastChapterId && <li>最近章节：{summary.lastChapterId}</li>}
        </ul>
        {summary.knowledgePointCount === 0 && summary.diagnosticCount === 0 && (
          <p className="hint-text">
            若你之前学过但这里显示为 0，请回到之前用的浏览器打开{' '}
            <code>http://localhost:5173</code>，在本页导出备份后再导入到当前浏览器。
          </p>
        )}
        <div className="btn-row">
          <button type="button" className="btn-primary" onClick={handleExport}>
            导出备份
          </button>
          <button type="button" className="btn-secondary" onClick={() => importRef.current?.click()}>
            导入备份（覆盖）
          </button>
          {storageInfo.hasBackup && (
            <button type="button" className="btn-secondary" onClick={handleRestoreBackup}>
              恢复上一版本地备份
            </button>
          )}
        </div>
        <input
          ref={importRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleImport(file, 'replace')
            e.target.value = ''
          }}
        />
        {storageInfo.hasBackup && (
          <p className="hint-text">本地自动备份约 {Math.round(storageInfo.backupBytes / 1024)} KB，每次保存前会保留上一版。</p>
        )}
      </div>

      <div className="card">
        <Link to="/" className="btn-secondary">
          返回首页
        </Link>
      </div>
    </div>
  )
}
