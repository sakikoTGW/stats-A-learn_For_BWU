# -*- coding: utf-8 -*-
"""Export slide/page images from course materials into 章节重点笔记/图片/"""
import re
import shutil
import zipfile
from pathlib import Path

ROOT = Path(r"d:\统计课")
IMG_ROOT = ROOT / "章节重点笔记" / "图片"

# chapter_id -> list of (subdir_label, source_path)
SOURCES = {
    "01": [
        ("PPT-1.1第一章绪论", "1.1-第一章 绪论-统计和统计学.pptx"),
    ],
    "02": [
        ("PPT-2.2统计调查", "2.2-第二章 -统计调查-数据的整理.pptx"),
    ],
    "03": [
        ("PPT-3.1整理与显示", "3.1-第三章 统计数据的整理与显示-次数分布数列.pptx"),
    ],
    "04": [
        ("PPT-4总量与相对指标", "4 第四章 总量指标与相对指标.pptx"),
    ],
    "05": [
        ("PPT-5平均指标", "5 第五章 平均指标.pptx"),
    ],
    "06": [
        ("PPT-6标志变异指标", "6 第六章 标志变异指标.pptx"),
    ],
    "07": [
        ("PPT-2.2关联抽样调查", "2.2-第二章 -统计调查-数据的整理.pptx"),
    ],
    "08": [
        ("PPT-8相关回归", "8 第八章 相关与回归分析.pptx"),
        ("PDF-8相关回归", "8 第八章 相关与回归分析.pdf"),
    ],
    "09": [
        ("PDF-9时间数列", "9.第九章 时间数列分析.pdf"),
    ],
    "10": [
        ("PDF-10统计指数", "10 第十章 统计指数.pdf"),
    ],
}


def extract_pptx_embedded(pptx: Path, out_dir: Path) -> int:
    out_dir.mkdir(parents=True, exist_ok=True)
    n = 0
    with zipfile.ZipFile(pptx, "r") as z:
        for name in z.namelist():
            if name.startswith("ppt/media/") and not name.endswith("/"):
                data = z.read(name)
                fname = Path(name).name
                (out_dir / fname).write_bytes(data)
                n += 1
    return n


def export_pptx_slides_com(pptx: Path, out_dir: Path) -> int:
    import win32com.client

    out_dir.mkdir(parents=True, exist_ok=True)
    app = win32com.client.Dispatch("PowerPoint.Application")
    try:
        app.Visible = 1
    except Exception:
        pass
    try:
        pres = app.Presentations.Open(str(pptx.resolve()), WithWindow=False, ReadOnly=True)
        count = pres.Slides.Count
        for i in range(1, count + 1):
            out = out_dir / f"slide-{i:03d}.png"
            pres.Slides(i).Export(str(out.resolve()), "PNG")
        pres.Close()
        return count
    finally:
        app.Quit()


def export_pdf_pages(pdf: Path, out_dir: Path, dpi: int = 150) -> int:
    import fitz

    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(str(pdf))
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        pix.save(str(out_dir / f"page-{i + 1:03d}.png"))
    n = len(doc)
    doc.close()
    return n


def build_gallery_md(ch: str, ch_dir: Path) -> str:
    lines = [
        f"# 第{ch}章 课件图片索引\n",
        "按子文件夹浏览；`幻灯片` 为整页导出，`嵌入图` 为 PPT 内嵌图片。\n",
    ]
    if not ch_dir.exists():
        lines.append("（暂无图片）\n")
        return "".join(lines)
    for sub in sorted(ch_dir.iterdir()):
        if not sub.is_dir():
            continue
        lines.append(f"\n## {sub.name}\n\n")
        slides = sorted(sub.glob("slide-*.png"))
        pages = sorted(sub.glob("page-*.png"))
        embeds = sorted(
            p
            for p in sub.iterdir()
            if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".emf", ".wmf"}
            and not p.name.startswith(("slide-", "page-"))
        )
        if slides:
            lines.append("### 幻灯片（按页）\n\n")
            for p in slides:
                rel = p.relative_to(ROOT / "章节重点笔记").as_posix()
                lines.append(f"![{p.stem}]({rel})\n\n")
        if pages:
            lines.append("### PDF 页面\n\n")
            for p in pages:
                rel = p.relative_to(ROOT / "章节重点笔记").as_posix()
                lines.append(f"![{p.stem}]({rel})\n\n")
        if embeds and not slides and not pages:
            lines.append("### 嵌入图片\n\n")
            for p in embeds:
                rel = p.relative_to(ROOT / "章节重点笔记").as_posix()
                lines.append(f"![{p.name}]({rel})\n\n")
    return "".join(lines)


def main():
    IMG_ROOT.mkdir(parents=True, exist_ok=True)

    log = []
    for ch, items in SOURCES.items():
        ch_dir = IMG_ROOT / f"第{ch}章"
        ch_dir.mkdir(parents=True, exist_ok=True)
        for label, rel in items:
            src = ROOT / rel
            if not src.exists():
                log.append(f"MISSING {ch} {rel}")
                continue
            sub = ch_dir / label
            sub.mkdir(parents=True, exist_ok=True)
            ext = src.suffix.lower()
            try:
                if ext == ".pptx":
                    slides_dir = sub / "幻灯片"
                    embed_dir = sub / "嵌入图"
                    n_slides = export_pptx_slides_com(src, slides_dir)
                    n_embed = extract_pptx_embedded(src, embed_dir)
                    log.append(f"OK {ch} {label}: {n_slides} slides, {n_embed} embedded")
                elif ext == ".pdf":
                    pages_dir = sub / "幻灯片"
                    n = export_pdf_pages(src, pages_dir)
                    log.append(f"OK {ch} {label}: {n} pages")
            except Exception as e:
                log.append(f"ERR {ch} {label}: {e}")

        gallery = build_gallery_md(ch, ch_dir)
        (ROOT / "章节重点笔记" / f"第{ch}章-图片索引.md").write_text(gallery, encoding="utf-8")

    (IMG_ROOT / "_export_log.txt").write_text("\n".join(log), encoding="utf-8")
    print("\n".join(log))


if __name__ == "__main__":
    main()
