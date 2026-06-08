/** 自动生成 — 运行 node scripts/gen-final-exams.mjs 更新 */
import type { FinalExamPaper } from '../types/finalExam'

export const finalExamPapers: FinalExamPaper[] = [
  {
    id: 'final-a',
    title: '统计学原理 · 期末模拟卷 A',
    subtitle: '全章均衡 · 综合检测',
    focus: '十讲知识点均衡覆盖，适合第一轮全面自测',
    durationMinutes: 120,
    totalPoints: 100,
    sections: [
  {
    title: '一、单项选择题（每题2分，共20分）',
    instruction: '每题四个选项，只有一个正确答案。请将选项字母填在答题卡上。',
    questions: [
    {
      id: 'fa-s1',
      type: 'single',
      stem: '统计学的研究对象是（  ）。',
      options: ['个体数量特征', '总体数量特征', '样本数量特征', '标志的具体表现'],
      answer: 'B',
      explanation: '统计学以总体为研究对象，研究总体的数量特征与数量关系。',
      knowledgePointIds: ['kp1-8'],
      chapterId: 'ch1',
      points: 2
    },
    {
      id: 'fa-s2',
      type: 'single',
      stem: '下列属于非全面调查的是（  ）。',
      options: ['人口普查', '经济普查', '抽样调查', '第四次全国经济普查'],
      answer: 'C',
      explanation: '抽样调查只调查部分单位，属于非全面调查。',
      knowledgePointIds: ['kp2-5'],
      chapterId: 'ch2',
      points: 2
    },
    {
      id: 'fa-s3',
      type: 'single',
      stem: '展示连续变量分组后的频数分布，应优先选用（  ）。',
      options: ['饼图', '条形图', '直方图', '雷达图'],
      answer: 'C',
      explanation: '直方图用于连续数据的分组频数分布。',
      knowledgePointIds: ['kp3-6'],
      chapterId: 'ch3',
      points: 2
    },
    {
      id: 'fa-s4',
      type: 'single',
      stem: '下列指标中，属于时期指标的是（  ）。',
      options: ['年末库存量', '月初职工人数', '本季度商品销售额', '设备台数'],
      answer: 'C',
      explanation: '销售额是一定时期内累计发生量，属于时期指标。',
      knowledgePointIds: ['kp4-2'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fa-s5',
      type: 'single',
      stem: '组距数列计算一般水平，应使用（  ）。',
      options: ['简单算术平均数', '加权算术平均数', '调和平均数', '几何平均数'],
      answer: 'B',
      explanation: '组距数列用组中值×频数计算加权算术平均数。',
      knowledgePointIds: ['kp5-3'],
      chapterId: 'ch5',
      points: 2
    },
    {
      id: 'fa-s6',
      type: 'single',
      stem: '比较两个均值相差较大、计量单位不同的数列离散程度，宜采用（  ）。',
      options: ['极差', '标准差', '离散系数', '平均差'],
      answer: 'C',
      explanation: '离散系数 V=σ/x̄ 为无量纲，可跨均值水平和量纲比较。',
      knowledgePointIds: ['kp6-7'],
      chapterId: 'ch6',
      points: 2
    },
    {
      id: 'fa-s7',
      type: 'single',
      stem: '总体方差未知、小样本（n<30）时对均值作区间估计，应使用（  ）。',
      options: ['正态分布', 't 分布', 'χ² 分布', 'F 分布'],
      answer: 'B',
      explanation: 'σ 未知且小样本时，用 t 分布构造置信区间。',
      knowledgePointIds: ['kp7-4'],
      chapterId: 'ch7',
      points: 2
    },
    {
      id: 'fa-s8',
      type: 'single',
      stem: '一元线性回归中，判定系数 R² 的取值范围是（  ）。',
      options: ['[0, 1]', '(-1, 1)', '[0, +∞)', '(-∞, +∞)'],
      answer: 'A',
      explanation: 'R²=SSR/SST 表示拟合优度，取值在 0 到 1 之间。',
      knowledgePointIds: ['kp8-4'],
      chapterId: 'ch8',
      points: 2
    },
    {
      id: 'fa-s9',
      type: 'single',
      stem: '各期环比发展速度连乘等于（  ）。',
      options: ['各期环比增长速度之和', '定基发展速度', '平均发展速度', '逐期增长量之和'],
      answer: 'B',
      explanation: '定基发展速度=各期环比发展速度的连乘积。',
      knowledgePointIds: ['kp9-1'],
      chapterId: 'ch9',
      points: 2
    },
    {
      id: 'fa-s10',
      type: 'single',
      stem: '编制数量综合指数时，同度量因素（价格）一般固定在（  ）。',
      options: ['报告期', '基期', '两期平均', '任意时期'],
      answer: 'B',
      explanation: '数量指数拉氏公式：Lq=Σp₀q₁/Σp₀q₀，价格固定在基期。',
      knowledgePointIds: ['kp10-1'],
      chapterId: 'ch10',
      points: 2
    }
    ]
  },
  {
    title: '二、多项选择题（每题3分，共15分）',
    instruction: '每题五个选项，至少两个正确。多选、少选、错选均不得分。',
    questions: [
    {
      id: 'fa-m1',
      type: 'multi',
      stem: '描述统计与推断统计，下列正确的有（  ）。',
      options: ['描述统计对已有数据汇总展示', '推断统计由样本推断总体', '描述统计是推断统计的基础', '推断统计不需要随机抽样', '二者研究目的完全相同'],
      answer: 'ABC',
      explanation: '推断统计需要随机抽样；二者目的不同。',
      knowledgePointIds: ['kp1-5', 'kp7-1'],
      chapterId: 'ch1',
      points: 3
    },
    {
      id: 'fa-m2',
      type: 'multi',
      stem: '统计调查方案应明确的内容包括（  ）。',
      options: ['调查目的与对象', '调查项目与时间', '调查方法与组织措施', '仅调查表格式', '经费与质量控制'],
      answer: 'ABCE',
      explanation: '完整方案含目的、对象、项目、时间、方法、组织、经费等。',
      knowledgePointIds: ['kp2-2'],
      chapterId: 'ch2',
      points: 3
    },
    {
      id: 'fa-m3',
      type: 'multi',
      stem: '相对指标的主要形式包括（  ）。',
      options: ['结构相对数', '比较相对数', '强度相对数', '动态相对数', '计划完成程度相对数'],
      answer: 'ABCDE',
      explanation: '教材所列相对指标主要类型。',
      knowledgePointIds: ['kp4-4'],
      chapterId: 'ch4',
      points: 3
    },
    {
      id: 'fa-m4',
      type: 'multi',
      stem: '关于假设检验，正确的有（  ）。',
      options: ['α 控制第一类错误', 'p<α 时拒绝 H₀', 'β 为第二类错误概率', '接受 H₀ 等于 H₀ 一定成立', '检验与置信区间有对偶关系'],
      answer: 'ABCE',
      explanation: '不拒绝 H₀ 只表示证据不足，不能证明 H₀ 成立。',
      knowledgePointIds: ['kp7-5', 'kp7-9'],
      chapterId: 'ch7',
      points: 3
    },
    {
      id: 'fa-m5',
      type: 'multi',
      stem: '综合指数中同度量因素的作用包括（  ）。',
      options: ['使不同单位转化为可相加形式', '作为权数', '固定在不同期以区分拉氏与派氏', '消除季节变动', '仅用于个体指数'],
      answer: 'ABC',
      explanation: '同度量因素起媒介和权数双重作用。',
      knowledgePointIds: ['kp10-12', 'kp10-4'],
      chapterId: 'ch10',
      points: 3
    }
    ]
  },
  {
    title: '三、判断题（每题1分，共10分）',
    instruction: '判断下列各题是否正确，正确的填"对"，错误的填"错"。',
    questions: [
    {
      id: 'fa-j1',
      type: 'judge',
      stem: '品质数据包括定类数据和定序数据。',
      options: ['对', '错'],
      answer: '对',
      explanation: '定类、定序均属于品质数据。',
      knowledgePointIds: ['kp1-18'],
      chapterId: 'ch1',
      points: 1
    },
    {
      id: 'fa-j2',
      type: 'judge',
      stem: '调查时间是指搜集资料所需的工作时间。',
      options: ['对', '错'],
      answer: '错',
      explanation: '调查时间指资料所属时间；工作时间为调查期限。',
      knowledgePointIds: ['kp2-12'],
      chapterId: 'ch2',
      points: 1
    },
    {
      id: 'fa-j3',
      type: 'judge',
      stem: '等距直方图中，矩形的高度与组内频数成正比。',
      options: ['对', '错'],
      answer: '对',
      explanation: '等距分组时纵轴为频数，高度∝频数。',
      knowledgePointIds: ['kp3-12'],
      chapterId: 'ch3',
      points: 1
    },
    {
      id: 'fa-j4',
      type: 'judge',
      stem: '强度相对数的分子与分母必须属于同一总体。',
      options: ['对', '错'],
      answer: '错',
      explanation: '结构相对数要求同总体；强度相对数分子分母可不同总体。',
      knowledgePointIds: ['kp4-14'],
      chapterId: 'ch4',
      points: 1
    },
    {
      id: 'fa-j5',
      type: 'judge',
      stem: '右偏分布时，算术平均数大于中位数。',
      options: ['对', '错'],
      answer: '对',
      explanation: '右偏时 x̄>Me>Mo。',
      knowledgePointIds: ['kp5-9'],
      chapterId: 'ch5',
      points: 1
    },
    {
      id: 'fa-j6',
      type: 'judge',
      stem: '样本标准差分母为 n−1 是为了得到总体方差的无偏估计。',
      options: ['对', '错'],
      answer: '对',
      explanation: '贝塞尔校正使 s² 成为 σ² 的无偏估计。',
      knowledgePointIds: ['kp6-4'],
      chapterId: 'ch6',
      points: 1
    },
    {
      id: 'fa-j7',
      type: 'judge',
      stem: '不重置抽样时，抽样平均误差大于重置抽样。',
      options: ['对', '错'],
      answer: '错',
      explanation: '有限总体修正系数<1，不放回时 μ 更小。',
      knowledgePointIds: ['kp7-7'],
      chapterId: 'ch7',
      points: 1
    },
    {
      id: 'fa-j8',
      type: 'judge',
      stem: '相关系数 r=0 说明两变量不存在任何相关关系。',
      options: ['对', '错'],
      answer: '错',
      explanation: 'r=0 只表示无线性相关，仍可能有曲线相关。',
      knowledgePointIds: ['kp8-6'],
      chapterId: 'ch8',
      points: 1
    },
    {
      id: 'fa-j9',
      type: 'judge',
      stem: '三项移动平均后，时间数列首尾各减少 1 项。',
      options: ['对', '错'],
      answer: '对',
      explanation: 'n 项移动平均首尾各少 (n−1)/2 项。',
      knowledgePointIds: ['kp9-3'],
      chapterId: 'ch9',
      points: 1
    },
    {
      id: 'fa-j10',
      type: 'judge',
      stem: '正常情况下，拉氏价格指数大于派氏价格指数。',
      options: ['对', '错'],
      answer: '错',
      explanation: '正常情形下拉氏价格指数小于派氏价格指数。',
      knowledgePointIds: ['kp10-1'],
      chapterId: 'ch10',
      points: 1
    }
    ]
  },
  {
    title: '四、填空题（每题2分，共10分）',
    instruction: '在横线上填写正确答案，不写过程。',
    questions: [
    {
      id: 'fa-f1',
      type: 'fill',
      stem: '统计表由主词、宾词、数字资料、表头和______等部分组成。',
      answer: '计量单位',
      explanation: '统计表基本结构之一。',
      knowledgePointIds: ['kp3-1'],
      chapterId: 'ch3',
      points: 2
    },
    {
      id: 'fa-f2',
      type: 'fill',
      stem: '计划完成程度相对数=实际完成数÷______×100%。',
      answer: '计划数',
      explanation: '计划完成程度=实际/计划×100%。',
      knowledgePointIds: ['kp4-5'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fa-f3',
      type: 'fill',
      stem: 'n 个正数的几何平均数 G=______。',
      answer: 'ⁿ√(x₁·x₂·…·xₙ)',
      explanation: '几何平均适用于比率连乘。',
      knowledgePointIds: ['kp5-6'],
      chapterId: 'ch5',
      points: 2
    },
    {
      id: 'fa-f4',
      type: 'fill',
      stem: '0-1 标志（成数 p）的总体方差 σ²=______。',
      answer: 'p(1−p)',
      explanation: '品质标志方差公式。',
      knowledgePointIds: ['kp6-6'],
      chapterId: 'ch6',
      points: 2
    },
    {
      id: 'fa-f5',
      type: 'fill',
      stem: 'Pearson 相关系数 r 的取值范围是______。',
      answer: '[-1,1]',
      explanation: 'r 衡量线性相关程度。',
      knowledgePointIds: ['kp8-2'],
      chapterId: 'ch8',
      points: 2
    }
    ]
  },
  {
    title: '五、计算与分析题（共45分）',
    instruction: '要求写出必要的计算过程与公式，结果保留两位小数（除非另有说明）。',
    questions: [
    {
      id: 'fa-c1',
      type: 'calc',
      stem: '某班 40 名同学成绩分组：60以下4人、60-7010人、70-8012人、80-9010人、90以上4人。\n\n（1）用组中值计算加权算术平均数。（8分）\n（2）计算 70-80 分组的结构相对数。（4分）\n（3）80 分以上为优秀，求优秀率 p 及 σ²=p(1−p)。（3分）',
      answer: 'x̄=75.25；30%；p=0.35，σ²=0.2275',
      explanation: '组中值 55,65,75,85,95；x̄=3010/40；结构=12/40；优秀14人。',
      knowledgePointIds: ['kp5-3', 'kp4-6', 'kp6-6'],
      chapterId: 'ch5',
      points: 15,
      rubric: '（1）组中值与加权平均 8 分；（2）结构相对数 4 分；（3）成数与方差 3 分。'
    },
    {
      id: 'fa-c2',
      type: 'calc',
      stem: 'n=64 样本，x̄=52，s=8，总体近似正态，z₀.₀₂₅=1.96。\n\n（1）求 μ 的 95% 置信区间。（8分）\n（2）允许误差 Δ=2 时，95% 置信度下至少需多大 n？（7分）',
      answer: '（49.04，54.96）；n≥62',
      explanation: 'x̄±z·s/√n；n=(z·s/Δ)²≈61.5。',
      knowledgePointIds: ['kp7-4', 'kp7-6'],
      chapterId: 'ch7',
      points: 15,
      rubric: '（1）公式与区间 8 分；（2）样本量 7 分。'
    },
    {
      id: 'fa-c3',
      type: 'calc',
      stem: '三种商品：A(p₀=10,p₁=12,q₀=100,q₁=120)；B(20,18,50,60)；C(5,6,200,180)。\n\n（1）拉氏销售量总指数 Lq。（5分）\n（2）派氏价格总指数 Pp。（5分）\n（3）用指数体系分解销售额变动。（5分）',
      answer: 'Lq=108.33%；Pp=105.26%',
      explanation: 'Lq=Σp₀q₁/Σp₀q₀；Pp=Σp₁q₁/Σp₀q₁；销售额指数≈Lq×Pp。',
      knowledgePointIds: ['kp10-1', 'kp10-4'],
      chapterId: 'ch10',
      points: 15,
      rubric: '（1）拉氏 5 分；（2）派氏 5 分；（3）体系分解 5 分。'
    }
    ]
  }
    ]
  },
  {
    id: 'final-b',
    title: '统计学原理 · 期末模拟卷 B',
    subtitle: '描述统计强化 · 第四至六章',
    focus: '侧重总量与相对指标、平均数、离散程度及综合计算',
    durationMinutes: 120,
    totalPoints: 100,
    sections: [
  {
    title: '一、单项选择题（每题2分，共20分）',
    instruction: '每题四个选项，只有一个正确答案。请将选项字母填在答题卡上。',
    questions: [
    {
      id: 'fb-s1',
      type: 'single',
      stem: '下列属于质量指标的是（  ）。',
      options: ['工业总产值', '商品销售额', '人口密度', '粮食产量'],
      answer: 'C',
      explanation: '人口密度为强度/质量指标。',
      knowledgePointIds: ['kp1-15'],
      chapterId: 'ch1',
      points: 2
    },
    {
      id: 'fb-s2',
      type: 'single',
      stem: '代表误差即（  ）。',
      options: ['登记性误差', '抽样误差', '系统误差', '测量误差'],
      answer: 'B',
      explanation: '代表性误差即抽样误差。',
      knowledgePointIds: ['kp2-19'],
      chapterId: 'ch2',
      points: 2
    },
    {
      id: 'fb-s3',
      type: 'single',
      stem: '组距数列"上组限不在内"适用于（  ）。',
      options: ['品质数列', '单项式变量数列', '组距式变量数列', '时间数列'],
      answer: 'C',
      explanation: '组距式数列采用重叠组限规则。',
      knowledgePointIds: ['kp2-8'],
      chapterId: 'ch3',
      points: 2
    },
    {
      id: 'fb-s4',
      type: 'single',
      stem: '某企业 2024 年各月利润之和属于（  ）。',
      options: ['时点指标', '时期指标', '强度相对数', '结构相对数'],
      answer: 'B',
      explanation: '各月利润可累加，为时期指标。',
      knowledgePointIds: ['kp4-3'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fb-s5',
      type: 'single',
      stem: '去程 60km/h、回程 40km/h，全程平均速度用（  ）。',
      options: ['算术平均数', '调和平均数', '几何平均数', '中位数'],
      answer: 'B',
      explanation: '路程相同求平均速率用调和平均。',
      knowledgePointIds: ['kp5-5'],
      chapterId: 'ch5',
      points: 2
    },
    {
      id: 'fb-s6',
      type: 'single',
      stem: '每个观测值减 10，则（  ）。',
      options: ['均值减10，σ减10', '均值减10，σ不变', '均值不变，σ减10', '均不变'],
      answer: 'B',
      explanation: '平移：x̄减A，σ不变。',
      knowledgePointIds: ['kp6-14'],
      chapterId: 'ch6',
      points: 2
    },
    {
      id: 'fb-s7',
      type: 'single',
      stem: '第一类错误是指（  ）。',
      options: ['H₀真却接受', 'H₀真却拒绝', 'H₀假却接受', 'H₀假却拒绝'],
      answer: 'B',
      explanation: '弃真错误，概率为 α。',
      knowledgePointIds: ['kp7-9'],
      chapterId: 'ch7',
      points: 2
    },
    {
      id: 'fb-s8',
      type: 'single',
      stem: '回归分析中，因变量是（  ）。',
      options: ['自变量 x', '随机变量 y', '解释变量', '任意变量'],
      answer: 'B',
      explanation: 'y 为因变量，x 为自变量。',
      knowledgePointIds: ['kp8-10'],
      chapterId: 'ch8',
      points: 2
    },
    {
      id: 'fb-s9',
      type: 'single',
      stem: '测定长期趋势的方法不包括（  ）。',
      options: ['移动平均法', '最小二乘法', '时距扩大法', '同季平均法'],
      answer: 'D',
      explanation: '同季平均法测季节变动。',
      knowledgePointIds: ['kp9-3'],
      chapterId: 'ch9',
      points: 2
    },
    {
      id: 'fb-s10',
      type: 'single',
      stem: '个体价格指数 Ip=（  ）。',
      options: ['q₁/q₀', 'p₁/p₀', 'p₁q₁/p₀q₀', 'Σp₁q₁/Σp₀q₀'],
      answer: 'B',
      explanation: 'Ip=p₁/p₀。',
      knowledgePointIds: ['kp10-7'],
      chapterId: 'ch10',
      points: 2
    }
    ]
  },
  {
    title: '二、多项选择题（每题3分，共15分）',
    instruction: '每题五个选项，至少两个正确。多选、少选、错选均不得分。',
    questions: [
    {
      id: 'fb-m1',
      type: 'multi',
      stem: '下列属于相对指标的有（  ）。',
      options: ['人均 GDP', '男女性别比', '计划完成率', '工业总产值', '库存占销售额比重'],
      answer: 'ABCE',
      explanation: '总产值为绝对数。',
      knowledgePointIds: ['kp4-4'],
      chapterId: 'ch4',
      points: 3
    },
    {
      id: 'fb-m2',
      type: 'multi',
      stem: '偏态分布中平均数关系，正确的有（  ）。',
      options: ['对称时三者接近', '右偏时 x̄>Me', '左偏时 x̄<Me', '右偏时 Me>Mo', '左偏时 Mo>Me'],
      answer: 'ABCD',
      explanation: '右偏 x̄>Me>Mo；左偏 x̄<Me<Mo。',
      knowledgePointIds: ['kp5-9'],
      chapterId: 'ch5',
      points: 3
    },
    {
      id: 'fb-m3',
      type: 'multi',
      stem: '标志变异指标包括（  ）。',
      options: ['极差', '标准差', '离散系数', '偏态系数', '峰度系数'],
      answer: 'ABCDE',
      explanation: '离散与形态指标均属变异描述。',
      knowledgePointIds: ['kp6-15'],
      chapterId: 'ch6',
      points: 3
    },
    {
      id: 'fb-m4',
      type: 'multi',
      stem: '加权算术平均与调和平均，正确的有（  ）。',
      options: ['标志总量相等时可转化', '速率类用调和平均', '简单平均是加权特例', '增长率连乘用几何平均', '权全为1时加权=简单'],
      answer: 'ABCE',
      explanation: '几何平均用于增长率连乘。',
      knowledgePointIds: ['kp5-5', 'kp5-3'],
      chapterId: 'ch5',
      points: 3
    },
    {
      id: 'fb-m5',
      type: 'multi',
      stem: '关于标准差与离散系数，正确的有（  ）。',
      options: ['σ与原数据同量纲', 'V 无量纲', '均值近0时慎用V', 'V越大离散越大', '均值相同可直接比σ'],
      answer: 'ABCDE',
      explanation: '均值不同应比 V。',
      knowledgePointIds: ['kp6-7'],
      chapterId: 'ch6',
      points: 3
    }
    ]
  },
  {
    title: '三、判断题（每题1分，共10分）',
    instruction: '判断下列各题是否正确，正确的填"对"，错误的填"错"。',
    questions: [
    {
      id: 'fb-j1',
      type: 'judge',
      stem: '标志总量就是总体单位个数。',
      options: ['对', '错'],
      answer: '错',
      explanation: '单位总量=个数；标志总量=标志值之和。',
      knowledgePointIds: ['kp4-13'],
      chapterId: 'ch4',
      points: 1
    },
    {
      id: 'fb-j2',
      type: 'judge',
      stem: '比较相对数用于不同空间同类现象对比。',
      options: ['对', '错'],
      answer: '对',
      explanation: '比较相对数反映空间差异。',
      knowledgePointIds: ['kp4-8'],
      chapterId: 'ch4',
      points: 1
    },
    {
      id: 'fb-j3',
      type: 'judge',
      stem: '定类、定序数据都可以直接求算术平均。',
      options: ['对', '错'],
      answer: '错',
      explanation: '品质数据不宜求 x̄。',
      knowledgePointIds: ['kp5-12'],
      chapterId: 'ch5',
      points: 1
    },
    {
      id: 'fb-j4',
      type: 'judge',
      stem: '各组水平不变、仅结构变化也可能改变总平均数。',
      options: ['对', '错'],
      answer: '对',
      explanation: '总平均受水平与结构共同影响。',
      knowledgePointIds: ['kp5-14'],
      chapterId: 'ch5',
      points: 1
    },
    {
      id: 'fb-j5',
      type: 'judge',
      stem: 'IQR 比极差更能抵抗极端值。',
      options: ['对', '错'],
      answer: '对',
      explanation: 'IQR 只反映中间50%离散。',
      knowledgePointIds: ['kp6-1'],
      chapterId: 'ch6',
      points: 1
    },
    {
      id: 'fb-j6',
      type: 'judge',
      stem: '偏态系数>0 表示左偏。',
      options: ['对', '错'],
      answer: '错',
      explanation: 'SK>0 为右偏。',
      knowledgePointIds: ['kp6-8'],
      chapterId: 'ch6',
      points: 1
    },
    {
      id: 'fb-j7',
      type: 'judge',
      stem: '动态相对数是报告期与基期同类指标之比。',
      options: ['对', '错'],
      answer: '对',
      explanation: '发展速度=报告/基期。',
      knowledgePointIds: ['kp4-11'],
      chapterId: 'ch4',
      points: 1
    },
    {
      id: 'fb-j8',
      type: 'judge',
      stem: '平均差对离差取绝对值。',
      options: ['对', '错'],
      answer: '对',
      explanation: 'AD=Σ|x−x̄|/n。',
      knowledgePointIds: ['kp6-2'],
      chapterId: 'ch6',
      points: 1
    },
    {
      id: 'fb-j9',
      type: 'judge',
      stem: '几何平均适用于负数数据。',
      options: ['对', '错'],
      answer: '错',
      explanation: '几何平均要求各值为正。',
      knowledgePointIds: ['kp5-6'],
      chapterId: 'ch5',
      points: 1
    },
    {
      id: 'fb-j10',
      type: 'judge',
      stem: '变量愈分散，平均数代表性愈差。',
      options: ['对', '错'],
      answer: '对',
      explanation: '需结合变异指标解读。',
      knowledgePointIds: ['kp6-10'],
      chapterId: 'ch6',
      points: 1
    }
    ]
  },
  {
    title: '四、填空题（每题2分，共10分）',
    instruction: '在横线上填写正确答案，不写过程。',
    questions: [
    {
      id: 'fb-f1',
      type: 'fill',
      stem: '结构相对数=部分数值÷______×100%。',
      answer: '总体数值',
      explanation: '反映部分占总体比重。',
      knowledgePointIds: ['kp4-6'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fb-f2',
      type: 'fill',
      stem: '简单算术平均数 x̄=Σx÷______。',
      answer: 'n',
      explanation: 'x̄=Σx/n。',
      knowledgePointIds: ['kp5-2'],
      chapterId: 'ch5',
      points: 2
    },
    {
      id: 'fb-f3',
      type: 'fill',
      stem: '总体标准差 σ=______。',
      answer: '√[Σ(x−x̄)²/n]',
      explanation: '总体用分母 n。',
      knowledgePointIds: ['kp6-3'],
      chapterId: 'ch6',
      points: 2
    },
    {
      id: 'fb-f4',
      type: 'fill',
      stem: '离散系数 V=______。',
      answer: 'σ/x̄',
      explanation: '无量纲相对离散。',
      knowledgePointIds: ['kp6-7'],
      chapterId: 'ch6',
      points: 2
    },
    {
      id: 'fb-f5',
      type: 'fill',
      stem: '人均 GDP 属于______相对数。',
      answer: '强度',
      explanation: '总量/总量，可不同总体。',
      knowledgePointIds: ['kp4-9'],
      chapterId: 'ch4',
      points: 2
    }
    ]
  },
  {
    title: '五、计算与分析题（共45分）',
    instruction: '要求写出必要的计算过程与公式，结果保留两位小数（除非另有说明）。',
    questions: [
    {
      id: 'fb-c1',
      type: 'calc',
      stem: '某地区：GDP 5000 亿元，人口 500 万人，零售总额 2000 亿元；2023年GDP 4800 亿元。\n\n（1）人均 GDP。（4分）\n（2）零售总额占 GDP 比重，并说明粮食产量/GDP 作结构是否合理。（6分）\n（3）GDP 发展速度。（5分）',
      answer: '10万元/人；40%；104.17%',
      explanation: '强度、结构、动态三类相对数。',
      knowledgePointIds: ['kp4-9', 'kp4-6', 'kp4-11'],
      chapterId: 'ch4',
      points: 15,
      rubric: '（1）强度 4 分；（2）结构判断3分+计算3分；（3）动态5分。'
    },
    {
      id: 'fb-c2',
      type: 'calc',
      stem: '三类员工：技术8000元/50人，管理12000元/20人，行政6000元/30人。\n\n（1）加权平均工资。（6分）\n（2）管理人员占比下降对总平均的影响。（4分）\n（3）行政组 5500-6500 元、30 人的组中值。（5分）',
      answer: '8200元；总平均下降；6000',
      explanation: 'x̄=8200；结构效应；组中值6000。',
      knowledgePointIds: ['kp5-3', 'kp5-14'],
      chapterId: 'ch5',
      points: 15,
      rubric: '（1）加权6分；（2）结构分析4分；（3）组中值5分。'
    },
    {
      id: 'fb-c3',
      type: 'calc',
      stem: '5名工人日产量：48,52,50,46,54。\n\n（1）x̄ 与 R。（5分）\n（2）样本标准差 s（n−1）。（5分）\n（3）离散系数 V 及代表性评价。（5分）',
      answer: '50；8；s≈3.16；V≈6.32%',
      explanation: '完整描述统计计算流程。',
      knowledgePointIds: ['kp5-2', 'kp6-1', 'kp6-4', 'kp6-7'],
      chapterId: 'ch6',
      points: 15,
      rubric: '（1）均值极差5分；（2）s 5分；（3）V与评价5分。'
    }
    ]
  }
    ]
  },
  {
    id: 'final-c',
    title: '统计学原理 · 期末模拟卷 C',
    subtitle: '推断统计强化 · 第七至八章',
    focus: '侧重抽样推断、假设检验、相关与一元回归分析',
    durationMinutes: 120,
    totalPoints: 100,
    sections: [
  {
    title: '一、单项选择题（每题2分，共20分）',
    instruction: '每题四个选项，只有一个正确答案。请将选项字母填在答题卡上。',
    questions: [
    {
      id: 'fc-s1',
      type: 'single',
      stem: '推断统计的研究特点是（  ）。',
      options: ['只对样本描述', '由样本推断总体', '不需要概率论', '只处理品质数据'],
      answer: 'B',
      explanation: '推断统计用样本统计量估计总体参数。',
      knowledgePointIds: ['kp1-5'],
      chapterId: 'ch1',
      points: 2
    },
    {
      id: 'fc-s2',
      type: 'single',
      stem: '等距抽样属于（  ）。',
      options: ['非概率抽样', '概率抽样', '典型调查', '重点调查'],
      answer: 'B',
      explanation: '等距（系统）抽样是概率抽样方法。',
      knowledgePointIds: ['kp2-18'],
      chapterId: 'ch2',
      points: 2
    },
    {
      id: 'fc-s3',
      type: 'single',
      stem: '散点图主要用于（  ）。',
      options: ['展示构成比', '观察两变量相关形态', '展示时间趋势', '展示频数分布'],
      answer: 'B',
      explanation: '散点图用于相关分析第一步。',
      knowledgePointIds: ['kp3-9'],
      chapterId: 'ch3',
      points: 2
    },
    {
      id: 'fc-s4',
      type: 'single',
      stem: '下列属于时点指标的是（  ）。',
      options: ['本年产值', '商品销售额', '月末库存额', '利润总额'],
      answer: 'C',
      explanation: '月末库存为某时刻存量，属时点指标。',
      knowledgePointIds: ['kp4-2'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fc-s5',
      type: 'single',
      stem: '各组标志值与权数已知，求一般水平用（  ）。',
      options: ['简单算术平均', '加权算术平均', '几何平均', '众数'],
      answer: 'B',
      explanation: '加权算术平均 x̄=Σxf/Σf。',
      knowledgePointIds: ['kp5-3'],
      chapterId: 'ch5',
      points: 2
    },
    {
      id: 'fc-s6',
      type: 'single',
      stem: '检验 Pearson 相关显著性，H₀ 为（  ）。',
      options: ['r=1', 'ρ=0', 'R²=0', 'b=0'],
      answer: 'B',
      explanation: '相关检验 H₀:ρ=0。',
      knowledgePointIds: ['kp8-2'],
      chapterId: 'ch8',
      points: 2
    },
    {
      id: 'fc-s7',
      type: 'single',
      stem: '一元回归 F 检验与 t 检验的关系是（  ）。',
      options: ['无关', 'F=t', 'F=t²', 'F=2t'],
      answer: 'C',
      explanation: '一元回归 F=t²。',
      knowledgePointIds: ['kp8-5'],
      chapterId: 'ch8',
      points: 2
    },
    {
      id: 'fc-s8',
      type: 'single',
      stem: '两组数据均值相同，比较离散程度应直接比较（  ）。',
      options: ['极差', '标准差', '离散系数', '众数'],
      answer: 'B',
      explanation: '均值相同可直接比较 σ。',
      knowledgePointIds: ['kp6-7'],
      chapterId: 'ch6',
      points: 2
    },
    {
      id: 'fc-s9',
      type: 'single',
      stem: '定基增长速度等于（  ）。',
      options: ['各期环比增长速度连乘', '定基发展速度−1', '逐期增长量/基期', '平均发展速度−1'],
      answer: 'B',
      explanation: '增长速度=发展速度−1。',
      knowledgePointIds: ['kp9-5'],
      chapterId: 'ch9',
      points: 2
    },
    {
      id: 'fc-s10',
      type: 'single',
      stem: '销售额指数=销售量指数×（  ）。',
      options: ['个体指数', '价格指数', '拉氏指数', '季节指数'],
      answer: 'B',
      explanation: '指数体系：销售额=量×价。',
      knowledgePointIds: ['kp10-4'],
      chapterId: 'ch10',
      points: 2
    }
    ]
  },
  {
    title: '二、多项选择题（每题3分，共15分）',
    instruction: '每题五个选项，至少两个正确。多选、少选、错选均不得分。',
    questions: [
    {
      id: 'fc-m1',
      type: 'multi',
      stem: '优良点估计的性质包括（  ）。',
      options: ['无偏性', '有效性', '一致性', '必等于样本值', '与样本量无关'],
      answer: 'ABC',
      explanation: '无偏、有效、一致为三大性质。',
      knowledgePointIds: ['kp7-8'],
      chapterId: 'ch7',
      points: 3
    },
    {
      id: 'fc-m2',
      type: 'multi',
      stem: '相关分析与回归分析的区别，正确的有（  ）。',
      options: ['相关 x、y 地位平等', '回归 y 为因变量', '相关用 r', '回归用 ŷ=a+bx', '回归可随意由 y 推 x'],
      answer: 'ABCD',
      explanation: '回归预测具有单向性。',
      knowledgePointIds: ['kp8-10', 'kp8-13'],
      chapterId: 'ch8',
      points: 3
    },
    {
      id: 'fc-m3',
      type: 'multi',
      stem: '影响抽样平均误差的因素有（  ）。',
      options: ['总体离散程度', '样本容量', '抽样方法', '调查表设计', '是否重置抽样'],
      answer: 'ABCE',
      explanation: 'σ、n、抽样方式、是否放回均影响 μ。',
      knowledgePointIds: ['kp7-2', 'kp7-7'],
      chapterId: 'ch7',
      points: 3
    },
    {
      id: 'fc-m4',
      type: 'multi',
      stem: '回归分析中 SST、SSR、SSE 的关系，正确的有（  ）。',
      options: ['SST=SSR+SSE', 'R²=SSR/SST', 'SSE 自由度 n−2（一元）', 'SSR+SSE=SST+1', 'Se=√(SSE/(n−2))'],
      answer: 'ABCE',
      explanation: '方差分解是 F 检验基础。',
      knowledgePointIds: ['kp8-7'],
      chapterId: 'ch8',
      points: 3
    },
    {
      id: 'fc-m5',
      type: 'multi',
      stem: '时期指标的特点包括（  ）。',
      options: ['反映一段时期累计量', '数值大小与时间长度有关', '各期数值可累加', '反映某时刻存量', '如销售额、产量'],
      answer: 'ABCE',
      explanation: 'D 为时点指标特点。',
      knowledgePointIds: ['kp4-2'],
      chapterId: 'ch4',
      points: 3
    }
    ]
  },
  {
    title: '三、判断题（每题1分，共10分）',
    instruction: '判断下列各题是否正确，正确的填"对"，错误的填"错"。',
    questions: [
    {
      id: 'fc-j1',
      type: 'judge',
      stem: '统计工作包括设计、调查、整理、分析、应用等环节。',
      options: ['对', '错'],
      answer: '对',
      explanation: '统计工作基本环节。',
      knowledgePointIds: ['kp1-2'],
      chapterId: 'ch1',
      points: 1
    },
    {
      id: 'fc-j2',
      type: 'judge',
      stem: '直方图与条形图都可以用于展示分类数据的频数。',
      options: ['对', '错'],
      answer: '错',
      explanation: '条形图用于分类；直方图用于连续分组数据。',
      knowledgePointIds: ['kp3-6'],
      chapterId: 'ch3',
      points: 1
    },
    {
      id: 'fc-j3',
      type: 'judge',
      stem: '一元回归 R²=r²。',
      options: ['对', '错'],
      answer: '对',
      explanation: '一元线性回归判定系数等于相关系数平方。',
      knowledgePointIds: ['kp8-4'],
      chapterId: 'ch8',
      points: 1
    },
    {
      id: 'fc-j4',
      type: 'judge',
      stem: '计划完成程度可以超过 100%。',
      options: ['对', '错'],
      answer: '对',
      explanation: '超额完成时计划完成程度>100%。',
      knowledgePointIds: ['kp4-5'],
      chapterId: 'ch4',
      points: 1
    },
    {
      id: 'fc-j5',
      type: 'judge',
      stem: '调和平均数适用于标志总量相等的平均比率问题。',
      options: ['对', '错'],
      answer: '对',
      explanation: '如路程相同求平均速度。',
      knowledgePointIds: ['kp5-5'],
      chapterId: 'ch5',
      points: 1
    },
    {
      id: 'fc-j6',
      type: 'judge',
      stem: '标准分数 z=(x−x̄)/σ 无量纲。',
      options: ['对', '错'],
      answer: '对',
      explanation: 'Z 分数标准化后无量纲。',
      knowledgePointIds: ['kp6-11'],
      chapterId: 'ch6',
      points: 1
    },
    {
      id: 'fc-j7',
      type: 'judge',
      stem: '完全相关时 r=±1、R²=1、Se=0。',
      options: ['对', '错'],
      answer: '对',
      explanation: '完全线性相关三条件。',
      knowledgePointIds: ['kp8-6'],
      chapterId: 'ch8',
      points: 1
    },
    {
      id: 'fc-j8',
      type: 'judge',
      stem: 'β 为第二类错误，即取伪概率。',
      options: ['对', '错'],
      answer: '对',
      explanation: 'H₀ 不成立却不拒绝，概率 β。',
      knowledgePointIds: ['kp7-9'],
      chapterId: 'ch7',
      points: 1
    },
    {
      id: 'fc-j9',
      type: 'judge',
      stem: '移动平均法可用于修匀时间数列长期趋势。',
      options: ['对', '错'],
      answer: '对',
      explanation: '移动平均是测定长期趋势的方法。',
      knowledgePointIds: ['kp9-3'],
      chapterId: 'ch9',
      points: 1
    },
    {
      id: 'fc-j10',
      type: 'judge',
      stem: '个体指数是综合指数的基础。',
      options: ['对', '错'],
      answer: '对',
      explanation: '先算个体指数再加权得总指数。',
      knowledgePointIds: ['kp10-7'],
      chapterId: 'ch10',
      points: 1
    }
    ]
  },
  {
    title: '四、填空题（每题2分，共10分）',
    instruction: '在横线上填写正确答案，不写过程。',
    questions: [
    {
      id: 'fc-f1',
      type: 'fill',
      stem: '重置抽样下，均值抽样平均误差 μ=______。',
      answer: 'σ/√n',
      explanation: '放回抽样公式。',
      knowledgePointIds: ['kp7-7'],
      chapterId: 'ch7',
      points: 2
    },
    {
      id: 'fc-f2',
      type: 'fill',
      stem: 't 检验统计量 t=(x̄−μ₀)/______。',
      answer: 's/√n',
      explanation: 'σ 未知用小样本 t 检验。',
      knowledgePointIds: ['kp7-5'],
      chapterId: 'ch7',
      points: 2
    },
    {
      id: 'fc-f3',
      type: 'fill',
      stem: '结构相对数=部分数值÷______×100%。',
      answer: '总体数值',
      explanation: '反映部分占总体比重。',
      knowledgePointIds: ['kp4-6'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fc-f4',
      type: 'fill',
      stem: '离散系数 V=σ÷______。',
      answer: 'x̄',
      explanation: '相对离散程度指标。',
      knowledgePointIds: ['kp6-7'],
      chapterId: 'ch6',
      points: 2
    },
    {
      id: 'fc-f5',
      type: 'fill',
      stem: '派氏价格指数 Pp=Σp₁q₁/______。',
      answer: 'Σp₀q₁',
      explanation: '量固定在报告期。',
      knowledgePointIds: ['kp10-1'],
      chapterId: 'ch10',
      points: 2
    }
    ]
  },
  {
    title: '五、计算与分析题（共45分）',
    instruction: '要求写出必要的计算过程与公式，结果保留两位小数（除非另有说明）。',
    questions: [
    {
      id: 'fc-c1',
      type: 'calc',
      stem: '某产品合格率调查：n=200，合格 170 件，求总体成数 π 的 95% 置信区间（z=1.96）。\n\n（1）计算样本成数 p。（3分）\n（2）计算抽样平均误差 μ_p。（4分）\n（3）构造 95% 置信区间并解释。（8分）',
      answer: 'p=0.85；μ≈0.0252；（0.8006，0.8994）',
      explanation: 'p=170/200；μ=√[p(1−p)/n]；p±z·μ。',
      knowledgePointIds: ['kp7-10', 'kp7-2'],
      chapterId: 'ch7',
      points: 15,
      rubric: '（1）p 3分；（2）μ 4分；（3）区间与解释 8分。'
    },
    {
      id: 'fc-c2',
      type: 'calc',
      stem: '检验 H₀:μ=100，H₁:μ≠100。n=25，x̄=102，s=5，α=0.05，t₀.₀₂₅(24)=2.064。\n\n（1）计算 t 统计量。（5分）\n（2）作出检验结论。（5分）\n（3）说明两类错误含义。（5分）',
      answer: 't=2；不拒绝H₀',
      explanation: 't=(102−100)/(5/5)=2<2.064；|t|<临界值。',
      knowledgePointIds: ['kp7-5', 'kp7-9'],
      chapterId: 'ch7',
      points: 15,
      rubric: '（1）t 5分；（2）结论 5分；（3）α、β 5分。'
    },
    {
      id: 'fc-c3',
      type: 'calc',
      stem: '6 组数据：x=2,4,6,8,10,12；y=3,7,11,15,19,23。\n\n（1）计算 r 并判断方向。（5分）\n（2）求 ŷ=a+bx（用公式或最小二乘）。（6分）\n（3）计算 R² 并解释。（4分）',
      answer: 'r=1；ŷ=1+2x；R²=1',
      explanation: '完全正相关；b=2,a=1；R²=r²=1。',
      knowledgePointIds: ['kp8-2', 'kp8-3', 'kp8-4'],
      chapterId: 'ch8',
      points: 15,
      rubric: '（1）r 5分；（2）方程 6分；（3）R² 4分。'
    }
    ]
  }
    ]
  },
  {
    id: 'final-d',
    title: '统计学原理 · 期末模拟卷 D',
    subtitle: '动态分析强化 · 第九至十章',
    focus: '侧重时间数列分析、季节变动与统计指数体系',
    durationMinutes: 120,
    totalPoints: 100,
    sections: [
  {
    title: '一、单项选择题（每题2分，共20分）',
    instruction: '每题四个选项，只有一个正确答案。请将选项字母填在答题卡上。',
    questions: [
    {
      id: 'fd-s1',
      type: 'single',
      stem: '时间序列数据按时间维度属于（  ）。',
      options: ['截面数据', '面板数据', '时间序列数据', '实验数据'],
      answer: 'C',
      explanation: '按时间排列的观测为时间序列数据。',
      knowledgePointIds: ['kp1-7'],
      chapterId: 'ch1',
      points: 2
    },
    {
      id: 'fd-s2',
      type: 'single',
      stem: '调查期限是指（  ）。',
      options: ['资料所属时间', '搜集工作所需时间', '数据有效期', '报表报送周期'],
      answer: 'B',
      explanation: '期限=工作时间；时间=资料所属。',
      knowledgePointIds: ['kp2-12'],
      chapterId: 'ch2',
      points: 2
    },
    {
      id: 'fd-s3',
      type: 'single',
      stem: '时间数列趋势分析宜选用（  ）。',
      options: ['饼图', '折线图', '直方图', '箱线图'],
      answer: 'B',
      explanation: '折线图突出时间趋势。',
      knowledgePointIds: ['kp3-7'],
      chapterId: 'ch3',
      points: 2
    },
    {
      id: 'fd-s4',
      type: 'single',
      stem: '男女人口之比属于（  ）。',
      options: ['结构相对数', '比例相对数', '比较相对数', '强度相对数'],
      answer: 'B',
      explanation: '部分与部分之比为比例相对数。',
      knowledgePointIds: ['kp4-7'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fd-s5',
      type: 'single',
      stem: '已知各组组中值与频数，求平均数用（  ）。',
      options: ['简单算术平均', '加权算术平均', '中位数公式', '几何平均'],
      answer: 'B',
      explanation: '组距数列用组中值×频数加权。',
      knowledgePointIds: ['kp5-3'],
      chapterId: 'ch5',
      points: 2
    },
    {
      id: 'fd-s6',
      type: 'single',
      stem: '0-1 标志成数 p=0.4 时，σ²=（  ）。',
      options: ['0.4', '0.16', '0.24', '0.6'],
      answer: 'C',
      explanation: 'σ²=p(1−p)=0.4×0.6=0.24。',
      knowledgePointIds: ['kp6-6'],
      chapterId: 'ch6',
      points: 2
    },
    {
      id: 'fd-s7',
      type: 'single',
      stem: '允许误差 Δ 与置信度关系是（  ）。',
      options: ['置信度越高 Δ 越小', '置信度越高 Δ 越大', '无关', 'Δ 固定不变'],
      answer: 'B',
      explanation: '置信度提高需扩大区间，Δ 增大。',
      knowledgePointIds: ['kp7-2'],
      chapterId: 'ch7',
      points: 2
    },
    {
      id: 'fd-s8',
      type: 'single',
      stem: 'CPI>100% 表示（  ）。',
      options: ['物价下跌', '物价不变', '物价上涨', '实际工资上升'],
      answer: 'C',
      explanation: 'CPI 上升表示物价上涨。',
      knowledgePointIds: ['kp10-3'],
      chapterId: 'ch10',
      points: 2
    },
    {
      id: 'fd-s9',
      type: 'single',
      stem: '一元回归中 R²=0.81，则 r=（  ）。',
      options: ['0.81', '±0.9', '0.9', '±0.81'],
      answer: 'B',
      explanation: 'R²=r²，r 可能为正或负，|r|=0.9。',
      knowledgePointIds: ['kp8-4'],
      chapterId: 'ch8',
      points: 2
    },
    {
      id: 'fd-s10',
      type: 'single',
      stem: '数量平均指数（算术）的权数一般为（  ）。',
      options: ['p₁q₁', 'p₀q₀', 'q₁', 'p₁'],
      answer: 'B',
      explanation: '数量指数→算术平均，权 p₀q₀。',
      knowledgePointIds: ['kp10-8'],
      chapterId: 'ch10',
      points: 2
    }
    ]
  },
  {
    title: '二、多项选择题（每题3分，共15分）',
    instruction: '每题五个选项，至少两个正确。多选、少选、错选均不得分。',
    questions: [
    {
      id: 'fd-m1',
      type: 'multi',
      stem: '时间数列编制原则包括（  ）。',
      options: ['口径一致', '范围可比', '时间可比', '随意更换基期不说明', '方法一致'],
      answer: 'ABCE',
      explanation: '可比性是时间数列基本要求。',
      knowledgePointIds: ['kp9-6'],
      chapterId: 'ch9',
      points: 3
    },
    {
      id: 'fd-m2',
      type: 'multi',
      stem: '测定长期趋势的方法有（  ）。',
      options: ['移动平均法', '最小二乘法', '时距扩大法', '同季平均法', '趋势剔除法'],
      answer: 'ABC',
      explanation: '同季平均、趋势剔除用于季节变动。',
      knowledgePointIds: ['kp9-3', 'kp9-11'],
      chapterId: 'ch9',
      points: 3
    },
    {
      id: 'fd-m3',
      type: 'multi',
      stem: '指数体系的作用包括（  ）。',
      options: ['反映复杂现象变动', '进行因素分析', '销售额=量×价', '消除抽样误差', '连接个体与总指数'],
      answer: 'ABCE',
      explanation: '指数体系用于因素分解。',
      knowledgePointIds: ['kp10-4'],
      chapterId: 'ch10',
      points: 3
    },
    {
      id: 'fd-m4',
      type: 'multi',
      stem: '数值平均数包括（  ）。',
      options: ['算术平均数', '调和平均数', '几何平均数', '中位数', '众数'],
      answer: 'ABC',
      explanation: '中位数、众数为位置平均数。',
      knowledgePointIds: ['kp5-1'],
      chapterId: 'ch5',
      points: 3
    },
    {
      id: 'fd-m5',
      type: 'multi',
      stem: '回归方程显著性检验可用（  ）。',
      options: ['F 检验', 't 检验斜率', '相关系数检验', '仅看 R² 大小', '方差分析'],
      answer: 'ABCE',
      explanation: '须做正式检验，不能只看 R²。',
      knowledgePointIds: ['kp8-5'],
      chapterId: 'ch8',
      points: 3
    }
    ]
  },
  {
    title: '三、判断题（每题1分，共10分）',
    instruction: '判断下列各题是否正确，正确的填"对"，错误的填"错"。',
    questions: [
    {
      id: 'fd-j1',
      type: 'judge',
      stem: '时期数列序时平均=各期之和÷期数。',
      options: ['对', '错'],
      answer: '对',
      explanation: '时期数列平均用简单算术平均。',
      knowledgePointIds: ['kp9-5'],
      chapterId: 'ch9',
      points: 1
    },
    {
      id: 'fd-j2',
      type: 'judge',
      stem: '饼图各部分之和应为 100%。',
      options: ['对', '错'],
      answer: '对',
      explanation: '饼图展示构成比。',
      knowledgePointIds: ['kp3-5'],
      chapterId: 'ch3',
      points: 1
    },
    {
      id: 'fd-j3',
      type: 'judge',
      stem: '实际工资=名义工资×CPI。',
      options: ['对', '错'],
      answer: '错',
      explanation: '实际工资=名义工资/CPI（或除以缩减指数）。',
      knowledgePointIds: ['kp10-3'],
      chapterId: 'ch10',
      points: 1
    },
    {
      id: 'fd-j4',
      type: 'judge',
      stem: '强度相对数具有平均性。',
      options: ['对', '错'],
      answer: '对',
      explanation: '如人均指标有平均意义。',
      knowledgePointIds: ['kp4-9'],
      chapterId: 'ch4',
      points: 1
    },
    {
      id: 'fd-j5',
      type: 'judge',
      stem: '左偏分布时 x̄<Me<Mo。',
      options: ['对', '错'],
      answer: '对',
      explanation: '左偏时平均数被小值拉低。',
      knowledgePointIds: ['kp5-9'],
      chapterId: 'ch5',
      points: 1
    },
    {
      id: 'fd-j6',
      type: 'judge',
      stem: '双 10% 增长（产量和价格各增10%）使销售额增 21%。',
      options: ['对', '错'],
      answer: '对',
      explanation: '1.1×1.1=1.21。',
      knowledgePointIds: ['kp10-6'],
      chapterId: 'ch10',
      points: 1
    },
    {
      id: 'fd-j7',
      type: 'judge',
      stem: '样本方差分母用 n−1 比用 n 估计更准确。',
      options: ['对', '错'],
      answer: '对',
      explanation: '贝塞尔校正。',
      knowledgePointIds: ['kp6-4'],
      chapterId: 'ch6',
      points: 1
    },
    {
      id: 'fd-j8',
      type: 'judge',
      stem: '狭义统计指数是不能直接加总对比的复杂现象综合动态相对数。',
      options: ['对', '错'],
      answer: '对',
      explanation: '指数概念定义。',
      knowledgePointIds: ['kp10-11'],
      chapterId: 'ch10',
      points: 1
    },
    {
      id: 'fd-j9',
      type: 'judge',
      stem: '点估计是直接用样本统计量估计参数。',
      options: ['对', '错'],
      answer: '对',
      explanation: '如用 x̄ 估计 μ。',
      knowledgePointIds: ['kp7-4'],
      chapterId: 'ch7',
      points: 1
    },
    {
      id: 'fd-j10',
      type: 'judge',
      stem: '相关分析中 x、y 变量地位平等。',
      options: ['对', '错'],
      answer: '对',
      explanation: '回归中 y 为因变量，相关中地位平等。',
      knowledgePointIds: ['kp8-10'],
      chapterId: 'ch8',
      points: 1
    }
    ]
  },
  {
    title: '四、填空题（每题2分，共10分）',
    instruction: '在横线上填写正确答案，不写过程。',
    questions: [
    {
      id: 'fd-f1',
      type: 'fill',
      stem: '环比发展速度=报告期水平÷______。',
      answer: '上期水平',
      explanation: '环比基本公式。',
      knowledgePointIds: ['kp9-1'],
      chapterId: 'ch9',
      points: 2
    },
    {
      id: 'fd-f2',
      type: 'fill',
      stem: '比较相对数=甲地区数值÷______。',
      answer: '乙地区数值',
      explanation: '不同空间同类现象对比。',
      knowledgePointIds: ['kp4-8'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fd-f3',
      type: 'fill',
      stem: '拉氏数量指数 Lq=Σp₀q₁/______。',
      answer: 'Σp₀q₀',
      explanation: '价固定在基期。',
      knowledgePointIds: ['kp10-1'],
      chapterId: 'ch10',
      points: 2
    },
    {
      id: 'fd-f4',
      type: 'fill',
      stem: '成数区间估计大样本用 p±z·√[p(1−p)/______]。',
      answer: 'n',
      explanation: '成数区间公式。',
      knowledgePointIds: ['kp7-10'],
      chapterId: 'ch7',
      points: 2
    },
    {
      id: 'fd-f5',
      type: 'fill',
      stem: '一元回归中 SST=SSR+______。',
      answer: 'SSE',
      explanation: '方差分解。',
      knowledgePointIds: ['kp8-7'],
      chapterId: 'ch8',
      points: 2
    }
    ]
  },
  {
    title: '五、计算与分析题（共45分）',
    instruction: '要求写出必要的计算过程与公式，结果保留两位小数（除非另有说明）。',
    questions: [
    {
      id: 'fd-c1',
      type: 'calc',
      stem: '某产品 2020-2024 年产量（万吨）：100,110,121,133,146。\n\n（1）各年环比发展速度。（6分）\n（2）以 2020 为基期各年定基发展速度。（5分）\n（3）2020-2024 平均发展速度（几何平均）。（4分）',
      answer: '110%,110%,110%,110%；定基110%,121%,133%,146%；平均110%',
      explanation: '环比=本期/上期；定基=本期/基期；几何平均连乘开方。',
      knowledgePointIds: ['kp9-1', 'kp9-10'],
      chapterId: 'ch9',
      points: 15,
      rubric: '（1）环比6分；（2）定基5分；（3）平均速度4分。'
    },
    {
      id: 'fd-c2',
      type: 'calc',
      stem: '某商品三年分季销售额（万元），同季平均法得未调整季节指数：春98、夏105、秋102、冬95。\n\n（1）计算调整系数 k。（4分）\n（2）调整后各季季节指数。（6分）\n（3）若夏季趋势值 200 万，求夏季实际值估计。（5分）',
      answer: 'k≈1.0101；夏≈106.06；实际≈212.1',
      explanation: 'k=400/400原合计；调整后×k；实际≈趋势×季节指数/100。',
      knowledgePointIds: ['kp9-2', 'kp9-4'],
      chapterId: 'ch9',
      points: 15,
      rubric: '（1）k 4分；（2）调整指数 6分；（3）预测 5分。'
    },
    {
      id: 'fd-c3',
      type: 'calc',
      stem: '两商品：A(p₀=5,p₁=6,q₀=1000,q₁=1200)；B(p₀=10,p₁=9,q₀=500,q₁=600。\n\n（1）Lq 与 Pp。（8分）\n（2）销售额总指数。（4分）\n（3）差额法分解销售额变动。（3分）',
      answer: 'Lq≈109.09%；Pp≈104.35%；销售额≈113.85%',
      explanation: '指数体系完整计算。',
      knowledgePointIds: ['kp10-1', 'kp10-4'],
      chapterId: 'ch10',
      points: 15,
      rubric: '（1）Lq、Pp 各4分；（2）销售额指数 4分；（3）差额分解 3分。'
    }
    ]
  }
    ]
  },
  {
    id: 'final-e',
    title: '统计学原理 · 期末模拟卷 E',
    subtitle: '综合应用 · 案例化测评',
    focus: '跨章节综合案例，模拟真实数据分析与决策场景',
    durationMinutes: 120,
    totalPoints: 100,
    sections: [
  {
    title: '一、单项选择题（每题2分，共20分）',
    instruction: '每题四个选项，只有一个正确答案。请将选项字母填在答题卡上。',
    questions: [
    {
      id: 'fe-s1',
      type: 'single',
      stem: '某市统计局发布公报，应优先区分（  ）。',
      options: ['样本与总体', '时期与时点指标', '定类与定比', '参数与统计量'],
      answer: 'B',
      explanation: '读公报首要区分时期/时点、相对/绝对。',
      knowledgePointIds: ['kp4-12'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fe-s2',
      type: 'single',
      stem: '电商用户满意度（优/良/中/差）属于（  ）。',
      options: ['定类数据', '定序数据', '定距数据', '定比数据'],
      answer: 'B',
      explanation: '有序类别为定序数据。',
      knowledgePointIds: ['kp1-6'],
      chapterId: 'ch1',
      points: 2
    },
    {
      id: 'fe-s3',
      type: 'single',
      stem: '多地区同季度销售额汇总，Excel 宜用（  ）。',
      options: ['数据透视表', '合并计算', '单变量求解', '回归分析'],
      answer: 'B',
      explanation: '同位置多表汇总用合并计算。',
      knowledgePointIds: ['kp3-14'],
      chapterId: 'ch3',
      points: 2
    },
    {
      id: 'fe-s4',
      type: 'single',
      stem: '企业分析"人均利润"时，利润与人数分别属于（  ）。',
      options: ['均为时期指标', '均为时点指标', '利润时期、人数时点', '利润时点、人数时期'],
      answer: 'C',
      explanation: '利润可累加为时期；人数为时点存量。',
      knowledgePointIds: ['kp4-2'],
      chapterId: 'ch4',
      points: 2
    },
    {
      id: 'fe-s5',
      type: 'single',
      stem: '三年投资收益率 8%、10%、12%，求平均收益率用（  ）。',
      options: ['算术平均', '几何平均', '调和平均', '中位数'],
      answer: 'B',
      explanation: '比率连乘用几何平均。',
      knowledgePointIds: ['kp5-6'],
      chapterId: 'ch5',
      points: 2
    },
    {
      id: 'fe-s6',
      type: 'single',
      stem: '质检部门比较两批次产品重量离散程度（均值相近），宜用（  ）。',
      options: ['σ', 'V', '极差', '众数'],
      answer: 'B',
      explanation: '均值相近可直接比σ；不同量纲比V。',
      knowledgePointIds: ['kp6-10'],
      chapterId: 'ch6',
      points: 2
    },
    {
      id: 'fe-s7',
      type: 'single',
      stem: '市场调研 n=100，估计购买意向成数，误差控制在 3% 内，应（  ）。',
      options: ['增大样本', '减小样本', '改用普查', '忽略抽样误差'],
      answer: 'A',
      explanation: 'n 越大抽样误差越小。',
      knowledgePointIds: ['kp7-6'],
      chapterId: 'ch7',
      points: 2
    },
    {
      id: 'fe-s8',
      type: 'single',
      stem: '广告投入与销售额散点图呈线性正相关，下一步应（  ）。',
      options: ['直接因果断言', '建立回归模型预测', '计算几何平均', '编制指数'],
      answer: 'B',
      explanation: '相关显著后可做回归预测。',
      knowledgePointIds: ['kp8-11'],
      chapterId: 'ch8',
      points: 2
    },
    {
      id: 'fe-s9',
      type: 'single',
      stem: '零售企分析月度销售波动，应先（  ）。',
      options: ['计算 CPI', '绘制时序图并分解趋势季节', '做 t 检验', '求调和平均'],
      answer: 'B',
      explanation: '时间数列分析先可视化再分解。',
      knowledgePointIds: ['kp9-6'],
      chapterId: 'ch9',
      points: 2
    },
    {
      id: 'fe-s10',
      type: 'single',
      stem: '用 CPI 调整工资时，实际工资应（  ）。',
      options: ['乘以 CPI', '除以 CPI', '加上 CPI', '减去 CPI'],
      answer: 'B',
      explanation: '实际工资=名义工资/CPI。',
      knowledgePointIds: ['kp10-3'],
      chapterId: 'ch10',
      points: 2
    }
    ]
  },
  {
    title: '二、多项选择题（每题3分，共15分）',
    instruction: '每题五个选项，至少两个正确。多选、少选、错选均不得分。',
    questions: [
    {
      id: 'fe-m1',
      type: 'multi',
      stem: '某项目从调查到发布报告，合理流程包括（  ）。',
      options: ['明确调查目的', '设计调查方案', '整理分组制表', '描述与推断分析', '跳过数据审核'],
      answer: 'ABCD',
      explanation: '完整流程含设计、调查、整理、分析；不可跳过审核。',
      knowledgePointIds: ['kp1-2', 'kp2-2', 'kp3-15'],
      chapterId: 'ch2',
      points: 3
    },
    {
      id: 'fe-m2',
      type: 'multi',
      stem: '分析企业效益，应同时考察（  ）。',
      options: ['总量指标', '结构相对数', '强度相对数', '仅算术平均', '计划完成程度'],
      answer: 'ABCE',
      explanation: '综合看规模、结构、强度、计划完成。',
      knowledgePointIds: ['kp4-1', 'kp4-6', 'kp4-9'],
      chapterId: 'ch4',
      points: 3
    },
    {
      id: 'fe-m3',
      type: 'multi',
      stem: '产品质量控制案例中，有用的统计工具有（  ）。',
      options: ['x̄ 与 σ', '离散系数比较', '3σ 离群判断', '仅众数', 'Z 分数'],
      answer: 'ABCE',
      explanation: '控制图、离群检测用均值、σ、Z。',
      knowledgePointIds: ['kp6-11', 'kp6-7'],
      chapterId: 'ch6',
      points: 3
    },
    {
      id: 'fe-m4',
      type: 'multi',
      stem: '政策评估：抽样估计满意度并检验政策前后差异，涉及（  ）。',
      options: ['区间估计', '假设检验', '随机抽样', '仅描述频数', '成数估计'],
      answer: 'ABCE',
      explanation: '推断统计完整应用。',
      knowledgePointIds: ['kp7-4', 'kp7-5', 'kp7-10'],
      chapterId: 'ch7',
      points: 3
    },
    {
      id: 'fe-m5',
      type: 'multi',
      stem: '物价上涨分析报告中，指数方法可（  ）。',
      options: ['编制 CPI', '因素分解价量影响', '计算拉氏/派氏指数', '替代回归分析所有场景', '缩减名义指标'],
      answer: 'ABCE',
      explanation: '指数与回归解决不同问题。',
      knowledgePointIds: ['kp10-3', 'kp10-4'],
      chapterId: 'ch10',
      points: 3
    }
    ]
  },
  {
    title: '三、判断题（每题1分，共10分）',
    instruction: '判断下列各题是否正确，正确的填"对"，错误的填"错"。',
    questions: [
    {
      id: 'fe-j1',
      type: 'judge',
      stem: '综合案例分析中，描述统计与推断统计可结合使用。',
      options: ['对', '错'],
      answer: '对',
      explanation: '先描述再推断是常见路径。',
      knowledgePointIds: ['kp1-5'],
      chapterId: 'ch1',
      points: 1
    },
    {
      id: 'fe-j2',
      type: 'judge',
      stem: '方便抽样可用于正式推断总体参数。',
      options: ['对', '错'],
      answer: '错',
      explanation: '方便样本非随机，推断需谨慎。',
      knowledgePointIds: ['kp2-10'],
      chapterId: 'ch2',
      points: 1
    },
    {
      id: 'fe-j3',
      type: 'judge',
      stem: '饼图适合展示 20 个以上细分类别构成。',
      options: ['对', '错'],
      answer: '错',
      explanation: '类别过多饼图难辨认。',
      knowledgePointIds: ['kp3-5'],
      chapterId: 'ch3',
      points: 1
    },
    {
      id: 'fe-j4',
      type: 'judge',
      stem: '企业利润增、人员不变，则人均利润强度指标上升。',
      options: ['对', '错'],
      answer: '对',
      explanation: '强度=利润/人数，分子增分母不变则上升。',
      knowledgePointIds: ['kp4-9'],
      chapterId: 'ch4',
      points: 1
    },
    {
      id: 'fe-j5',
      type: 'judge',
      stem: '报告"平均工资"时不需说明离散程度。',
      options: ['对', '错'],
      answer: '错',
      explanation: '应结合 σ 或 V 说明代表性。',
      knowledgePointIds: ['kp6-10'],
      chapterId: 'ch6',
      points: 1
    },
    {
      id: 'fe-j6',
      type: 'judge',
      stem: '回归预测只能由 x 预测 ŷ，不能随意逆推。',
      options: ['对', '错'],
      answer: '对',
      explanation: '回归预测单向性。',
      knowledgePointIds: ['kp8-13'],
      chapterId: 'ch8',
      points: 1
    },
    {
      id: 'fe-j7',
      type: 'judge',
      stem: '季节指数法需要多年分季（月）资料。',
      options: ['对', '错'],
      answer: '对',
      explanation: '同季平均法需多年同期数据。',
      knowledgePointIds: ['kp9-4'],
      chapterId: 'ch9',
      points: 1
    },
    {
      id: 'fe-j8',
      type: 'judge',
      stem: '销量增、销额不变，则价格指数下降。',
      options: ['对', '错'],
      answer: '对',
      explanation: '指数易混经典结论。',
      knowledgePointIds: ['kp10-6'],
      chapterId: 'ch10',
      points: 1
    },
    {
      id: 'fe-j9',
      type: 'judge',
      stem: '数据质量六要求包括精度和准确性。',
      options: ['对', '错'],
      answer: '对',
      explanation: '精度、准确性等六要求。',
      knowledgePointIds: ['kp2-17'],
      chapterId: 'ch2',
      points: 1
    },
    {
      id: 'fe-j10',
      type: 'judge',
      stem: '相关显著即可断定 x 是 y 的原因。',
      options: ['对', '错'],
      answer: '错',
      explanation: '相关≠因果，需结合理论。',
      knowledgePointIds: ['kp8-1'],
      chapterId: 'ch8',
      points: 1
    }
    ]
  },
  {
    title: '四、填空题（每题2分，共10分）',
    instruction: '在横线上填写正确答案，不写过程。',
    questions: [
    {
      id: 'fe-f1',
      type: 'fill',
      stem: '统计工作基本环节：设计→调查→整理→______→应用。',
      answer: '分析',
      explanation: '设调整理析用五环节。',
      knowledgePointIds: ['kp1-2'],
      chapterId: 'ch1',
      points: 2
    },
    {
      id: 'fe-f2',
      type: 'fill',
      stem: '抽样调查要求保证______性和代表性。',
      answer: '随机',
      explanation: '随机抽样是推断基础。',
      knowledgePointIds: ['kp2-5'],
      chapterId: 'ch2',
      points: 2
    },
    {
      id: 'fe-f3',
      type: 'fill',
      stem: '组中值=(组下限+______)/2。',
      answer: '组上限',
      explanation: '组距数列代表值。',
      knowledgePointIds: ['kp2-8'],
      chapterId: 'ch3',
      points: 2
    },
    {
      id: 'fe-f4',
      type: 'fill',
      stem: '估计标准误 Sy=√(SSE/______)。',
      answer: 'n−2',
      explanation: '一元回归 Sy 公式。',
      knowledgePointIds: ['kp8-4'],
      chapterId: 'ch8',
      points: 2
    },
    {
      id: 'fe-f5',
      type: 'fill',
      stem: '个体销售量指数 Iq=______。',
      answer: 'q₁/q₀',
      explanation: '个体指数基本式。',
      knowledgePointIds: ['kp10-7'],
      chapterId: 'ch10',
      points: 2
    }
    ]
  },
  {
    title: '五、计算与分析题（共45分）',
    instruction: '要求写出必要的计算过程与公式，结果保留两位小数（除非另有说明）。',
    questions: [
    {
      id: 'fe-c1',
      type: 'calc',
      stem: '【案例：某连锁超市员工调查】120 名员工日销售额（千元）分组：0-505人、50-10035人、100-15045人、150-20025人、200以上10人。\n\n（1）加权平均日销售额。（6分）\n（2）150 千元以上员工比重。（3分）\n（3）计算 s 与 V，评价 x̄ 代表性。（6分）',
      answer: 'x̄≈112.5；35%；s≈45.2；V≈40%',
      explanation: '组中值法完整描述统计案例。',
      knowledgePointIds: ['kp5-3', 'kp6-5', 'kp6-7'],
      chapterId: 'ch5',
      points: 15,
      rubric: '（1）加权平均6分；（2）结构3分；（3）s、V与评价6分。'
    },
    {
      id: 'fe-c2',
      type: 'calc',
      stem: '【案例：广告效果评估】10 店广告费 x（万）与月销售额 y（万）：x=1,2,3,4,5；y=2.1,2.9,3.8,5.2,6.1。\n\n（1）建立 ŷ=a+bx。（7分）\n（2）当 x=6 时预测 ŷ。（3分）\n（3）说明 R² 业务含义。（5分）',
      answer: 'ŷ≈0.95+1.03x；ŷ(6)≈7.13；R²≈0.97',
      explanation: '回归预测综合案例。',
      knowledgePointIds: ['kp8-3', 'kp8-4'],
      chapterId: 'ch8',
      points: 15,
      rubric: '（1）方程7分；（2）预测3分；（3）R²解释5分。'
    },
    {
      id: 'fe-c3',
      type: 'calc',
      stem: '【案例：企业年度经营分析】2023 销售额 1200 万，2024 为 1380 万；经指数分析：销售量指数 108%，价格指数 106.25%。\n\n（1）验证销售额指数。（4分）\n（2）差额法分解销售额增加额。（6分）\n（3）若 CPI=106%，求 2024 实际销售额（2023价）。（5分）',
      answer: '1380/1200=115%=108%×106.25%；量贡献96万、价贡献84万；≈1301.9万',
      explanation: '跨时间数列与指数综合案例。',
      knowledgePointIds: ['kp9-5', 'kp10-4', 'kp10-3'],
      chapterId: 'ch10',
      points: 15,
      rubric: '（1）验证4分；（2）差额分解6分；（3）缩减5分。'
    }
    ]
  }
    ]
  }
]
