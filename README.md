# stats-A-learn for BWU 北京物资学院统计学A复习

[![Node.js 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**统计学课程复习资料** — 10 章 Markdown 笔记 + 浏览器端学习 App（摸底 / 刷题 / 今日计划 / 学伴 / 章节重点）。

配套 **129 个知识点（KP）**、**330+ 道选择题**；进度保存在浏览器 localStorage，无需后端。

## 简介

- **章节重点笔记**：手写整理 + 课件对照补漏，含 Mermaid 知识导图、习题逐题精讲、挖漏清单
- **stats-learn App**：Vite + React，对齐笔记与 `全书知识点树图.md`
- **维护脚本**：从课件提取全文、注入知识树、生成习题对照（Python，可选）

| 模块 | 说明 |
|------|------|
| 今日计划 | 轻松 / 标准 / 冲刺 强度，摸底 → 学 KP → 刷题 |
| 章节重点 | 渲染 Markdown + Mermaid，链到全书导图 / 挖漏 / 习题 |
| 摸底 & 刷题 | 键盘 1–4 / A–D 选题，选项展示层随机打乱 |
| 学伴 | 可选 OpenAI 兼容 API；无 Key 时本地讲解 |
| 数据导出 | 设置页导出 / 导入学习记录 |

## 环境要求

- **运行 App**：Node.js 18+、npm
- **维护笔记（可选）**：Python 3.10+（无第三方依赖的脚本为主）
- **学伴 LLM（可选）**：OpenAI 兼容 API Key，见 `stats-learn/.env.example`

## 安装

### 从 Git

```bash
git clone https://github.com/sakikoTGW/stats-learn.git
cd stats-learn/stats-learn
npm install
npm run dev
```

浏览器打开终端显示的地址（默认 `http://localhost:5173`）。

### 生产构建

```bash
cd stats-learn
npm run build
npm run preview
```

## 快速开始

1. **只看笔记**：用 VS Code / Cursor 打开 `章节重点笔记/`，`Ctrl+Shift+V` 预览对应章 md；全书总览见 `全书知识点树图.md`
2. **用 App 复习**：`cd stats-learn && npm run dev` → 首页选强度 →「开始今日学习」
3. **对照覆盖**：App 与笔记 KP 对照见 [`stats-learn/docs/笔记覆盖对照.md`](stats-learn/docs/笔记覆盖对照.md)

### 学伴 LLM（可选）

```bash
cd stats-learn
copy .env.example .env   # Windows
# 编辑 VITE_LLM_API_KEY、VITE_LLM_ENDPOINT、VITE_LLM_MODEL
npm run dev
```

## 目录结构

```
stats-learn/              # React 学习 App（npm run dev）
  src/data/               # 章节、KP、题库
  docs/                   # 笔记覆盖对照等
章节重点笔记/             # 10 章复习 md + 全书导图 + 挖漏清单
*.py                      # 课件提取、知识树注入、习题生成脚本
```

## 笔记维护（可选）

在仓库根目录执行（需本地有原始课件与 `_提取全文/` 时）：

| 脚本 | 用途 |
|------|------|
| `_full_extract.py` | 从 pptx/docx 提取全文到 `_提取全文/` |
| `_inject_knowledge_tree.py` | 向笔记注入 Mermaid 知识树 |
| `_build_exercise_knowledge.py` | 生成各章「习题逐题」md |
| `knowledge_map_lr.py` / `knowledge_tree_mermaid.py` | 导图生成辅助 |

重跑后同步 App KP：`stats-learn/src/data/chapters.ts`（见 `章节重点笔记/README.md`）。

## 题库校验

```bash
cd stats-learn
node scripts/validate-data.mjs    # KP 引用 + 每 KP ≥2 题
npm run gen:supplement            # 补全零题 KP（编辑 scripts/gen-supplement.mjs）
```

## 数据与隐私

- 学习进度、摸底、错题等存在浏览器 **localStorage**（key：`stats-learn-state-v1`）
- 设置页支持 **导出 / 导入 JSON**；`public/backups/` 仅作本地恢复，**不会**提交到 Git
- 不同浏览器 / Cursor 内置浏览器之间 localStorage **不共享**

## 许可证

MIT — 见 [LICENSE](LICENSE)。笔记与题为课程复习整理，课件原件版权归授课方所有，本仓库不包含 pptx/pdf 原件。
