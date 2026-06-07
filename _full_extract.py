# -*- coding: utf-8 -*-
"""Extract ALL course materials to UTF-8 text files."""
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(r"d:\统计课")
OUT_DIR = ROOT / "_提取全文"
OUT_DIR.mkdir(exist_ok=True)

W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A_NS = "{http://schemas.openxmlformats.org/drawingml/2006/main}"


def pptx_text(path: Path) -> str:
    texts = []
    with zipfile.ZipFile(path, "r") as z:
        slides = sorted(
            [n for n in z.namelist() if re.match(r"ppt/slides/slide\d+\.xml", n)],
            key=lambda x: int(re.search(r"slide(\d+)", x).group(1)),
        )
        for slide in slides:
            root = ET.fromstring(z.read(slide))
            for t in root.iter(A_NS + "t"):
                if t.text:
                    texts.append(t.text)
                if t.tail:
                    texts.append(t.tail)
    return "\n".join(texts)


def docx_text(path: Path) -> str:
    parts = []
    with zipfile.ZipFile(path, "r") as z:
        if "word/document.xml" not in z.namelist():
            return "[no document.xml]"
        root = ET.fromstring(z.read("word/document.xml"))
        for p in root.iter(W_NS + "p"):
            line = []
            for t in p.iter(W_NS + "t"):
                if t.text:
                    line.append(t.text)
                if t.tail:
                    line.append(t.tail)
            if line:
                parts.append("".join(line))
    return "\n".join(parts)


def pdf_text(path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError:
        import subprocess, sys
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf", "-q"])
        from pypdf import PdfReader
    r = PdfReader(str(path))
    parts = []
    for i, page in enumerate(r.pages):
        t = page.extract_text() or ""
        parts.append(f"--- page {i+1} ---\n{t}")
    return "\n".join(parts)


def doc_text_word(path: Path) -> str:
    import win32com.client
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    doc = word.Documents.Open(str(path.resolve()))
    text = doc.Content.Text
    doc.Close(False)
    word.Quit()
    return text


def main():
    index = []
    # docx
    for f in sorted(ROOT.glob("*.docx")):
        out = OUT_DIR / (f.stem + ".txt")
        try:
            t = docx_text(f)
            if len(t.strip()) < 20:
                t = doc_text_word(f)
        except Exception:
            try:
                t = doc_text_word(f)
            except Exception as e:
                t = f"[ERROR] {e}"
        out.write_text(t, encoding="utf-8")
        index.append((f.name, out.name, len(t)))
    # doc
    for f in sorted(ROOT.glob("*.doc")):
        out = OUT_DIR / (f.stem + ".txt")
        try:
            t = doc_text_word(f)
        except Exception as e:
            t = f"[ERROR] {e}"
        out.write_text(t, encoding="utf-8")
        index.append((f.name, out.name, len(t)))
    # pptx
    for f in sorted(ROOT.glob("*.pptx")):
        out = OUT_DIR / (f.stem + ".txt")
        try:
            t = pptx_text(f)
        except Exception as e:
            t = f"[ERROR] {e}"
        out.write_text(t, encoding="utf-8")
        index.append((f.name, out.name, len(t)))
    # pdf (course only, skip huge textbook if >50MB)
    for f in sorted(ROOT.glob("*.pdf")):
        if f.stat().st_size > 50_000_000:
            index.append((f.name, "SKIPPED_LARGE", f.stat().st_size))
            continue
        out = OUT_DIR / (f.stem + ".txt")
        try:
            t = pdf_text(f)
        except Exception as e:
            t = f"[ERROR] {e}"
        out.write_text(t, encoding="utf-8")
        index.append((f.name, out.name, len(t)))

    lines = ["# Extraction index\n"]
    for name, out, n in index:
        lines.append(f"- {name} -> {out} ({n} chars)\n")
    (OUT_DIR / "_INDEX.md").write_text("".join(lines), encoding="utf-8")
    print(f"Done: {len(index)} files -> {OUT_DIR}")


if __name__ == "__main__":
    main()
