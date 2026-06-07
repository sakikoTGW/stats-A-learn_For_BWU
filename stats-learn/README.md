# 统计课学习助手

浏览器打开即用的统计课程学习辅助工具，内容已对齐 **第01–10章「章节重点笔记」** 与 `全书知识点树图.md`。

## 快速开始

需要已安装 [Node.js](https://nodejs.org/)（建议 18+）。

```bash
cd stats-learn
npm install
npm run dev
```

终端会显示本地地址（默认 `http://localhost:5173`），用浏览器打开即可。

**Windows PowerShell 构建**：

```powershell
cd stats-learn; npm install; npm run build
```

## 覆盖范围

| 章 | 应用内标题 | 知识点 (KP) | 内置选择题（约） |
|----|------------|-------------|------------------|
| 1 | 统计和统计学 | 13 | 37 |
| 2 | 统计调查 | 15 | 30 |
| 3 | 统计数据的整理与显示 | 11 | 40 |
| 4 | 总量指标与相对指标 | 12 | 34 |
| 5 | 平均指标 | 11 | 40 |
| 6 | 标志变异指标 | 13 | 36 |
| 7 | 抽样推断 | 9 | 18 |
| 8 | 相关与回归分析 | 9 | 18 |
| 9 | 时间数列分析 | 9 | 18 |
| 10 | 统计指数 | 10 | 21 |
| **合计** | | **129** | **约 330+** |

- **129 个知识点**：与 `全书知识点树图.md` 叶节点 + `挖漏对照清单.md` 考点对齐；每 KP ≥2 道题。
- 备考请以仓库根目录 `章节重点笔记/` 为准；应用内「章节重点」可读 md 原文。
- 详细对照见 `docs/笔记覆盖对照.md`。

## 一键今日学习（可配置强度）

首页选择 **轻松 / 标准 / 冲刺**，再点 **「开始今日学习」**：

| 强度 | 知识点 | 刷题 |
|------|--------|------|
| 轻松 | 1 | 3 |
| 标准 | 2 | 6 |
| 冲刺 | 3 | 10 |

流程：摸底（可跳过）→ 学薄弱知识点 → 刷题 → 完成祝贺。

## 学伴 LLM 配置（可选）

无 API Key 时，学伴会根据 **当前章节、薄弱 KP、章节重点笔记摘录、最近错题** 生成本地讲解。

有 Key 时调用 OpenAI 兼容 `chat/completions`；失败自动降级。设置见 `/settings`。

## 功能入口速查

| 功能 | 入口 |
|------|------|
| 今日学习 + 强度 | 首页 `今日计划` |
| 章节重点（笔记） | 导航「章节重点」或 `/chapter-notes` |
| 章节摸底 | 章节卡片「摸底」或 `/diagnostic/:chapterId` |
| 学知识点 | 「学习」或 `/learn` |
| 刷题 | 「刷题」或 `/practice` |
| 期末模拟卷 | `/exam/:chapterId` |
| 复习再测 | `复习` →「再测 5–10 题」 |
| 错题本 | 导航「错题」 |
| 设置 / LLM | `/settings` |

## 题库与知识点维护

| 文件 | 用途 |
|------|------|
| `src/data/chapters.ts` | 10 章 + **129** 个知识点正文 |
| `src/data/questions.ts` | 核心题库 |
| `src/data/homeworkQuestions.ts` | 笔记课后题速记（手工） |
| `src/data/supplementQuestions.ts` | 补全题（`npm run gen:supplement` 生成） |

- 校验：`node scripts/validate-data.mjs`（KP 引用 + 每 KP≥2 题）。
- 补全零题知识点：`npm run gen:supplement`（编辑 `scripts/gen-supplement.mjs` 内 `BANK` 后重跑）。
- 新课后题：优先写入 `homeworkQuestions.ts`，对照笔记 ⚠️ 与「先读」考点。

## 构建发布

```bash
npm run build
npm run preview
```

数据保存在浏览器 **localStorage** / **sessionStorage**，无需服务器。
