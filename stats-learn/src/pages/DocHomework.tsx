import { Link } from 'react-router-dom'
import { docExerciseQuestions } from '../data/docExerciseQuestions'
import { chapters } from '../data/chapters'

const SOURCE_LABELS: Record<string, string> = {
  ch1: '课后作业 · 第一章 统计学基本概念',
  ch2: '课后习题 · 第二章 数据收集与整理',
  ch3: '课后习题 · 第三章 统计表与统计图',
  ch5: '课后习题 · 第四五章（平均指标）',
  ch6: '课后习题 · 第四五章（离散程度）',
  ch8: '课后习题 · 第六章 相关与回归',
  ch9: '课后习题 · 第七章 时间数列',
  ch10: '课后习题 · 第八章 统计指数',
}

export function DocHomework() {
  const byChapter = chapters
    .map((ch) => ({
      ...ch,
      count: docExerciseQuestions.filter((q) => q.chapterId === ch.id).length,
      label: SOURCE_LABELS[ch.id],
    }))
    .filter((c) => c.count > 0)

  const total = docExerciseQuestions.length

  return (
    <div className="page doc-homework-page">
      <header className="page-header">
        <h2>📋 课后习题（Word 原文）</h2>
        <p className="muted">
          共 <strong>{total}</strong> 题，来自你提供的 7 份课后作业/习题 doc。答案与教材一致；多选题以选项组合形式作答。
        </p>
      </header>

      <div className="plain-box doc-hw-all">
        <strong>一次刷完</strong>
        <p>按章顺序连续刷全部课后题（约 {total} 题）。</p>
        <Link className="btn primary" to="/practice?set=doc-hw&chapter=all">
          开始刷全部课后题
        </Link>
      </div>

      <div className="doc-hw-grid">
        {byChapter.map((ch) => (
          <article key={ch.id} className="plain-box doc-hw-card">
            <h3>{ch.title}</h3>
            {ch.label && <p className="muted doc-hw-src">{ch.label}</p>}
            <p>
              <strong>{ch.count}</strong> 题
            </p>
            <Link className="btn" to={`/practice?set=doc-hw&chapter=${ch.id}`}>
              刷本章课后题
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
