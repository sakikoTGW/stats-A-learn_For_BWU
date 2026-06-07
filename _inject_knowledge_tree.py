# -*- coding: utf-8 -*-
"""向各章笔记注入知识点树（上下结构）+ 知识导图（左→右，含考点）。"""
import re
from pathlib import Path

from knowledge_map_lr import BOOK_MAP_LR, CHAPTER_MAP_LR
from knowledge_tree_mermaid import BOOK_TREE, CHAPTER_TREE

ROOT = Path(r"d:\统计课")
NOTES = ROOT / "章节重点笔记"

NOTE_FILES = {
    1: "第01章-统计和统计学.md",
    2: "第02章-统计调查.md",
    3: "第03章-统计数据的整理与显示.md",
    4: "第04章-总量指标与相对指标.md",
    5: "第05章-平均指标.md",
    6: "第06章-标志变异指标.md",
    7: "第07章-抽样推断.md",
    8: "第08章-相关与回归分析.md",
    9: "第09章-时间数列分析.md",
    10: "第10章-统计指数.md",
}

MARKER_TREE = "## 本章知识点树"
MARKER_MAP = "## 本章知识导图"


def _strip_block(text: str, marker: str) -> str:
    return re.sub(
        rf"\n{re.escape(marker)}[\s\S]*?```\s*\n",
        "\n",
        text,
    )


def tree_section(ch: int) -> str:
    return f"""{MARKER_TREE}（总览 · 自上而下）

> 看章节骨架。下一节为**左→右知识导图**（含公式与题眼）。

{CHAPTER_TREE[ch].strip()}
"""


def map_section(ch: int) -> str:
    return f"""{MARKER_MAP}（左 → 右 · 对照笔记 § + 先读考点）

> **用法**：每章分 **上/中/下** 条带，条带内**从左往右**读；节点标注 **§ 小节号**（与正文一致）。含公式、题眼、易混提示。章内若仍觉缺项，以正文 § 为准补看。

{CHAPTER_MAP_LR[ch].strip()}
"""


def inject_chapter(path: Path, ch: int):
    text = path.read_text(encoding="utf-8")
    text = _strip_block(text, MARKER_TREE)
    text = _strip_block(text, MARKER_MAP)

    block = "\n\n" + tree_section(ch) + "\n\n" + map_section(ch) + "\n"

    m = re.search(
        r"(## (?:一、)?本章在干什么[\s\S]*?)(\n---\n|\n## [一二三四五六七八九十、说明])",
        text,
    )
    if m:
        insert_at = m.end(1)
        text = text[:insert_at] + block + text[insert_at:]
    else:
        m2 = re.search(r"(## 说明[\s\S]*?)(\n## )", text)
        if m2:
            insert_at = m2.end(1)
            text = text[:insert_at] + block + text[insert_at:]
        else:
            text = block + text
    path.write_text(text, encoding="utf-8")
    print(f"  inject → {path.name}")


def write_book():
    book_path = NOTES / "全书知识点树图.md"
    lines = [
        "# 统计学 · 全书知识点树图",
        "",
        "> **推荐先看**：下方「全书知识导图」从左到右串起 10 章核心知识；再进各章笔记看分章导图。",
        "",
        "## 全书知识导图（左 → 右）",
        "",
        BOOK_MAP_LR.strip(),
        "",
        "---",
        "",
        "## 全书知识点树（自上而下）",
        "",
        BOOK_TREE.strip(),
        "",
        "---",
        "",
        "## 分章跳转",
        "",
    ]
    for _, fname in NOTE_FILES.items():
        lines.append(f"- [{fname.replace('.md', '')}](./{fname})")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 分章 · 左→右知识导图（含考点）")
    lines.append("")
    for ch in range(1, 11):
        lines.append(f"### 第{ch:02d}章\n")
        lines.append(CHAPTER_MAP_LR[ch].strip())
        lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 分章 · 自上而下结构树")
    lines.append("")
    for ch in range(1, 11):
        lines.append(f"### 第{ch:02d}章\n")
        lines.append(CHAPTER_TREE[ch].strip())
        lines.append("")
    book_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"  book → {book_path.name}")


def main():
    for ch, fname in NOTE_FILES.items():
        inject_chapter(NOTES / fname, ch)
    write_book()
    print("Done.")


if __name__ == "__main__":
    main()
