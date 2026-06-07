import { getHomeworkTableSnippet, getKpSectionFromUserMd } from './userChapterMarkdown'

/** 与用户「章节重点笔记」对齐的精简提要（备考向；完整原文见 userChapterMarkdown） */

export type ChapterNoteBlock = {
  kpId?: string
  heading: string
  content: string
}

export type ChapterNoteEntry = {
  chapterId: string
  title: string
  /** 全章概要（约 500–800 字） */
  summary: string
  blocks: ChapterNoteBlock[]
}

export const chapterNotes: ChapterNoteEntry[] = [
  {
    chapterId: 'ch1',
    title: '第一章 统计和统计学',
    summary:
      '本章建立统计学的整体框架。统计有统计工作、统计资料、统计学三层含义；工作流程为设计→调查→整理→分析→应用。统计学分为理论/应用、描述/推断两大分科。数据按测量层次分为定类、定序、定距、定比；按性质分为品质与数量，按时间维度有截面、时间序列、面板数据。基本概念：总体与总体单位、标志与指标、变量与变量值——统计学研究的是总体的数量特征，不是单个单位。学派（国势、政治算术、数理、社会统计）了解代表人物即可。期末闭卷 Ch1–Ch6 必考，本章以概念辨析为主。',
    blocks: [
      {
        kpId: 'kp1-1',
        heading: '统计的三层含义',
        content:
          '广义统计包括：①统计工作——收集、整理、分析数据的活动；②统计资料——工作中取得的数字资料；③统计学——方法论科学。统计学是收集、整理、描述和分析数据的方法科学，目的是探索数据内在数量规律。',
      },
      {
        kpId: 'kp1-2',
        heading: '统计工作环节',
        content: '正确顺序：统计设计→统计调查→统计整理→统计分析→统计应用。仅分组制表属于整理阶段；由样本估计总体属于推断统计（分析阶段）。',
      },
      {
        kpId: 'kp1-5',
        heading: '描述与推断',
        content:
          '描述统计：对已有数据整理、图表、概括（如频数表、平均数）。推断统计：由样本推断总体（估计、检验）。绘制直方图、编制频数表属描述；根据样本估计总体均值属推断。',
      },
      {
        kpId: 'kp1-6',
        heading: '数据类型',
        content:
          '定类无顺序（性别）；定序有顺序（满意度等级）；定距有相等间隔无绝对零点（摄氏温度）；定比有绝对零点可算比率（身高、收入）。层次越高，可用方法越多。',
      },
      {
        kpId: 'kp1-8',
        heading: '总体与单位',
        content: '总体是研究对象的全部单位；总体单位是个体。统计学以总体为研究对象，研究其数量特征。班级=总体，学生=单位。',
      },
      {
        kpId: 'kp1-13',
        heading: '样本',
        content: '样本是从总体抽取、代表总体的部分。推断统计用 x̄、p 估计 μ、π。10 名职工工资调查：若总体为全部职工，则 10 人为样本（C）。',
      },
      {
        kpId: 'kp1-9',
        heading: '标志与指标',
        content: '标志说明单位特征（分品质、数量）；指标说明总体数量特征。标志对应单位，指标对应总体。',
      },
    ],
  },
  {
    chapterId: 'ch2',
    title: '第二章 统计调查',
    summary:
      '本章讲数据从哪来、怎么收集与初步整理。数据来源包括调查、实验、文献等；须设计调查方案（目的、对象、项目、时间、方法）。组织方式：统计报表、普查（全部单位）、重点调查、典型调查、抽样调查（部分推断总体）。整理核心是统计分组与次数分布数列：品质数列按类分组，变量数列分单项式与组距式；组距数列要会算组距、组界、组中值。误差分登记误差（非抽样）与抽样误差，二者不可混淆。抽样须随机，方便样本不能作严格推断。',
    blocks: [
      {
        kpId: 'kp2-2',
        heading: '调查方案',
        content: '方案设计首先明确调查目的与对象，再定调查项目、时间、方法与调查表。没有目的就无法确定收集什么数据。',
      },
      {
        kpId: 'kp2-3',
        heading: '普查与报表',
        content: '普查对总体全部单位调查，如人口普查；统计报表定期自下而上报送。对全班60人逐一登记成绩属于全面调查。',
      },
      {
        kpId: 'kp2-5',
        heading: '抽样调查',
        content: '随机抽取部分单位，用样本推断总体。省时省力，但须保证代表性。随机抽产品检验属抽样；普查不是抽样。',
      },
      {
        kpId: 'kp2-8',
        heading: '组距数列',
        content: '组距=组上限−组下限；组中值=(下限+上限)/2。组界归属要统一（如左闭右开），80分计入哪一组是常见易错点。',
      },
      {
        kpId: 'kp2-9',
        heading: '调查误差',
        content: '登记误差（抄录、口径不一致）属非抽样误差，应质量控制；抽样误差是抽样固有，随样本量增大通常减小。',
      },
    ],
  },
  {
    chapterId: 'ch3',
    title: '第三章 统计数据的整理与显示',
    summary:
      '本章在分组基础上用表和图展示数据。统计表：主词（对象及分组）、宾词（说明项目）、数字资料；设计要标题完整、单位统一、合计清楚。Excel 透视表可快速做二维、三维交叉汇总。统计图按类型选用：条形图比分类、饼图看构成（类别不宜过多）、直方图看连续分组分布（条间无隙）、折线图看趋势。图要有标题、轴标、单位、图例，比例不能误导。考试常考「哪种图适合哪种数据」，以及表与图的互补关系。',
    blocks: [
      {
        kpId: 'kp3-1',
        heading: '统计表结构',
        content: '主词是所研究对象及其分组（常放表左侧）；宾词是说明项目。还有表头、计量单位、附注。缺单位或合计不清是常见失分点。',
      },
      {
        kpId: 'kp3-5',
        heading: '条形图与饼图',
        content: '条形图用于分类数据比较；饼图表示部分占总体比重，类别过多（如20类）不宜用饼图。各部分比重之和应为100%。',
      },
      {
        kpId: 'kp3-6',
        heading: '直方图',
        content: '直方图用于连续数据的分组分布，矩形面积表示频数，条间通常无隙。把连续数据画成有条隙的条形图是错误用法。',
      },
      {
        kpId: 'kp3-7',
        heading: '折线图',
        content: '折线图突出时间或顺序上的变化，如月度销售额趋势。无时间顺序的分类数据不宜用折线连接。',
      },
    ],
  },
  {
    chapterId: 'ch4',
    title: '第四章 总量指标与相对指标',
    summary:
      '总量指标（绝对数）反映规模，是计算相对数的基础。要会判时期指标与时点指标：时期指标反映一段时期内累计（产量、销售额），可累加、与时间长度有关；时点指标反映某时刻存量（人数、库存），一般不可累加。口诀：时期「三随」，时点「三否」。相对指标分五类：计划完成程度（实际/计划）、结构相对数（部分/总体）、比例相对数（部分/部分）、比较相对数（不同空间）、强度相对数（总量/总量，如人均GDP）。应用时注意可比性，并要结合绝对数说明问题。',
    blocks: [
      {
        kpId: 'kp4-2',
        heading: '时期与时点',
        content:
          '时期指标：一段时期内连续变化的总量，如产品产量、商品销售额——可累加。时点指标：某时刻上的总量，如职工人数、库存量——一般不可累加。',
      },
      {
        kpId: 'kp4-5',
        heading: '计划完成程度',
        content: '计划完成程度=实际完成数÷计划数×100%，可超过100%。分子分母必须是同一指标、同一时间口径。',
      },
      {
        kpId: 'kp4-6',
        heading: '结构相对数',
        content: '结构相对数=部分数值÷总体数值×100%，各组成部分比重之和为100%，反映内部构成。',
      },
      {
        kpId: 'kp4-9',
        heading: '强度相对数',
        content: '强度相对数=某一总量÷另一有联系总量，如人口密度、人均GDP。分子分母可不属于同一总体，有「平均」含义。',
      },
    ],
  },
  {
    chapterId: 'ch5',
    title: '第五章 平均指标',
    summary:
      '平均指标反映一般水平，分数值平均（算术、调和、几何）与位置平均（中位数、众数）。算术平均 x̄=Σx/n，易受极端值影响；加权平均 x̄=Σ(xf)/Σf，组距资料用组中值。调和平均用于速率（路程相同）；几何平均用于比率、增长率连乘。中位数、众数适合偏态。对称分布时 x̄、Me、Mo 接近；右偏 x̄>Me>Mo。计算题：给数据算平均数、给频数组距算加权平均、给增长率算几何平均、给速度算调和平均。Excel：AVERAGE、GEOMEAN、HARMEAN、MEDIAN、MODE。',
    blocks: [
      {
        kpId: 'kp5-2',
        heading: '算术平均数',
        content: 'x̄=Σx/n。样本 2,4,6,8,10 的平均数为6。离差之和为零；离差平方和最小。',
      },
      {
        kpId: 'kp5-3',
        heading: '加权算术平均',
        content: 'x̄=Σ(x·f)/Σf。组距数列用组中值代表组内各值。各组次数相等时，加权平均可等于用组中值的简单平均。',
      },
      {
        kpId: 'kp5-5',
        heading: '调和平均数',
        content: 'H=n/Σ(1/x)。甲乙两地路程相同，去程60km/h、回程40km/h，全程平均速度用调和平均，不是算术平均。',
      },
      {
        kpId: 'kp5-6',
        heading: '几何平均数',
        content: '各年增长率求平均增长率用几何平均，不能对增长率简单算术平均。各期比率连乘后开n次方。',
      },
      {
        kpId: 'kp5-9',
        heading: '三平均数关系',
        content: '右偏分布：算术平均数>中位数>众数。偏态收入数据报「典型水平」优先中位数。',
      },
    ],
  },
  {
    chapterId: 'ch6',
    title: '第六章 标志变异指标',
    summary:
      '变异指标描述离散程度，与第5章平均指标配合。极差R=max−min；四分位差IQR=Q3−Q1；平均差是离差绝对值的平均。方差σ²=Σ(x−x̄)²/n，标准差σ=√σ²；样本用分母n−1。组距资料用加权公式。0-1标志：σ²=p(1−p)。离散系数V=σ/x̄，比较不同量纲或不同均值水平的离散程度。偏态、峰度描述分布形态；变量愈分散，算术平均数代表性愈差。Excel：STDEV、VAR、SKEW、KURT。计算题：给数据算标准差、给p算0-1方差、给σ和x̄算离散系数。',
    blocks: [
      {
        kpId: 'kp6-3',
        heading: '总体标准差',
        content: '步骤：求x̄→算离差→平方→平均→开方。数据4,4,4,4的标准差为0（无变异）。',
      },
      {
        kpId: 'kp6-4',
        heading: '样本标准差',
        content: '样本标准差分母用n−1，目的是无偏估计总体方差。与总体公式（分母n）区分是考试重点。',
      },
      {
        kpId: 'kp6-6',
        heading: '0-1标志方差',
        content: '成数p，σ²=p(1−p)，σ=√[p(1−p)]。如合格率80%，则p=0.8，σ²=0.16。',
      },
      {
        kpId: 'kp6-7',
        heading: '离散系数',
        content: 'V=σ/x̄。均值50、标准差5，离散系数=10%。比较身高(cm)与体重(kg)的离散程度必须用离散系数，不能直接比标准差。',
      },
      {
        kpId: 'kp6-10',
        heading: '综合解读',
        content: '完整描述一组数据：集中趋势+离散程度+分布形态。均值相同、标准差不同，含义完全不同。',
      },
      {
        kpId: 'kp6-13',
        heading: '平均差系数',
        content: 'V_AD=AD/x̄，无量纲。课后「相对离散指标」：平均差系数 A、离散系数 B。',
      },
    ],
  },
  {
    chapterId: 'ch7',
    title: '第七章 抽样推断',
    summary:
      '由样本推断总体参数。μ 为抽样平均误差，Δ=z·μ 为允许误差。重置/不重置抽样公式不同。点估计与区间估计；假设检验五步，α 弃真、β 取伪。样本容量 n 与误差反比。',
    blocks: [
      { kpId: 'kp7-7', heading: '重置与不重置', content: '放回=重置 μ=σ/√n；不放回需修正，n/N<5% 可近似。' },
      { kpId: 'kp7-9', heading: '两类错误', content: 'α 弃真；β 取伪。p<α 拒绝 H0。' },
    ],
  },
  {
    chapterId: 'ch8',
    title: '第八章 相关与回归分析',
    summary: '相关看 r 与 t 检 ρ；回归 ŷ=a+bx，R²=r²，t 检 b、F 检方程。多元整体 F、单个 t。',
    blocks: [
      { kpId: 'kp8-8', heading: '相关类型', content: '单/复相关；线/非线；正/负；完全相关含函数关系。' },
    ],
  },
  {
    chapterId: 'ch9',
    title: '第九章 时间数列分析',
    summary: '环比、定基、平均发展速度（几何平均）。趋势：移动平均、最小二乘。季节：实际÷趋势，指数和 400%。增长1%绝对值=前期/100。',
    blocks: [
      { kpId: 'kp9-7', heading: '增长1%绝对值', content: '=前期水平/100，连接速度与绝对量。' },
      { kpId: 'kp9-9', heading: '偶数项移动平均', content: '12 项首尾各少 6 项；偶数项需二次平均。' },
    ],
  },
  {
    chapterId: 'ch10',
    title: '第十章 统计指数',
    summary:
      '个体指数 Iq、Ip；拉氏量指、派氏价指；平均指数（量算术、价调和）。体系：销售额=量×价。CPI、基期更换编接。优良性三测试。',
    blocks: [
      { kpId: 'kp10-7', heading: '个体指数', content: 'Iq=q1/q0，Ip=p1/p0。' },
      { kpId: 'kp10-8', heading: '平均指数', content: '量→算术权 p0q0；价→调和权 p1q1。同比例时拉氏=派氏。' },
    ],
  },
]

export function getChapterNote(chapterId: string): ChapterNoteEntry | undefined {
  return chapterNotes.find((c) => c.chapterId === chapterId)
}

/** 学伴/学习页：优先用户 md 原文小节，其次精简提要 */
export function getKpNoteSnippet(chapterId: string, kpId: string): string {
  const fromMd = getKpSectionFromUserMd(chapterId, kpId)
  if (fromMd) return `【你的笔记】\n${fromMd}`

  const entry = getChapterNote(chapterId)
  if (!entry) return ''
  const block = entry.blocks.find((b) => b.kpId === kpId)
  if (block) return `【提要·${block.heading}】\n${block.content}`

  const hw = getHomeworkTableSnippet(chapterId)
  if (hw) return `【本章课后题速记】\n${hw.slice(0, 400)}…`
  return `【本章提要】\n${entry.summary.slice(0, 400)}…`
}

export function getChapterSummary(chapterId: string): string {
  return getChapterNote(chapterId)?.summary ?? ''
}
