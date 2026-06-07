# -*- coding: utf-8 -*-
"""从 _提取全文 习题 txt 生成「逐题知识点」Markdown（题干+答案+考点）。"""
import re
from pathlib import Path

ROOT = Path(r"d:\统计课")
OUT = ROOT / "章节重点笔记"

from easy_chapter_summaries import CHAPTER_EASY_SUMMARY

# 章号 -> [(源文件相对_提取全文, 章节标题)]
CHAPTER_SOURCES = {
    1: [
        ("课后作业--第一章统计学及其基本概念.txt", "课后作业·第一章"),
        ("1.2-数据及其分类.txt", "1.2 数据及其分类"),
        ("1.3-统计学基本概念.txt", "1.3 统计学基本概念"),
    ],
    2: [
        ("课后习题--第二章数据的收集与整理.txt", "课后习题·第二章"),
        ("2.1-数据的搜集.txt", "2.1 数据的搜集"),
        ("2.2-数据的整理.txt", "2.2 数据的整理"),
        ("2.3 次数分布数列.txt", "2.3 次数分布数列"),
    ],
    3: [
        ("课后习题--第三章统计表与统计图.txt", "课后习题·第三章"),
        ("3.2 统计图.txt", "3.2 统计图"),
    ],
    4: [
        ("4.1-总量指标和相对指标.txt", "4.1 总量与相对指标"),
        ("课后习题--第四、五章数据的描述性分析.txt", "课后习题·第四章"),
    ],
    5: [
        ("5.1-数值平均数.txt", "5.1 数值平均数"),
        ("5.2-位置平均数.txt", "5.2 位置平均数"),
        ("课后习题--第四、五章数据的描述性分析.txt", "课后习题·第四五章（平均部分）"),
    ],
    6: [
        ("5.3-数据的离散程度.txt", "5.3 离散程度"),
        ("5.4-离散系数.txt", "5.4 离散系数"),
        ("5.5-数据的分布形态.txt", "5.5 分布形态"),
        ("课后习题--第四、五章数据的描述性分析.txt", "课后习题·第四五章（离散部分）"),
    ],
    7: [
        ("2.1-数据的搜集.txt", "2.1 抽样与调查（推断基础）"),
    ],
    8: [
        ("课后习题--第六章相关与回归分析.txt", "课后习题·第六章（相关回归）"),
        ("6.1-相关系数.txt", "6.1 相关系数"),
        ("6.2-一元线性回归.txt", "6.2 一元回归"),
        ("6.3-多元线性回归.txt", "6.3 多元回归"),
    ],
    9: [
        ("课后习题 --第七章时间序列.txt", "课后习题·第七章（时间数列）"),
    ],
    10: [
        ("课后习题 --第八章统计指数.txt", "课后习题·第八章"),
        ("8.1-统计指数计算.txt", "8.1 统计指数计算"),
        ("8.2-指数体系.txt", "8.2 指数体系"),
        ("8.3-几种常用的指数.txt", "8.3 常用指数"),
    ],
}

# 考点关键词推断（题干片段 -> 知识点一句）
HINTS = [
    (r"推断统计", "推断统计：由样本推断总体参数（参数估计、假设检验）"),
    (r"国势|有名无实", "国势学派：有统计学之名无统计学之实"),
    (r"计量尺度由低到高", "尺度从低到高：定类→定序→定距→定比（A）。定类只能分种类；定比有绝对零点（如年龄）。"),
    (r"定比尺度|定比.*年龄", "定比尺度：有绝对零点，可加减乘除、可比倍数。年龄是定比，性别/籍贯是定类。"),
    (r"定性数据|品质数据", "品质（定性）数据=分类数据+顺序数据（A），不是定距/定比。"),
    (r"定类|分类数据|性别|籍贯", "分类（定类）数据：性别、籍贯等，只能计数分类，不能比大小。"),
    (r"定序|顺序数据|优、良|非常满意", "顺序（定序）数据：优/良/中、满意度等级，能排序但间隔不一定相等（BD）。"),
    (r"时间序列", "时间序列：同一对象不同时点；截面为同一时点不同单位"),
    (r"品质数据|定性", "品质数据=分类+顺序"),
    (r"个体到总体|总体到个体|对总体数量特征的认识", "认识路径：从个体到总体（非总体到个体）"),
    (r"10个企业.*职工|企业职工的工资", "总体=全部职工（C）；工资总额是标志总量非总体"),
    (r"指标体系", "指标体系：一系列相互联系、相互制约的指标"),
    (r"统计.*涵义|统计一词", "统计三含义：统计工作、统计资料、统计学"),
    (r"描述统计内容", "描述统计：收集、加工、显示、分布概括；不含抽样推断"),
    (r"研究和应用来分|理论统计学", "按研究应用分：理论统计学+应用统计学（AC）"),
    (r"应用统计学范畴", "应用统计学：生物、农业、卫生、社会、人口统计等"),
    (r"政治算术.*创始人|配第|格朗特", "政治算术学派：配第、格朗特（CE）"),
    (r"统计指标的特点", "指标特点：可量性、大量性、综合性、具体性（无差异性）"),
    (r"SAS|SPSS|统计软件", "统计软件：SAS、SPSS、Stata（ACD）"),
    (r"Excel.*途径|数据分析工具", "Excel：函数、公式、数据分析工具（ABE）"),
    (r"样本", "样本：从总体抽取、代表总体的部分"),
    (r"标志值", "标志值：标志的具体表现（80分等）"),
    (r"品质标志", "品质标志：单位品质特征（等级、性别）"),
    (r"统计指标", "指标：总体的数量特征"),
    (r"统计标志", "标志：总体单位的属性/特征名称"),
    (r"总体单位", "总体单位：构成总体的基本单位"),
    (r"数量指标", "数量指标：绝对量（产量、销售额、废品量）"),
    (r"质量指标", "质量指标：率、密度、人均、平均类（相对数）；产量/销售额是绝对量→数量指标。"),
    (r"变换关系|互相对调", "指标与标志可随研究目的互换（ABD）；同一目的下不能对调（E错）。"),
    (r"^变量是|变量是 A", "变量：说明数量特征的概念（A），不是指标、不是总体。"),
    (r"构成统计总体", "总体单位：构成总体的个别单位（D），不是调查对象、不是标志值。"),
    (r"0-1|是非", "0-1标志：交替标志；方差最大p=0.5时0.25"),
    (r"连续型", "连续型变量：可取区间任意值"),
    (r"离散型", "离散型变量：整数、可数"),
    (r"机床.*产量.*产值", "产量离散（台）、产值连续（元）"),
    (r"次级|第二手", "次级数据：他人已加工发布（统计局网站）"),
    (r"原始", "原始数据：一次调查/实验取得"),
    (r"调查时限|调查期限", "调查期限=工作期限；调查时间=资料所属时间"),
    (r"普查", "普查：全面、专门、一次性 BCE"),
    (r"重点调查|80%", "重点调查：选权重大单位"),
    (r"典型调查|农村", "典型调查：有意识选典型；解剖麻雀、划类选典"),
    (r"等距|系统抽样", "等距（系统）抽样：排序后固定间隔"),
    (r"整群", "整群抽样：仍属非全面调查"),
    (r"分组.*首先", "分组首先选标志"),
    (r"穷尽|互斥", "分组原则：穷尽、互斥"),
    (r"上组限不在内", "连续变量组限：上组限不在内"),
    (r"向上累计|较小累计", "向上累计=小于某组上限"),
    (r"向下累计|较大累计", "向下累计=大于等于某组下限"),
    (r"组中值", "组中值：假定组内均匀分布；开口组公式"),
    (r"异距.*直方|频率密度", "异距直方图：面积=次数，纵轴频率密度"),
    (r"时点", "时点指标：不可加总、与时长无关"),
    (r"时期", "时期指标：可累计、与时长有关"),
    (r"结构相对", "结构相对=部分/总体"),
    (r"比较相对", "比较相对=不同空间同类指标比"),
    (r"强度相对|每千人", "强度相对=不同总体不同指标之比"),
    (r"动态相对|125%", "动态相对=报告期/基期=发展速度"),
    (r"计划完成|提高10%.*提高15%", "计划完成=1.15/1.10=104.55%；相对计划用增长率之比"),
    (r"党团员|女性人口.*比例|医生人数.*比重", "同总体部分/总体=结构相对，非比较/强度"),
    (r"每千人|医生人数", "强度相对=不同总体不同指标之比"),
    (r"权数|次数比重", "加权算术权数=次数或次数比重"),
    (r"调和", "调和平均：已知M和x、无次数；有0不能用"),
    (r"几何", "几何平均：比率连乘、正数"),
    (r"中位数", "中位数Me：位置平均，抗极端值"),
    (r"众数", "众数Mo：次数最多"),
    (r"极差|全距", "极差= xmax-xmin"),
    (r"标准差系数|离散系数", "离散系数=σ/x̄；均值或单位不同必用"),
    (r"离散程度的测度值愈大|离散程度.*愈大", "离散大→数据分散→平均代表性差（A）"),
    (r"算术平均数为100.*标准差为10|100，标准差为10.*20，标准差为3", "比离散系数：甲0.1<乙0.15→甲代表性好（C）"),
    (r"平均差的缺点", "平均差：数学性质不如方差（C）、含绝对值不便（E）→CE"),
    (r"算术平均数甲组小于乙组.*标准差甲组大于", "乙均值高且更集中→乙代表性与均衡性好（ACE）"),
    (r"调查方案的主要内容|统计调查方案", "调查方案：目的、对象、单位、时间、项目（ABCDE）"),
    (r"明确调查目的", "调查目的=要解决什么问题、为何调查（C）"),
    (r"偏度|左偏|右偏", "偏度：左偏众数>均值；右偏均值>众数"),
    (r"峰度", "峰度=0标准峰度；>0尖峰 <0平顶"),
    (r"方差分解|组间方差", "总方差=组间+组内平均"),
    (r"相关系数|r=", "Pearson r∈[-1,1]；须检验"),
    (r"回归系数", "b：x变1单位y平均变动"),
    (r"可决|决定系数|R", "R²=SSR/SST；一元R²=r²"),
    (r"F检验|F检验, 即方差分析", "多元整体：F=SSR/p÷SSE/(n-p-1)，选C/B；F显著→至少一个βj显著(A)，非全部"),
    (r"显著性检验.*应采用", "多元回归整体显著性→F检验(C)；单个系数→t检验"),
    (r"残差平方和的自由度", "一元回归 SSE 自由度=n-2（A）"),
    (r"回归平方和的自由度", "多元 SSR 自由度=p（D）"),
    (r"相关系数判断.*是否相关", "须做t检验判断ρ=0，不能只看r大小（D）"),
    (r"r=0\.4.*检验", "r=0.4且检验显著→正相关(C)；t=r√(n-2)/√(1-r²)"),
    (r"对整个回归方程进行显著性检验时", "多元整体用F检验即方差分析(B)，不是t代替整体"),
    (r"F检验表明线性关系显著", "F显著→至少有一个自变量与y线性相关显著(A)"),
    (r"备择假设通常为", "多元整体检验 H1：至少一个βj≠0（答案B）"),
    (r"拉氏", "数量指数：同度量因素固定基期价p0"),
    (r"派氏", "价格指数：同度量因素固定报告期量q1"),
    (r"CPI|物价指数", "CPI>100%生活水平降；实际工资=名义/CPI"),
    (r"销售量增加.*销售额不变|销售额不变.*销售量", "销量增、销售额不变→价格指数下降（B）"),
    (r"基期变量值加权|以基期.*加权", "基期加权=拉氏指数（A）"),
    (r"不变权数", "不变权数指数数列：拉氏定基价格指数（A）"),
    (r"生活水平有所下降|生活水平下降", "CPI>100%表示购买力下降（常选101即D）"),
    (r"上涨20%.*1元|1元钱只值", "CPI涨20%→购买力≈1/1.2≈0.83元（D）"),
    (r"90%的商品", "只能买90%→物价涨1/0.9-1≈11.11%（B）"),
    (r"正常的经济行为.*拉氏", "正常时拉氏指数>派氏指数（C）"),
    (r"^指数是|指数是（", "指数：综合反映变动、宏观指示器、常用%（ABCE）"),
    (r"设q为销售量|设q为", "q为销量、p为价：销售量指数反映销量综合变动及对销售额影响（CE）"),
    (r"同度量因素在指数", "同度量因素：权数+同度量作用（BE）"),
    (r"优良性", "指数优良性：时间颠倒、因子颠倒、循环测试（ABE）"),
    (r"商品零售价格指数为110", "零售价指110%：总体上涨、可有涨有落（C）"),
    (r"销售量指数和工资水平指数的同度量", "销量指数同度量=单价；工资指数=职工人数（D）"),
    (r"销售量增长10%.*价格也增长10%|增长10%.*增长10%", "双10%→销售额增21%（D）"),
    (r"销售额增长了1\.5%.*价格增长了1\.5", "销额与价格同增1.5%→销售量不变（D）"),
    (r"销售量不变.*销售额也不变", "量额不变→价格指数100%（C）"),
    (r"指数的调整作用", "指数调整：剔除价格因素影响（A）"),
    (r"道·琼斯|道琼斯", "道琼斯：工业30、运输20、公用6、综合56（ABCD）"),
    (r"减缩指数", "不变价=现价÷减缩指数；108%→2/1.08≈1.85（A）"),
    (r"三项移动平均", "n项移动平均首尾各少(n-1)/2项；三项少1项（A）"),
    (r"每年平均增加|利润额每年", "直线趋势b=每年平均增减量（B），不是截距110"),
    (r"移动平均趋势剔除|剔除长期趋势", "季节分析：实际值÷趋势值（C）"),
    (r"长期趋势有以下几种", "长期趋势：上升/下降/等差等（BCDE）"),
    (r"直线趋势方程.*参数b", "b是斜率，t每变1单位y平均增减（DE）"),
    (r"反映季节变动的指标", "季节指标：季节比率、季节指数（BD）"),
    (r"用趋势剔除法测定季节", "趋势剔除法：ACD"),
    (r"MA\(2\).*自相关", "MA(2)自相关2步后截尾（A或B视题）"),
    (r"ARMA", "ACF、PACF都拖尾→ARMA模型（C）"),
    (r"移动平均.*少", "n项移动平均首尾各少(n-1)/2项"),
    (r"趋势剔除|除以趋势", "季节分析：实际值÷趋势值"),
]


def infer_from_easy(ch: int, stem: str, answer: str) -> str | None:
    easy = CHAPTER_EASY_SUMMARY.get(ch, "")
    if not easy:
        return None
    ans = re.sub(r"[^A-E]", "", answer.upper())
    if not ans:
        return None
    hits = []
    for line in easy.split("\n"):
        raw = line.strip()
        if not raw.startswith("-"):
            continue
        content = raw.lstrip("- ").strip()
        for letter in ans:
            if re.search(
                rf"（[^）]*{letter}[^）]*）|\({letter}\)|\*\*{letter}\*\*|→\s*{letter}|选\s*{letter}",
                content,
            ):
                hits.append(content)
                break
    if not hits:
        return None
    if len(hits) == 1:
        return hits[0]
    words = re.findall(r"[\u4e00-\u9fff]{2,}", stem)
    scored = [(sum(1 for w in words if w in h), h) for h in hits]
    scored.sort(key=lambda x: (-x[0], len(x[1])))
    if scored[0][0] > 0:
        return scored[0][1]
    return hits[0]


def infer_knowledge(text: str, ch: int = 0, answer: str = "") -> str:
    found = []
    for pat, hint in HINTS:
        if re.search(pat, text, re.I):
            if hint not in found:
                found.append(hint)
    if found:
        return " ".join(found[:3])
    easy_hit = infer_from_easy(ch, text, answer) if ch else None
    if easy_hit:
        return easy_hit
    return "本题考点见上文「先读：习题考点」对应条目；结合选项回忆公式含义后自测。"


def parse_questions(content: str) -> list[dict]:
    items = []
    # split by question starts
    parts = re.split(r"(?=\n\s*\d+[\.\．、])", content)
    for part in parts:
        part = part.strip()
        if not part or len(part) < 10:
            continue
        m_ans = re.search(r"答案[：:]\s*([A-E]+(?:\s*[、,]\s*[A-E]+)*)", part, re.I)
        if not m_ans:
            m_ans = re.search(r"答案[：:]\s*([^\n]+)", part)
        if not m_ans:
            continue
        ans = m_ans.group(1).strip().replace(" ", "").replace("，", "").replace(",", "")
        # stem: before 答案
        stem = part[: m_ans.start()].strip()
        stem = re.sub(r"^\d+[\.\．、]\s*", "", stem)
        stem = re.sub(r"^问题[：:]\s*", "", stem)
        stem = re.sub(r"^[一二三四五六七八九十]+[、．.]\s*", "", stem)
        stem = re.sub(r"\s+", " ", stem)[:200]
        if not stem:
            continue
        items.append({"stem": stem, "answer": ans})
    return items


def section_md(
    title: str, items: list[dict], start_idx: int, ch: int = 0
) -> tuple[str, int]:
    lines = [f"### {title}", ""]
    idx = start_idx
    for it in items:
        idx += 1
        know = infer_knowledge(it["stem"], ch=ch, answer=it.get("answer", ""))
        lines.append(f"**{idx}.** {it['stem']}")
        lines.append(f"- **答案**：{it['answer']}")
        lines.append(f"- **怎么理解**：{know}")
        lines.append(f"- **正文位置**：见本章「先读：习题考点」+ 上文公式/表格小节")
        lines.append("")
    return "\n".join(lines), idx


def build_chapter(ch: int) -> str:
    extract = ROOT / "_提取全文"
    lines = [
        f"## 习题逐题精讲（答案与 `_提取全文` 一致）",
        "",
        "> **用法**：先读上文「先读：习题考点」理解概念 → 再逐题对答案。每题含「怎么理解」，不空喊「见正文」。",
        "",
    ]
    global_idx = 0
    seen_stems = set()
    for fname, title in CHAPTER_SOURCES.get(ch, []):
        path = extract / fname
        if not path.exists():
            continue
        raw = path.read_text(encoding="utf-8", errors="ignore")
        items = parse_questions(raw)
        if "第四、五章" in fname:
            if ch == 4:
                items = [x for x in items if not any(
                    k in x["stem"] for k in ["平均", "权数", "调和", "几何", "众数", "中位数",
                    "离散", "标准差", "极差", "偏度", "方差", "左偏", "管理人员", "劳动生产率"]
                )]
            elif ch == 5:
                avg_kw = ["加权", "平均", "权", "调和", "几何", "极端",
                    "劳动生产率", "管理人员", "众数", "中位数"]
                disp_kw = ["离散", "标准差", "极差", "偏度", "方差", "离散程度", "平均差", "均衡性"]
                items = [
                    x for x in items
                    if any(k in x["stem"] for k in avg_kw)
                    and not any(k in x["stem"] for k in disp_kw)
                ]
            elif ch == 6:
                items = [x for x in items if any(
                    k in x["stem"] for k in ["离散", "标准差", "极差", "偏度", "方差",
                    "系数", "扩大", "减去", "左偏", "右偏", "成数", "离散程度",
                    "平均差", "均衡", "代表性"]
                )]
            else:
                items = []
        if ch == 8 and "第六章" in fname:
            pass  # ch8 uses 第六章习题
        if ch == 9 and ch == 9:
            pass
        # dedupe
        unique = []
        for it in items:
            key = it["stem"][:60]
            if key in seen_stems:
                continue
            seen_stems.add(key)
            unique.append(it)
        if not unique:
            continue
        block, global_idx = section_md(title, unique, global_idx, ch=ch)
        lines.append(block)
    return "\n".join(lines)


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


def inject_into_note(ch: int, exercise_md: str):
    fname = NOTE_FILES.get(ch)
    if not fname:
        return
    path = OUT / fname
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    easy = CHAPTER_EASY_SUMMARY.get(ch, "").strip()
    marker_easy = "## 先读：本章习题考点"
    # 去掉旧习题段、重复自测、旧速记
    text = re.sub(r"\n## 先读：本章习题考点[\s\S]*?(?=\n## (?!先读))", "\n", text)
    text = re.sub(
        r"\n## [一二三四五六七八九十]+、[^\n]*(?:课后题速记|课后题要点)[^\n]*\n.*?(?=\n## )",
        "\n",
        text,
        flags=re.S,
    )
    text = re.sub(
        r"\n## 习题[^\n]*\n[\s\S]*?(?=\n## 配套课件)",
        "\n",
        text,
        flags=re.S,
    )
    text = re.sub(r"\n## 自测\n[\s\S]*?(?=\n## )", "\n", text)
    text = re.sub(r"\n## 自测\n[\s\S]*?(?=\n## 配套课件)", "\n", text)
    # 在「配套课件」前插入：易懂总结 + 逐题精讲 + 自测
    block = ""
    if easy and marker_easy not in text:
        block += easy + "\n\n---\n\n"
    block += exercise_md + "\n\n## 自测\n\n1. 先遮答案做一遍 → 再对「习题逐题精讲」。\n2. 错题回到「先读：习题考点」和正文公式段。\n"
    new_text = re.sub(r"(\n## 配套课件)", block + r"\1", text, count=1)
    path.write_text(new_text, encoding="utf-8")
    print(f"Updated {path.name}")


def main():
    for ch in range(1, 11):
        md = build_chapter(ch)
        appendix = OUT / f"第{ch:02d}章-习题逐题知识点.md"
        # find real name
        appendix = OUT / f"{NOTE_FILES[ch].replace('.md', '')}-习题逐题.md"
        appendix.write_text(f"# 第{ch:02d}章 习题逐题知识点\n\n{md}", encoding="utf-8")
        inject_into_note(ch, md)
    print("Done.")


if __name__ == "__main__":
    main()
