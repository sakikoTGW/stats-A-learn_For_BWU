# -*- coding: utf-8 -*-
"""Write concise study notes (not raw dumps)."""
from pathlib import Path

OUT = Path(r"d:\统计课\章节重点笔记")

NOTES = {}  # filled below in exec

def img_link(ch: str) -> str:
    return f"\n> **课件图**：打开 [`第{ch}章-图片索引.md`](./第{ch}章-图片索引.md) 或 `图片/第{ch}章/` 查看 PPT/PDF 幻灯片。\n"

exec(open(Path(__file__).with_name("_notes_content.py"), encoding="utf-8").read())

for name, body in NOTES.items():
    (OUT / name).write_text(body, encoding="utf-8")
    print(name, len(body))

(OUT / "README.md").write_text("""# 统计学 · 章节复习笔记

这是**用来背的笔记**，不是课件原文。结构固定：

1. **本章主线** — 一句话 + 知识框架  
2. **必背概念** — 表格，只留定义与判别  
3. **核心公式** — 带符号说明与适用条件  
4. **易混辨析** — 考试最常混的几组  
5. **典型算法** — 分步怎么做  
6. **考点速记** — 课后题/课件题结论（题干关键词 → 答案）  
7. **课件图** — 见同目录 `第XX章-图片索引.md`

课件全文、习题全文在：`d:\\统计课\\_提取全文\\`（需要查原题时再打开）。

重新生成笔记：`python d:\\统计课\\_write_study_notes.py`
""", encoding="utf-8")
