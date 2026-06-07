# -*- coding: utf-8 -*-
"""各章知识点树（自上而下）— 对照笔记 § 小节。"""

CHAPTER_TREE = {
    1: """
```mermaid
flowchart TB
  root["Ch01 统计和统计学"]
  root --> S1["§一 三含义·五环节"]
  root --> S2["§二 描述/推断/理论/应用"]
  root --> S3["§三 学派·发展"]
  root --> S4["§四 尺度·数据类型"]
  S4 --> S4a["定类定序定距定比"]
  S4 --> S4b["品质/数量·截面/时序/面板"]
  root --> S5["§五 总体·标志·指标"]
  root --> S6["§六 变量·0-1"]
  root --> S7["§七 路径·软件"]
```
""",
    2: """
```mermaid
flowchart TB
  root["Ch02 统计调查"]
  root --> A["§一 概述"]
  root --> B["§二 原始/次级"]
  root --> C["§三 方案五要素"]
  root --> D["§四 时间/期限/单位"]
  root --> E["§五 普查·报表·抽样·重点·典型"]
  root --> F["§六 搜集方法"]
  root --> G["§七 预处理"]
  root --> H["§八 误差·效度信度"]
  root --> I["§九→Ch3 分组频数"]
```
""",
    3: """
```mermaid
flowchart TB
  root["Ch03 整理与显示"]
  root --> A["§一 整理程序"]
  root --> B["§二 分组"]
  root --> C["§三 次数分布"]
  C --> C1["单项·组距·累计·开口组"]
  root --> D["§四 统计表"]
  root --> E["§五 选图"]
  E --> E1["条饼直折散点箱线"]
  root --> F["§六 Excel"]
```
""",
    4: """
```mermaid
flowchart TB
  root["Ch04 总量与相对"]
  root --> A["§一 总量·时期时点"]
  root --> B["§二 相对概论"]
  root --> C["§三 六类相对"]
  C --> C1["结构·比例·比较"]
  C --> C2["动态·强度·计划完成"]
  root --> D["§五 原则·公报"]
```
""",
    5: """
```mermaid
flowchart TB
  root["Ch05 平均指标"]
  root --> A["§一 算术x̄"]
  root --> B["§二 调和H"]
  root --> C["§三 几何G"]
  root --> D["§四 中位数Me"]
  root --> E["§五 四分位"]
  root --> F["§六 众数Mo"]
  root --> G["§6.5 三者关系"]
  root --> H["§七 五表·§八衔接"]
```
""",
    6: """
```mermaid
flowchart TB
  root["Ch06 标志变异"]
  root --> A["§一 总览"]
  root --> B["§二 极差·§三 四分位差"]
  root --> C["§四 平均差"]
  root --> D["§五 方差σ·0-1·平移缩放"]
  root --> E["§六 Z分数"]
  root --> F["§七 离散系数V"]
  root --> G["§八 偏度·峰度·方差分解"]
```
""",
    7: """
```mermaid
flowchart TB
  root["Ch07 抽样推断"]
  root --> F["§七 参数估计"]
  root --> G["§八 假设检验"]
  G --> G1["t 均值 σ未知"]
  G --> G2["Z 均值σ已知/成数"]
  G --> G3["p值·五步"]
  root --> H["§九 样本容量n"]
```
""",
    8: """
```mermaid
flowchart TB
  root["Ch08 相关回归"]
  root --> D["§四 r + t检验ρ"]
  root --> E["§五 一元回归"]
  E --> E1["§五·8 t检b"]
  E --> E2["§五·8 F检方程 F=MSR/MSE"]
  root --> F["§六 多元 F整体·t单个"]
  root --> G["§七 Excel t/F Stat"]
```
""",
    9: """
```mermaid
flowchart TB
  root["Ch09 时间数列"]
  root --> A["§一 基础·可比性"]
  root --> B["§二 水平指标"]
  root --> C["§三 速度指标"]
  root --> D["§四 构成测定"]
  D --> D1["长期趋势"]
  D --> D2["季节变动"]
  D --> D3["ARMA拓展"]
```
""",
    10: """
```mermaid
flowchart TB
  root["Ch10 统计指数"]
  root --> A["§一 概念"]
  root --> B["§二 个体指数"]
  root --> C["§三 综合·拉氏派氏"]
  root --> D["§四 平均指数"]
  root --> E["§五 体系·因素分析"]
  root --> F["§五续 数列·基期更换"]
  root --> G["§六 CPI·缩减指数"]
  root --> H["§七 股票指数"]
  root --> I["§八 优良性"]
```
""",
}

BOOK_TREE = """
```mermaid
flowchart TB
  book["统计学 全书"]
  book --> ch1["Ch1 绪论 §1-7"]
  book --> ch2["Ch2 调查 §1-9"]
  book --> ch3["Ch3 整理显示"]
  book --> ch4["Ch4 总量相对"]
  book --> ch5["Ch5 平均"]
  book --> ch6["Ch6 变异"]
  book --> ch7["Ch7 抽样推断"]
  book --> ch8["Ch8 相关回归"]
  book --> ch9["Ch9 时序"]
  book --> ch10["Ch10 指数"]
  ch1 --> ch2 --> ch3 --> ch4 --> ch5 --> ch6 --> ch7 --> ch8
  ch4 --> ch9
  ch4 --> ch10
```
"""
