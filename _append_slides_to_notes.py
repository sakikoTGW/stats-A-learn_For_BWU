# -*- coding: utf-8 -*-
"""Append slide images to chapter notes (images only, not note text)."""
from pathlib import Path

NOTES = Path(r"d:\统计课\章节重点笔记")
IMG = NOTES / "图片"

CHAPTERS = {
    "01": "第01章-统计和统计学.md",
    "02": "第02章-统计调查.md",
    "03": "第03章-统计数据的整理与显示.md",
    "04": "第04章-总量指标与相对指标.md",
    "05": "第05章-平均指标.md",
    "06": "第06章-标志变异指标.md",
    "07": "第07章-抽样推断.md",
    "08": "第08章-相关与回归分析.md",
    "09": "第09章-时间数列分析.md",
    "10": "第10章-统计指数.md",
}


def build_slide_section(ch: str) -> str:
    ch_dir = IMG / f"第{ch}章"
    if not ch_dir.exists():
        return ""
    lines = [
        "\n---\n\n",
        "## 配套课件（逐页图示）\n\n",
        "> **不用另开 PPT/PDF**：以下与课件页一一对应，在 Cursor / VS Code 中打开本 Markdown 并**预览**（Ctrl+Shift+V）即可图文一起看。\n\n",
    ]
    subs = [s for s in sorted(ch_dir.iterdir()) if s.is_dir()]
    if ch == "08":
        subs = [s for s in subs if s.name.startswith("PPT")]
    elif ch in ("09", "10"):
        subs = [s for s in subs if "PDF" in s.name or "pdf" in s.name]
    for sub in subs:
        slide_dir = sub / "幻灯片"
        if not slide_dir.exists():
            continue
        slides = sorted(slide_dir.glob("slide-*.png"))
        pages = sorted(slide_dir.glob("page-*.png"))
        items = slides or pages
        if not items:
            continue
        lines.append(f"### {sub.name}\n\n")
        for i, p in enumerate(items, 1):
            rel = p.relative_to(NOTES).as_posix()
            label = p.stem.replace("slide-", "第").replace("page-", "第") + "页"
            lines.append(f"**{label}**\n\n")
            lines.append(f"![{sub.name}-{p.stem}]({rel})\n\n")
    return "".join(lines)


def main():
    for ch, fname in CHAPTERS.items():
        path = NOTES / fname
        if not path.exists():
            print("skip", fname)
            continue
        text = path.read_text(encoding="utf-8")
        marker = "## 配套课件（逐页图示）"
        if marker in text:
            text = text.split(marker)[0].rstrip()
        section = build_slide_section(ch)
        if not section:
            print("no images", ch)
            continue
        # banner after title
        banner = (
            "> **图文一体**：文字笔记在下方；**课件每一页**见文末「配套课件（逐页图示）」。"
            "用 Markdown 预览即可，无需打开 pptx。\n\n"
        )
        if "**图文一体**" not in text:
            lines = text.split("\n", 1)
            if len(lines) == 2 and lines[0].startswith("# "):
                text = lines[0] + "\n\n" + banner + lines[1]
            else:
                text = banner + text
        path.write_text(text + section, encoding="utf-8")
        print("OK", fname, "+%d chars" % len(section))


if __name__ == "__main__":
    main()
