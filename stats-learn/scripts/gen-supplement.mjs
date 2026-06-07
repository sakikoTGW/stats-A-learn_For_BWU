/**
 * 为「零题/单题」知识点生成补全题库 → src/data/supplementQuestions.ts
 * 运行：node scripts/gen-supplement.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const chaptersSrc = readFileSync(join(root, 'src/data/chapters.ts'), 'utf8')
const supPath = join(root, 'src/data/supplementQuestions.ts')
const questionsSrc =
  readFileSync(join(root, 'src/data/questions.ts'), 'utf8') +
  readFileSync(join(root, 'src/data/homeworkQuestions.ts'), 'utf8') +
  (existsSync(supPath) ? readFileSync(supPath, 'utf8') : '')

const kps = [...chaptersSrc.matchAll(/id: '(kp[^']+)'/g)].map((m) => m[1])
const kpMeta = {}
for (const m of chaptersSrc.matchAll(
  /id: '(kp[^']+)',\s*chapterId: '(ch\d+)',\s*title: '([^']+)'/g
)) {
  kpMeta[m[1]] = { chapterId: m[2], title: m[3] }
}

const kpQ = Object.fromEntries(kps.map((id) => [id, 0]))
for (const m of questionsSrc.matchAll(/knowledgePointIds: \[([^\]]+)\]/g)) {
  for (const id of m[1].match(/kp[\w-]+/g) || []) {
    if (kpQ[id] !== undefined) kpQ[id]++
  }
}

/** @type {Record<string, Array<{difficulty:'easy'|'medium'|'hard', stem:string, options:string[], correctIndex:number, explanation:string}>>} */
const BANK = {
  'kp1-11': [
    {
      difficulty: 'easy',
      stem: '对总体数量特征的认识路径一般是（  ）。',
      options: ['从个体到总体', '从总体到个体', '只看样本', '只看图表'],
      correctIndex: 0,
      explanation: '笔记：认识路径为个体→总体（C）。',
    },
    {
      difficulty: 'medium',
      stem: '下列属于统计软件的是（  ）。',
      options: ['SPSS', 'Word', 'Photoshop', '浏览器'],
      correctIndex: 0,
      explanation: '笔记：SAS、SPSS、Stata 等；Excel 用函数与数据分析工具。',
    },
  ],
  'kp1-12': [
    {
      difficulty: 'easy',
      stem: '「职工人数」属于（  ）。',
      options: ['离散变量', '连续变量', '品质标志', '指标'],
      correctIndex: 0,
      explanation: '人数、台数为离散；产量、面积多为连续。',
    },
    {
      difficulty: 'hard',
      stem: '成数 p=0.5 时，0-1 标志方差 σ² 最大为（  ）。',
      options: ['0.25', '0.5', '1', '0'],
      correctIndex: 0,
      explanation: 'σ²=p(1−p)，p=0.5 时最大 0.25。',
    },
  ],
  'kp2-11': [
    {
      difficulty: 'easy',
      stem: '从统计局网站下载的年度数据属于（  ）。',
      options: ['次级资料', '原始资料', '实验数据', '普查原始表'],
      correctIndex: 0,
      explanation: '他人加工发布为次级；问卷首次取得为原始。',
    },
    {
      difficulty: 'medium',
      stem: '整理阶段可能同时用到（  ）。',
      options: ['原始资料与次级资料', '只能原始', '只能次级', '不需要资料'],
      correctIndex: 0,
      explanation: '整理可用原+次两类资料汇总对比。',
    },
  ],
  'kp2-12': [
    {
      difficulty: 'medium',
      stem: '「7月1日—10日完成人口普查登记」中的 7月1—10日 是（  ）。',
      options: ['调查期限', '调查时间', '标准时点', '报告期'],
      correctIndex: 0,
      explanation: '期限=工作用时；时间=资料所属时期或时点。',
    },
    {
      difficulty: 'easy',
      stem: '人口普查的「标准时点」属于（  ）。',
      options: ['调查时间', '调查期限', '抽样误差', '登记误差'],
      correctIndex: 0,
      explanation: '标准时点指资料所属时刻，不是干活多久。',
    },
  ],
  'kp2-13': [
    {
      difficulty: 'medium',
      stem: '调查每台机床，由所属企业填报，则调查单位是（  ）。',
      options: ['机床', '企业', '职工', '产品'],
      correctIndex: 0,
      explanation: '调查单位=承担调查内容的单位；报告单位=填报单位（企业）。',
    },
    {
      difficulty: 'easy',
      stem: '调查单位与报告单位（  ）。',
      options: ['可以不同', '必须相同', '没有关系', '都是个体'],
      correctIndex: 0,
      explanation: '工业普查对企业调查时二者可相同；机床调查则不同。',
    },
  ],
  'kp2-14': [
    {
      difficulty: 'easy',
      stem: '数据审核主要检查（  ）。',
      options: ['完整性、准确性、及时性', '只检查颜色', '只检查图表', '只检查回归'],
      correctIndex: 0,
      explanation: '审核三性；还可筛选排序，关注效度与信度。',
    },
    {
      difficulty: 'medium',
      stem: '「效度」是指（  ）。',
      options: ['是否测到了该测的内容', '是否便宜', '样本量大小', '图表美观'],
      correctIndex: 0,
      explanation: '效度=测准；信度=测稳、可靠。',
    },
  ],
  'kp3-9': [
    {
      difficulty: 'medium',
      stem: '研究两变量相关关系宜用（  ）。',
      options: ['散点图', '饼图', '结构相对数', '普查'],
      correctIndex: 0,
      explanation: '散点看相关；茎叶保留原值；箱线看四分位与离群。',
    },
    {
      difficulty: 'easy',
      stem: '箱线图主要展示（  ）。',
      options: ['四分位数与离群点', '构成比例', '时间趋势', '计划完成程度'],
      correctIndex: 0,
      explanation: '箱线=中位数、四分位、离群；直方图看分组频数分布。',
    },
  ],
  'kp3-10': [
    {
      difficulty: 'easy',
      stem: '统计整理的含义是（  ）。',
      options: ['审核、分组、汇总', '只做回归', '只做抽样', '只画图'],
      correctIndex: 0,
      explanation: '整理连接调查与分析，使数据条理化。',
    },
    {
      difficulty: 'medium',
      stem: '统计整理的作用是（  ）。',
      options: ['反映总体特征、组内同质组间差异', '消除抽样误差', '代替推断', '只算平均'],
      correctIndex: 0,
      explanation: '整理揭示结构，为分析打基础。',
    },
  ],
  'kp4-11': [
    {
      difficulty: 'medium',
      stem: '利润为去年的 125%，这是（  ）。',
      options: ['动态相对数（发展速度）', '结构相对数', '强度相对数', '计划完成程度'],
      correctIndex: 0,
      explanation: '报告期/基期=发展速度；增长速度=发展速度−1。',
    },
    {
      difficulty: 'hard',
      stem: '下列关于发展速度的说法正确的是（  ）。',
      options: ['定基发展速度等于各期环比发展速度连乘', '定基增长速度等于环比增长速度连乘', '平均发展速度用算术平均', '发展速度可小于0'],
      correctIndex: 0,
      explanation: '笔记易错：定基速度=环比连乘；定基增长速度≠环比增长速度连乘。',
    },
  ],
  'kp5-11': [
    {
      difficulty: 'medium',
      stem: '四分位差 QD 等于（  ）。',
      options: ['Q3−Q1', 'Q2−Q1', '最大值−最小值', '标准差'],
      correctIndex: 0,
      explanation: 'QD反映中间50%离散；Excel 用 QUARTILE。',
    },
    {
      difficulty: 'easy',
      stem: '四分位数属于（  ）。',
      options: ['位置平均数', '数值平均数', '相对指标', '总量指标'],
      correctIndex: 0,
      explanation: 'Q1、Q3 与 Me、Mo 同为位置平均。',
    },
  ],
  'kp5-10': [
    {
      difficulty: 'easy',
      stem: '组距数列求算术平均数在 Excel 中应（  ）。',
      options: ['用组中值×频数手算或 SUMPRODUCT', '直接 AVERAGE 原始组限', '用 MODE', '用 CPI'],
      correctIndex: 0,
      explanation: '组距资料需组中值；原始数据可直接 AVERAGE。',
    },
  ],
  'kp6-11': [
    {
      difficulty: 'medium',
      stem: '标准分数 z=(x−x̄)/σ 的含义是（  ）。',
      options: ['距均值多少个标准差', '距均值多少个极差', '成数', '环比速度'],
      correctIndex: 0,
      explanation: 'z 标准化；x̄±3σ 几乎含全部数据，超出为离群。',
    },
    {
      difficulty: 'hard',
      stem: '根据 3σ 原则，数据落在 x̄±3σ 之外通常视为（  ）。',
      options: ['离群点', '众数', '中位数', '必错数据'],
      correctIndex: 0,
      explanation: '3σ 原则用于识别异常值。',
    },
  ],
  'kp6-12': [
    {
      difficulty: 'hard',
      stem: '总方差 1000、组内方差平均 600，则组间方差为（  ）。',
      options: ['400', '600', '1000', '1600'],
      correctIndex: 0,
      explanation: '笔记：总=组间+组内，1000−600=400。',
    },
    {
      difficulty: 'medium',
      stem: '方差分解用于（  ）。',
      options: ['分析差异来自组间还是组内', '算计划完成程度', '编指数', '画饼图'],
      correctIndex: 0,
      explanation: '组间反映分类间差异，组内反映类内散布。',
    },
  ],
  'kp6-5': [
    {
      difficulty: 'medium',
      stem: '组距数列标准差计算通常用（  ）。',
      options: ['组中值与频数加权', '只算极差', '几何平均', '调和平均'],
      correctIndex: 0,
      explanation: '步骤：加权平均→离差→平方加权→开方。',
    },
  ],
  'kp6-9': [
    {
      difficulty: 'easy',
      stem: 'Excel 中计算峰度可用（  ）。',
      options: ['KURT', 'CORREL', 'INDEX', 'VLOOKUP'],
      correctIndex: 0,
      explanation: '峰度描述尖峭/扁平；偏态另算偏度系数。',
    },
  ],
  'kp7-1': [
    {
      difficulty: 'easy',
      stem: '抽样推断的主要目的是（  ）。',
      options: ['由样本推断总体未知参数', '绘制饼图', '编制统计表', '只做描述'],
      correctIndex: 0,
      explanation: '推断统计核心：用样本统计量估计总体参数。',
    },
    {
      difficulty: 'medium',
      stem: '下列属于总体参数的是（  ）。',
      options: ['总体均值 μ', '样本均值 x̄', '样本标准差 s', '样本成数 p'],
      correctIndex: 0,
      explanation: 'μ、π 等为参数（未知）；x̄、p 为统计量。',
    },
  ],
  'kp7-2': [
    {
      difficulty: 'medium',
      stem: '允许误差 Δ 与置信度的关系是（  ）。',
      options: ['置信度越高，Δ 一般越大', '置信度越高，Δ 越小', '无关', 'Δ 恒为 0'],
      correctIndex: 0,
      explanation: 'Δ=z·μ；95% 比 90% 要求更宽区间。',
    },
    {
      difficulty: 'easy',
      stem: '抽样平均误差 μ 反映（  ）。',
      options: ['样本统计量围绕总体的平均偏离', '登记错误大小', '图表误差', '指数误差'],
      correctIndex: 0,
      explanation: 'μ 衡量抽样波动；Δ 是估计允许范围。',
    },
  ],
  'kp7-3': [
    {
      difficulty: 'medium',
      stem: '大样本下样本均值近似服从（  ）。',
      options: ['正态分布', '均匀分布', '指数分布', '无法分布'],
      correctIndex: 0,
      explanation: '中心极限定理；小样本均值检验常用 t 分布。',
    },
    {
      difficulty: 'hard',
      stem: '总体 σ 未知、样本较小时，均值检验用（  ）。',
      options: ['t 分布', '只可用 Z', '几何分布', '指数分布'],
      correctIndex: 0,
      explanation: 't=(x̄−μ0)/(s/√n)～t(n−1)。',
    },
  ],
  'kp7-4': [
    {
      difficulty: 'easy',
      stem: '用样本均值直接估计总体均值属于（  ）。',
      options: ['点估计', '区间估计', '假设检验', '描述统计'],
      correctIndex: 0,
      explanation: '点估计给一个数；区间估计给范围如 x̄±Δ。',
    },
    {
      difficulty: 'medium',
      stem: '95% 置信区间的含义是（  ）。',
      options: ['重复抽样时约 95% 的区间含真值', '真值 95% 在区间内', '样本错 5%', 'α=0.95'],
      correctIndex: 0,
      explanation: '置信水平指方法可靠程度，不是单次必含。',
    },
  ],
  'kp7-5': [
    {
      difficulty: 'medium',
      stem: 'σ 未知时检验总体均值，统计量为（  ）。',
      options: ['t=(x̄−μ0)/(s/√n)', 'Z=(x̄−μ0)/σ', 'r', 'F=MSR/MSE'],
      correctIndex: 0,
      explanation: 'σ 未知用 t；σ 已知或大样本成数可用 Z。',
    },
    {
      difficulty: 'hard',
      stem: 'p<α 时应（  ）。',
      options: ['拒绝原假设 H0', '接受 H0', '停止调查', '换图表'],
      correctIndex: 0,
      explanation: '假设检验五步；与区间估计对偶。',
    },
  ],
  'kp7-6': [
    {
      difficulty: 'medium',
      stem: '在给定允许误差 Δ 下反推样本量 n，一般 n 越大（  ）。',
      options: ['抽样误差越小', '误差越大', '与误差无关', '一定等于 30'],
      correctIndex: 0,
      explanation: 'n 增大→μ 减小；但成本上升需权衡。',
    },
    {
      difficulty: 'easy',
      stem: '确定样本容量属于调查方案中的（  ）。',
      options: ['设计阶段考虑', '只属整理', '只属制图', '只属指数'],
      correctIndex: 0,
      explanation: '方案含目的、对象、方法、n 与质量控制。',
    },
  ],
  'kp8-1': [
    {
      difficulty: 'easy',
      stem: '函数关系与相关关系的区别是（  ）。',
      options: ['函数 y 由 x 唯一确定', '相关 y 由 x 唯一确定', '二者相同', '相关无数量联系'],
      correctIndex: 0,
      explanation: '相关：有联系但 y 有随机波动；负相关 x 增 y 减。',
    },
    {
      difficulty: 'medium',
      stem: '相关分析主要回答（  ）。',
      options: ['有无相关、方向与强弱', 'x 对 y 边际影响大小', 'CPI 变动', '时期时点'],
      correctIndex: 0,
      explanation: '回归回答影响与预测；相关看 r 与检验 ρ。',
    },
  ],
  'kp8-2': [
    {
      difficulty: 'medium',
      stem: '检验 H0:ρ=0 时，一元相关用（  ）。',
      options: ['t=r√(n−2)/√(1−r²)', 'F=MSR/MSE', '调和平均', '拉氏指数'],
      correctIndex: 0,
      explanation: '不能只看 |r| 大小，须做 t 检验。',
    },
    {
      difficulty: 'hard',
      stem: 'r=0 表示（  ）。',
      options: ['无线性相关', '无任何关系', '完全相关', 'R²=1'],
      correctIndex: 0,
      explanation: 'r=0 只否定线性；可有曲线相关。',
    },
  ],
  'kp8-3': [
    {
      difficulty: 'easy',
      stem: '一元线性回归方程一般写为（  ）。',
      options: ['ŷ=a+bx', 'y=ax²', 'x̄=Σx/n', 'Lq=Σp0q1/Σp0q0'],
      correctIndex: 0,
      explanation: 'b 为斜率；最小二乘使残差平方和最小。',
    },
    {
      difficulty: 'medium',
      stem: '回归系数 b 的经济含义是（  ）。',
      options: ['x 增 1 单位 y 平均变动 b', 'x 的总和', 'y 的截距', '相关系数'],
      correctIndex: 0,
      explanation: 'a 为截距；b 为边际影响。',
    },
  ],
  'kp8-4': [
    {
      difficulty: 'medium',
      stem: '一元回归中 R² 与 r 的关系是（  ）。',
      options: ['R²=r²', 'R²=r', 'R²=1/r', '无关'],
      correctIndex: 0,
      explanation: 'R²=SSR/SST；Se 越小拟合越好。',
    },
    {
      difficulty: 'easy',
      stem: '估计标准误 Se 越小说明（  ）。',
      options: ['预测误差越小、拟合越好', '相关为 0', '必过原点', 'F 一定为 0'],
      correctIndex: 0,
      explanation: 'Se=√(SSE/(n−2))。',
    },
  ],
  'kp8-5': [
    {
      difficulty: 'hard',
      stem: '一元线性回归中 F 检验与 t 检验斜率的关系是（  ）。',
      options: ['F=t²', 'F=t', 'F=1/t', '无关'],
      correctIndex: 0,
      explanation: 'F=MSR/MSE；多元整体用 F，单个 βj 用 t。',
    },
    {
      difficulty: 'medium',
      stem: '多元回归 F 检验显著说明（  ）。',
      options: ['至少一个自变量对 y 有显著影响', '每个系数都显著', 'r=0', '无需检验'],
      correctIndex: 0,
      explanation: '整体 F 显著≠每个 t 都显著。',
    },
  ],
  'kp8-7': [
    {
      difficulty: 'medium',
      stem: '回归平方和分解正确的是（  ）。',
      options: ['SST=SSR+SSE', 'SST=SSR−SSE', 'SSE=SSR', 'SST=0'],
      correctIndex: 0,
      explanation: 'SSR 自由度 p；一元 SSE 自由度 n−2。',
    },
    {
      difficulty: 'hard',
      stem: '一元回归 SSE 的自由度是（  ）。',
      options: ['n−2', 'n−1', 'n', 'p'],
      correctIndex: 0,
      explanation: '多元 SSE 自由度 n−p−1。',
    },
  ],
  'kp8-6': [
    {
      difficulty: 'medium',
      stem: '完全线性相关时（  ）。',
      options: ['r=±1，R²=1，Se=0', 'r=0', 'F=0', 'b=0'],
      correctIndex: 0,
      explanation: 'Excel：CORREL、LINEST、数据分析→回归。',
    },
    {
      difficulty: 'easy',
      stem: 'Excel 求相关系数用（  ）。',
      options: ['CORREL', 'SUM', 'COUNTIF', 'PIVOT'],
      correctIndex: 0,
      explanation: 'LINEST 可同时出回归系数。',
    },
  ],
  'kp9-1': [
    {
      difficulty: 'medium',
      stem: '各期环比发展速度连乘等于（  ）。',
      options: ['相应定基发展速度', '定基增长速度', '序时平均', '季节指数'],
      correctIndex: 0,
      explanation: '平均发展速度用几何平均；增长速度≠速度连乘。',
    },
  ],
  'kp9-2': [
    {
      difficulty: 'hard',
      stem: '四季季节指数未调整之和为 402%， 则调整系数 k≈（  ）。',
      options: ['400/402', '402/400', '402×400', '1.02'],
      correctIndex: 0,
      explanation: 'k=目标合计/实际合计，各季指数×k 使和=400%。',
    },
  ],
  'kp9-3': [
    {
      difficulty: 'medium',
      stem: '三项移动平均后，时间数列首尾各少（  ）项。',
      options: ['1 项', '2 项', '3 项', '0 项'],
      correctIndex: 0,
      explanation: 'n 项移动平均少 (n−1)/2 项；配合最小二乘求趋势。',
    },
    {
      difficulty: 'hard',
      stem: '直线趋势 ŷ=a+bt 中，b 表示（  ）。',
      options: ['每年平均增减量', '基期水平', '环比速度', '季节指数'],
      correctIndex: 0,
      explanation: 'b 为斜率；a 为截距（起点水平）。',
    },
  ],
  'kp9-4': [
    {
      difficulty: 'medium',
      stem: '趋势剔除法测定季节变动，用（  ）。',
      options: ['实际值÷趋势值', '趋势值÷实际值', '环比连乘', '拉氏公式'],
      correctIndex: 0,
      explanation: '需多年分月资料；季节指数和可调整为 400%。',
    },
    {
      difficulty: 'easy',
      stem: '季节变动测定需要资料（  ）。',
      options: ['多年同月（季）数据', '一天数据', '横截面', '普查表'],
      correctIndex: 0,
      explanation: 'ACD 条件：多年、分月、先剔除趋势。',
    },
  ],
  'kp9-5': [
    {
      difficulty: 'medium',
      stem: '时期数列序时平均数公式为（  ）。',
      options: ['各期之和÷期数', '首尾平均', '几何平均', '极差'],
      correctIndex: 0,
      explanation: '时点数列用首尾平均等；增长量=报告−基期。',
    },
    {
      difficulty: 'hard',
      stem: '增长速度=（  ）。',
      options: ['发展速度−1', '发展速度+1', '环比连乘', '定基连乘'],
      correctIndex: 0,
      explanation: '也可用增长量/基期。',
    },
  ],
  'kp10-1': [
    {
      difficulty: 'medium',
      stem: '数量综合指数拉氏公式中，价格固定在（  ）。',
      options: ['基期', '报告期', '任意期', '不需要价格'],
      correctIndex: 0,
      explanation: 'Lq=Σp0q1/Σp0q0；价格指数派氏量固定在报告期。',
    },
  ],
  'kp10-3': [
    {
      difficulty: 'medium',
      stem: '实际工资=名义工资÷（  ）。',
      options: ['CPI（或相应物价指数）', '环比速度', '极差', '标准差'],
      correctIndex: 0,
      explanation: '指数调整剔除价格；不变价 GDP=现价÷缩减指数。',
    },
  ],
  'kp10-4': [
    {
      difficulty: 'medium',
      stem: '销售额指数=销售量指数×（  ）。',
      options: ['价格指数', '结构相对数', '离散系数', '峰度'],
      correctIndex: 0,
      explanation: '指数体系；因素分析用差额法分解销售额变动。',
    },
    {
      difficulty: 'hard',
      stem: '同度量因素在指数中（  ）。',
      options: ['起权数与同度量双重作用', '只起装饰', '只用于图表', '等于环比'],
      correctIndex: 0,
      explanation: '笔记 BE：使不同度量相加；权数固定不同时期。',
    },
  ],
  'kp10-5': [
    {
      difficulty: 'easy',
      stem: '指数优良性检验包括（  ）。',
      options: ['时间颠倒、因子颠倒、循环测试', '只算极差', '只画饼图', '只算众数'],
      correctIndex: 0,
      explanation: 'ABE 检验；与拉氏/派氏选择相关。',
    },
    {
      difficulty: 'medium',
      stem: '「时间颠倒测试」检验的是（  ）。',
      options: ['指数公式是否合理', '样本量', '相关系数', '移动平均项数'],
      correctIndex: 0,
      explanation: '优良性三测试：时间、因子、循环。',
    },
  ],
  'kp10-6': [
    {
      difficulty: 'hard',
      stem: '销量增 10%、销额增 10%，则价格指数（  ）。',
      options: ['不变', '增 10%', '降 10%', '增 21%'],
      correctIndex: 0,
      explanation: '笔记：量额同增同比例→价指不变；双 10%→销额增 21%。',
    },
    {
      difficulty: 'medium',
      stem: 'CPI 为 105% 表示（  ）。',
      options: ['物价上涨 5%', '销量增 5%', '工资降 5%', 'GDP 增 5%'],
      correctIndex: 0,
      explanation: 'CPI>100% 名义购买力下降（若名义收入不变）。',
    },
  ],
  'kp1-13': [
    {
      difficulty: 'easy',
      stem: '从总体中抽取、用以代表总体的部分单位集合称为（  ）。',
      options: ['样本', '指标', '标志值', '普查'],
      correctIndex: 0,
      explanation: '笔记 §五：样本从总体抽取；推断统计用样本推总体。',
    },
    {
      difficulty: 'medium',
      stem: '研究 10 名职工工资时，「10 名职工」是（  ）。',
      options: ['样本', '总体', '总体单位', '指标'],
      correctIndex: 0,
      explanation: '若总体是全部职工，则 10 人为样本；题目常考总体≠样本。',
    },
  ],
  'kp2-15': [
    {
      difficulty: 'easy',
      stem: '下列属于搜集资料方法的是（  ）。',
      options: ['观察法', '编制指数', '求标准差', '画箱线图'],
      correctIndex: 0,
      explanation: '还有访问、实验、问卷等，须匹配调查目的。',
    },
    {
      difficulty: 'easy',
      stem: '搜集资料的方法应（  ）。',
      options: ['与调查目的匹配', '一律用普查', '不用问卷', '只做推断'],
      correctIndex: 0,
      explanation: '了解级考点。',
    },
  ],
  'kp3-11': [
    {
      difficulty: 'medium',
      stem: '组距数列组数常用 Sturges 公式，即 k≈（  ）。',
      options: ['1+3.322lg n', 'n/2', '√n', 'lg n'],
      correctIndex: 0,
      explanation: '笔记 §六、上机：Sturges + FREQUENCY/直方图。',
    },
    {
      difficulty: 'medium',
      stem: '地区×季度×商品销售额汇总宜用 Excel（  ）。',
      options: ['三维透视表', '只画饼图', '调和平均', 't 检验'],
      correctIndex: 0,
      explanation: '二季度三月汇总→合并计算；多维交叉→透视。',
    },
  ],
  'kp4-12': [
    {
      difficulty: 'medium',
      stem: '读统计公报时，职工年末人数属于（  ）。',
      options: ['时点指标', '时期指标', '个体指数', '季节指数'],
      correctIndex: 0,
      explanation: '公报题要分清时期/时点、相对+绝对。',
    },
    {
      difficulty: 'easy',
      stem: '分析统计公报应（  ）。',
      options: ['相对数与绝对数结合', '只看图不看数', '忽略口径', '只算众数'],
      correctIndex: 0,
      explanation: 'kp4-12：可比性、口径一致。',
    },
  ],
  'kp6-13': [
    {
      difficulty: 'medium',
      stem: '平均差系数 V_AD 的计算公式是（  ）。',
      options: ['AD/x̄', 'σ/x̄', 'AD×x̄', 'R/x̄'],
      correctIndex: 0,
      explanation: '笔记 §四：V_AD=AD/x̄；离散系数 V=σ/x̄。',
    },
    {
      difficulty: 'hard',
      stem: '反映离散程度的相对指标包括（  ）。',
      options: ['平均差系数与离散系数', '极差本身', '平均差本身', '众数'],
      correctIndex: 0,
      explanation: '课后：平均差系数 A、标准差系数 B。',
    },
  ],
  'kp7-7': [
    {
      difficulty: 'easy',
      stem: '放回抽样称为（  ）。',
      options: ['重置抽样', '不重置抽样', '普查', '典型调查'],
      correctIndex: 0,
      explanation: '重置各次独立；不重置需有限总体修正。',
    },
    {
      difficulty: 'medium',
      stem: '不重置抽样下，当 n/N<5% 时，μ 可近似为（  ）。',
      options: ['σ/√n', 'σ×n', 'π(1−π)', '0'],
      correctIndex: 0,
      explanation: '笔记：小比例时可忽略修正系数。',
    },
  ],
  'kp7-8': [
    {
      difficulty: 'medium',
      stem: '估计量期望等于总体参数，称为（  ）。',
      options: ['无偏性', '有效性', '一致性', '显著性'],
      correctIndex: 0,
      explanation: '优良性：无偏、有效（方差小）、一致（大样本收敛）。',
    },
    {
      difficulty: 'easy',
      stem: '点估计优良性不包括（  ）。',
      options: ['峰度', '无偏', '有效', '一致'],
      correctIndex: 0,
      explanation: '了解级简答题考点。',
    },
  ],
  'kp7-9': [
    {
      difficulty: 'medium',
      stem: '原假设成立却被拒绝，称为（  ）。',
      options: ['第一类错误（弃真）', '第二类错误', '登记误差', '抽样误差'],
      correctIndex: 0,
      explanation: 'α 控制弃真；β 为取伪（该拒绝没拒绝）。',
    },
    {
      difficulty: 'medium',
      stem: '显著性水平 α 控制的是（  ）。',
      options: ['第一类错误概率', '第二类错误一定为 0', '样本量', '相关系数'],
      correctIndex: 0,
      explanation: 'p<α 拒绝 H0，与区间估计对偶。',
    },
  ],
  'kp8-8': [
    {
      difficulty: 'easy',
      stem: '三个及以上变量之间的相关称为（  ）。',
      options: ['复相关', '函数关系', '不相关', '普查'],
      correctIndex: 0,
      explanation: '还有单相关；按线/非线、正/负、完全/不完全分类。',
    },
    {
      difficulty: 'medium',
      stem: '函数关系是（  ）的特例。',
      options: ['完全相关', '不相关', '负相关', '非线性相关'],
      correctIndex: 0,
      explanation: 'y=f(x) 确定；相关关系 y 有随机波动。',
    },
  ],
  'kp8-9': [
    {
      difficulty: 'easy',
      stem: '一元非线性回归一般先（  ）。',
      options: ['画散点图判断形态', '直接算 r', '用普查', '求计划完成程度'],
      correctIndex: 0,
      explanation: '了解：抛物线、指数等模型；大纲以线性为主。',
    },
    {
      difficulty: 'easy',
      stem: '曲线相关拟合常用（  ）。',
      options: ['抛物线或指数模型', '只算算术平均', '只画饼图', 'CPI'],
      correctIndex: 0,
      explanation: '了解级。',
    },
  ],
  'kp9-6': [
    {
      difficulty: 'easy',
      stem: '时间数列的两要素是（  ）。',
      options: ['时间和指标数值', '样本和总体', '拉氏和派氏', 'α 和 β'],
      correctIndex: 0,
      explanation: '编制要可比；种类含绝对、相对、平均、速度数列。',
    },
    {
      difficulty: 'medium',
      stem: '编制时间数列应保证（  ）。',
      options: ['口径一致、范围可比', '只用环比', '忽略时间', '只算众数'],
      correctIndex: 0,
      explanation: '笔记 §一 ABCDE。',
    },
  ],
  'kp9-7': [
    {
      difficulty: 'hard',
      stem: '增长 1% 的绝对值等于（  ）。',
      options: ['前期水平/100', '环比发展速度', '定基增长速度', '季节指数'],
      correctIndex: 0,
      explanation: '=逐期增长量/(环比增长速度×100)。',
    },
    {
      difficulty: 'medium',
      stem: '增长 1% 绝对值用于说明（  ）。',
      options: ['每增 1% 对应的绝对量', '平均发展速度', 'CPI', '相关系数'],
      correctIndex: 0,
      explanation: '连接速度与绝对规模。',
    },
  ],
  'kp9-8': [
    {
      difficulty: 'easy',
      stem: '时间数列四要素不包括（  ）。',
      options: ['抽样误差', '长期趋势', '季节变动', '循环变动'],
      correctIndex: 0,
      explanation: 'Y=T×S×C×I；C、I 多为了解。',
    },
    {
      difficulty: 'medium',
      stem: '测定季节变动前常先（  ）。',
      options: ['估计并剔除长期趋势', '只求极差', '只做普查', '换基期编接'],
      correctIndex: 0,
      explanation: '实际÷趋势；与 kp9-4 衔接。',
    },
  ],
  'kp9-9': [
    {
      difficulty: 'hard',
      stem: '12 项移动平均后，修匀数列首尾各少（  ）项。',
      options: ['6 项', '1 项', '12 项', '0 项'],
      correctIndex: 0,
      explanation: '偶数项需二次平均；奇数 n 项少 (n−1)/2 项。',
    },
    {
      difficulty: 'medium',
      stem: '偶数项移动平均的特点是（  ）。',
      options: ['需先 n/2 再 2 项居中平均', '与三项平均完全相同', '只用于指数', '只算几何平均'],
      correctIndex: 0,
      explanation: '笔记：12 项少 6 项。',
    },
  ],
  'kp10-7': [
    {
      difficulty: 'easy',
      stem: '单一商品销售量个体指数 Iq=（  ）。',
      options: ['q1/q0', 'p1/p0', 'Σp0q1/Σp0q0', 'x̄/n'],
      correctIndex: 0,
      explanation: '价格个体 Ip=p1/p0；综合指数在此基础上加权。',
    },
    {
      difficulty: 'medium',
      stem: '个体指数反映（  ）。',
      options: ['单一项目的变动', '全部商品综合变动', '抽样误差', '偏态'],
      correctIndex: 0,
      explanation: '铅笔 150%、围巾 87.5% 类题。',
    },
  ],
  'kp10-8': [
    {
      difficulty: 'medium',
      stem: '数量指标总指数常变形为（  ）。',
      options: ['加权算术平均指数', '加权调和平均指数', '几何平均', '中位数'],
      correctIndex: 0,
      explanation: '量→算术权 p0q0；价→调和权 p1q1。',
    },
    {
      difficulty: 'hard',
      stem: '销售量同比例变动时，拉氏指数与派氏指数（  ）。',
      options: ['相等', '拉氏一定小于派氏', '派氏一定大于拉氏 110%', '无法计算'],
      correctIndex: 0,
      explanation: '笔记 8.1：同比例→两指数相同。',
    },
  ],
  'kp10-9': [
    {
      difficulty: 'easy',
      stem: '股票价格指数（如道琼斯）编制属于（  ）。',
      options: ['了解级内容', '与 CPI 完全相同', '只算个体指数', '只做 t 检验'],
      correctIndex: 0,
      explanation: '代表股票、基期对比；与综合物量/价指语境不同。',
    },
    {
      difficulty: 'easy',
      stem: '股票指数一般选（  ）。',
      options: ['有代表性的股票', '全部人口', '只算极差', '只算众数'],
      correctIndex: 0,
      explanation: '了解编制思路即可。',
    },
  ],
  'kp10-10': [
    {
      difficulty: 'medium',
      stem: '理想指数（费雪）是拉氏与派氏指数的（  ）。',
      options: ['几何平均', '算术平均', '差额', '环比连乘'],
      correctIndex: 0,
      explanation: '马艾用基报告期数量平均权；大纲以拉派平均为主。',
    },
    {
      difficulty: 'easy',
      stem: '马艾公式属于（  ）。',
      options: ['了解级指数公式', '假设检验', '季节指数调整', '移动平均'],
      correctIndex: 0,
      explanation: '认名即可。',
    },
  ],
  'kp1-14': [
    {
      difficulty: 'easy',
      stem: '85 分是某学生「成绩」这一标志的（  ）。',
      options: ['标志值', '指标', '总体', '样本'],
      correctIndex: 0,
      explanation: '标志值是标志在具体单位上的取值。',
    },
    {
      difficulty: 'medium',
      stem: '下列属于标志值的是（  ）。',
      options: ['某台设备编号 007', '工业总产值', '平均身高', '人口密度'],
      correctIndex: 0,
      explanation: '007 是单位层面具体表现；后三项多为指标。',
    },
  ],
  'kp1-15': [
    {
      difficulty: 'medium',
      stem: '出勤率、人口密度一般属于（  ）。',
      options: ['质量指标', '数量指标', '标志值', '个体指数'],
      correctIndex: 0,
      explanation: '率、密度、人均类多为质量（相对）指标。',
    },
    {
      difficulty: 'easy',
      stem: '商品销售额属于（  ）。',
      options: ['数量指标', '品质标志', '定类数据', '季节指数'],
      correctIndex: 0,
      explanation: '产量、销售额等为数量指标。',
    },
  ],
  'kp1-16': [
    {
      difficulty: 'medium',
      stem: '关于标志与指标，正确的是（  ）。',
      options: ['研究目的不同可互相转化', '任何时候可随意互换', '二者完全相同', '都与样本无关'],
      correctIndex: 0,
      explanation: '笔记 ABD 可转化；E 错「任何情况」.',
    },
    {
      difficulty: 'easy',
      stem: '说明总体数量特征的是（  ）。',
      options: ['指标', '标志', '标志值', '调查表'],
      correctIndex: 0,
      explanation: '标志→单位；指标→总体。',
    },
  ],
  'kp2-16': [
    {
      difficulty: 'easy',
      stem: '统计调查应首先具备（  ）。',
      options: ['明确的目的性', '复杂公式', '回归方程', '指数体系'],
      correctIndex: 0,
      explanation: '概述：目的性、科学性。',
    },
    {
      difficulty: 'easy',
      stem: '统计调查是（  ）。',
      options: ['有目的收集数据的活动', '只画图表', '只算平均数', '只做普查'],
      correctIndex: 0,
      explanation: '与实验、文献等数据来源区分。',
    },
  ],
  'kp3-12': [
    {
      difficulty: 'medium',
      stem: '异距直方图纵轴通常表示（  ）。',
      options: ['频率密度', '只写频数', '环比速度', 'CPI'],
      correctIndex: 0,
      explanation: '等距看高度；异距看面积。',
    },
    {
      difficulty: 'easy',
      stem: '频率等于（  ）。',
      options: ['组次数÷总次数', '组中值×频数', '最大值−最小值', '报告期÷基期'],
      correctIndex: 0,
      explanation: '笔记：频率=组次/总次 D。',
    },
  ],
  'kp3-13': [
    {
      difficulty: 'medium',
      stem: '按两个及以上标志复合分组的表是（  ）。',
      options: ['复合分组表', '简单表', '饼图', '箱线图'],
      correctIndex: 0,
      explanation: '简单表、简单分组表、复合分组表 ACE。',
    },
    {
      difficulty: 'easy',
      stem: '统计表计量单位宜写在（  ）。',
      options: ['表右上角', '表下方任意处', '不写字', '纵轴中间'],
      correctIndex: 0,
      explanation: '笔记：单位右上角 C。',
    },
  ],
  'kp5-12': [
    {
      difficulty: 'hard',
      stem: '各数据乘 10 后，标准差变为原来的（  ）。',
      options: ['10 倍', '不变', '100 倍', '1/10'],
      correctIndex: 0,
      explanation: '乘 k→σ×k，σ²×k²。',
    },
    {
      difficulty: 'medium',
      stem: '各数据减 5 后，标准差（  ）。',
      options: ['不变', '减 5', '乘 5', '变为 0'],
      correctIndex: 0,
      explanation: '平移不改变离散程度。',
    },
  ],
  'kp5-13': [
    {
      difficulty: 'medium',
      stem: '各年增长率求平均增长率应使用（  ）。',
      options: ['几何平均数', '算术平均数', '中位数', '极差'],
      correctIndex: 0,
      explanation: '五表：增长率→G；速率→H。',
    },
    {
      difficulty: 'easy',
      stem: '右偏分布的代表值宜优先（  ）。',
      options: ['中位数', '算术平均数', '几何平均数', '调和平均数'],
      correctIndex: 0,
      explanation: '右偏 x̄>Me>Mo。',
    },
  ],
  'kp6-14': [
    {
      difficulty: 'medium',
      stem: '所有数据减 10，方差（  ）。',
      options: ['不变', '减 10', '减 100', '乘 10'],
      correctIndex: 0,
      explanation: '平移不改变 σ²。',
    },
    {
      difficulty: 'hard',
      stem: '所有数据乘 2，方差变为原来的（  ）。',
      options: ['4 倍', '2 倍', '不变', '8 倍'],
      correctIndex: 0,
      explanation: 'σ² 乘 k²。',
    },
  ],
  'kp7-10': [
    {
      difficulty: 'medium',
      stem: '成数 p 的区间估计常用（  ）。',
      options: ['p±z√[p(1−p)/n]', 'x̄±Δ only', '拉氏公式', '季节指数'],
      correctIndex: 0,
      explanation: '与均值区间并列。',
    },
    {
      difficulty: 'easy',
      stem: '估计总体合格率 π 可用样本成数 p 构造（  ）。',
      options: ['置信区间', '饼图', '移动平均', '结构相对数'],
      correctIndex: 0,
      explanation: '实验课 95% 区间解释。',
    },
  ],
  'kp8-10': [
    {
      difficulty: 'medium',
      stem: '相关分析与回归分析的区别，正确的是（  ）。',
      options: ['回归中 y 为因变量', '二者完全相同', '相关必须用 F 检验', '回归不算预测'],
      correctIndex: 0,
      explanation: '相关平等看 r；回归解释/预测 y。',
    },
    {
      difficulty: 'easy',
      stem: '判断两变量有无线性相关，首先应（  ）。',
      options: ['画散点图', '求调和平均', '编指数', '做普查'],
      correctIndex: 0,
      explanation: '相关分析步骤：散点图、相关表。',
    },
  ],
  'kp8-11': [
    {
      difficulty: 'easy',
      stem: '相关分析的一般步骤不包括（  ）。',
      options: ['求指数体系', '判断有无相关', '判断形式', '判断程度方向'],
      correctIndex: 0,
      explanation: '三步：有无、形式、程度方向。',
    },
    {
      difficulty: 'medium',
      stem: '相关关系的特点是（  ）。',
      options: ['x 给定 y 可不唯一', 'y=f(x) 唯一', '无数量依存', '一定因果'],
      correctIndex: 0,
      explanation: '点分布在直线/曲线周围。',
    },
  ],
  'kp9-10': [
    {
      difficulty: 'medium',
      stem: '平均发展速度应计算各期环比发展速度的（  ）。',
      options: ['几何平均数', '算术平均数', '调和平均数', '众数'],
      correctIndex: 0,
      explanation: '笔记：几何平均 D。',
    },
    {
      difficulty: 'hard',
      stem: '平均增长速度等于（  ）。',
      options: ['平均发展速度−1', '环比连乘', '定基速度+1', '前期水平/100'],
      correctIndex: 0,
      explanation: '与增长速度=发展速度−1 一致。',
    },
  ],
  'kp9-11': [
    {
      difficulty: 'easy',
      stem: '将月度数据合并为季度数据求和，属于测定长期趋势的（  ）。',
      options: ['时距扩大法', '季节指数法', '相关分析', '假设检验'],
      correctIndex: 0,
      explanation: '与移动平均、最小二乘并列。',
    },
    {
      difficulty: 'easy',
      stem: '时距扩大法用于（  ）。',
      options: ['测定长期趋势', '计算 CPI', '求相关系数', '求样本容量'],
      correctIndex: 0,
      explanation: '合并时段后汇总。',
    },
  ],
  'kp9-12': [
    {
      difficulty: 'easy',
      stem: 'ARMA 模型属于（  ）。',
      options: ['时间数列拓展（了解）', '第4章相对数', '第1章学派', '普查方法'],
      correctIndex: 0,
      explanation: '选学；考试以趋势季节为主。',
    },
    {
      difficulty: 'easy',
      stem: 'MA 模型在时间序列中常标为（  ）。',
      options: ['了解/选学', '必考计算', '唯一方法', '与 CPI 相同'],
      correctIndex: 0,
      explanation: '拓展内容。',
    },
  ],
  'kp10-11': [
    {
      difficulty: 'easy',
      stem: '狭义统计指数是指（  ）。',
      options: ['不能加总现象的综合动态相对数', '一切相对数', '算术平均数', '标准差'],
      correctIndex: 0,
      explanation: '广义=一切相对数；狭义=综合动态相对数。',
    },
    {
      difficulty: 'medium',
      stem: 'CPI 属于（  ）。',
      options: ['统计指数应用', '抽样误差', '众数', '箱线图'],
      correctIndex: 0,
      explanation: '反映物价变动；指数作用之一。',
    },
  ],
  'kp10-12': [
    {
      difficulty: 'medium',
      stem: '编制数量指标指数时，同度量因素一般固定在（  ）。',
      options: ['基期', '报告期', '任意期', '不需要'],
      correctIndex: 0,
      explanation: '拉氏：基期价格；派氏价指：报告期量。',
    },
    {
      difficulty: 'hard',
      stem: '同度量因素的作用包括（  ）。',
      options: ['权数与同度量双重作用', '只起装饰', '只用于图表', '等于环比'],
      correctIndex: 0,
      explanation: '笔记 BE。',
    },
  ],
  'kp1-17': [
    {
      difficulty: 'easy',
      stem: '统计指标的特点包括（  ）。',
      options: ['可量性、大量性、综合性、具体性', '只有可量性', '只有大量性', '与标志相同无特点'],
      correctIndex: 0,
      explanation: '笔记 §七：指标特点 ABCE。',
    },
    {
      difficulty: 'medium',
      stem: '下列关于统计指标的说法，正确的是（  ）。',
      options: ['指标体系由相互联系制约的指标组成', '指标只能有一个', '指标不可量化', '指标等于标志值'],
      correctIndex: 0,
      explanation: '指标体系 B；指标有可量性等特点。',
    },
  ],
  'kp2-17': [
    {
      difficulty: 'easy',
      stem: '数据质量六要求不包括（  ）。',
      options: ['美观性', '精度', '及时性', '最低成本'],
      correctIndex: 0,
      explanation: '六要求：精度、准确性、关联性、及时性、一致性、最低成本。',
    },
    {
      difficulty: 'medium',
      stem: '「精度」在数据质量六要求中主要指（  ）。',
      options: ['抽样误差尽可能小', '图表好看', '调查期限短', '只查一次'],
      correctIndex: 0,
      explanation: '精度→抽样误差小；准确性→非抽样误差小。',
    },
  ],
  'kp2-18': [
    {
      difficulty: 'easy',
      stem: '对总体排序后每隔固定距离抽取，属于（  ）。',
      options: ['等距（系统）抽样', '整群抽样', '典型调查', '普查'],
      correctIndex: 0,
      explanation: '等距=系统抽样，课后 D。',
    },
    {
      difficulty: 'medium',
      stem: '整群抽样属于（  ）。',
      options: ['非全面调查', '全面调查', '典型调查', '普查'],
      correctIndex: 0,
      explanation: '整群仍非全面（B）；按群抽取全部单位。',
    },
  ],
  'kp3-14': [
    {
      difficulty: 'easy',
      stem: '把第二季度三个月的数据表汇总到一张表，宜用 Excel（  ）。',
      options: ['合并计算', '三维透视表', 'CORREL', '回归分析'],
      correctIndex: 0,
      explanation: '同位置多表汇总→合并计算 B；多维交叉→透视 D。',
    },
    {
      difficulty: 'medium',
      stem: '合并计算与数据透视表的主要区别是（  ）。',
      options: ['合并计算汇总同位置区域；透视做多维交叉', '完全相同', '合并计算只能画图', '透视不能汇总'],
      correctIndex: 0,
      explanation: '笔记 §六：二季度→合并 B；地区×季度×商品→透视 D。',
    },
  ],
  'kp4-13': [
    {
      difficulty: 'easy',
      stem: '研究某城市物流企业，「企业总数」属于（  ）。',
      options: ['总体单位总量', '总体标志总量', '相对指标', '时期指标'],
      correctIndex: 0,
      explanation: '单位总量=单位个数，唯一。',
    },
    {
      difficulty: 'medium',
      stem: '「职工人数总和」相对于研究物流企业总体，属于（  ）。',
      options: ['总体标志总量', '总体单位总量', '结构相对数', '众数'],
      correctIndex: 0,
      explanation: '标志总量=各单位某标志值相加，可有多个。',
    },
  ],
  'kp6-15': [
    {
      difficulty: 'easy',
      stem: '标志变异指标越大，通常说明（  ）。',
      options: ['平均数的代表性越差', '平均数一定错误', '数据一定异常', '与平均数无关'],
      correctIndex: 0,
      explanation: '离散大→代表性差 A。',
    },
    {
      difficulty: 'medium',
      stem: '下列属于相对离散指标的是（  ）。',
      options: ['离散系数 V', '极差 R', '四分位差 QD', '平均差 AD'],
      correctIndex: 0,
      explanation: 'V=σ/x̄、V_AD 为相对离散；R、AD、σ 为绝对离散。',
    },
  ],
  'kp8-12': [
    {
      difficulty: 'easy',
      stem: '多元线性回归中，检验方程整体显著应使用（  ）。',
      options: ['F 检验', '只算 r', '只算 R²', 'Z 检验'],
      correctIndex: 0,
      explanation: '整体 F；单个 βj 用 t。',
    },
    {
      difficulty: 'hard',
      stem: '多元回归 F 检验显著，说明（  ）。',
      options: ['至少有一个自变量系数显著不为 0', '所有系数都显著', 'R²=0', '无线性相关'],
      correctIndex: 0,
      explanation: 'F 显著→至少一个 βj≠0（A），不是全部显著。',
    },
  ],
  'kp1-18': [
    {
      difficulty: 'easy',
      stem: '下列属于品质数据的是（  ）。',
      options: ['性别、满意度等级', '身高、体重', '产量、销售额', '年龄（定比）'],
      correctIndex: 0,
      explanation: '品质=定类+定序（A）；身高产量为数量数据。',
    },
    {
      difficulty: 'medium',
      stem: '对定类、定序数据，一般不宜直接使用（  ）。',
      options: ['算术平均数', '众数', '中位数', '饼图'],
      correctIndex: 0,
      explanation: '定类定序不求 x̄；可用众数、中位数。',
    },
  ],
  'kp2-19': [
    {
      difficulty: 'easy',
      stem: '登记性误差属于（  ）。',
      options: ['非抽样误差，原则上可消除', '抽样误差，不可避免', '假设检验中的 α', '季节指数误差'],
      correctIndex: 0,
      explanation: '登记性=非抽样；代表性=抽样误差。',
    },
    {
      difficulty: 'medium',
      stem: '代表性误差（抽样误差）的特点是（  ）。',
      options: ['非全面调查固有，可计算控制', '一定由填报错误造成', '等于 α', '只能消除不能估计'],
      correctIndex: 0,
      explanation: '随机、可随 n 增大而减小；登记误差可控制消除。',
    },
  ],
  'kp3-15': [
    {
      difficulty: 'easy',
      stem: '统计整理的一般程序包括（  ）。',
      options: ['审核→分组→汇总→制表→绘图', '只审核', '只绘图', '调查→推断'],
      correctIndex: 0,
      explanation: '课后 ABCDE 五程序。',
    },
    {
      difficulty: 'medium',
      stem: '数据审核主要检查（  ）。',
      options: ['准确性、完整性、及时性', '只有美观', '只有速度', '只有成本'],
      correctIndex: 0,
      explanation: '审核 ACE，与六要求中的准确性、及时性呼应。',
    },
  ],
  'kp4-14': [
    {
      difficulty: 'easy',
      stem: '「每千人口医生数」属于（  ）。',
      options: ['强度相对数', '结构相对数', '比例相对数', '计划完成程度'],
      correctIndex: 0,
      explanation: '不同总体总量之比→强度（D）；医生占人口比重→结构。',
    },
    {
      difficulty: 'medium',
      stem: '「女性占人口比重」属于（  ）。',
      options: ['结构相对数', '强度相对数', '比较相对数', '动态相对数'],
      correctIndex: 0,
      explanation: '部分/同总体→结构；每千人→强度。',
    },
  ],
  'kp5-14': [
    {
      difficulty: 'medium',
      stem: '各组平均水平不变，但高薪人员占比下降，总平均数可能（  ）。',
      options: ['下降', '一定上升', '不变', '等于众数'],
      correctIndex: 0,
      explanation: '结构变化可使总平均下降（课后 B）。',
    },
    {
      difficulty: 'hard',
      stem: '说明总平均数时，应同时参考（  ）。',
      options: ['组平均数与次数分布', '只报总平均', '只报众数', '只报极差'],
      correctIndex: 0,
      explanation: '应用原则：用组平均和分布补充，避免误判。',
    },
  ],
  'kp6-16': [
    {
      difficulty: 'easy',
      stem: '各组标志值全部减半、次数加倍，中位数（  ）。',
      options: ['减半', '不变', '加倍', '等于 0'],
      correctIndex: 0,
      explanation: '课后 A：Me 减半特例。',
    },
    {
      difficulty: 'medium',
      stem: '中位数减半特例说明中位数主要反映（  ）。',
      options: ['数据的中间位置', '极端值大小', '总和', '方差'],
      correctIndex: 0,
      explanation: '位置平均数对均匀缩放的位置反应。',
    },
  ],
  'kp7-11': [
    {
      difficulty: 'easy',
      stem: '总体成数 π 属于（  ）。',
      options: ['参数，通常未知', '样本统计量', '一定等于 p', '图表类型'],
      correctIndex: 0,
      explanation: 'μ、π 为参数；x̄、p 为统计量。',
    },
    {
      difficulty: 'medium',
      stem: '用样本均值 x̄ 估计总体均值 μ，x̄ 是（  ）。',
      options: ['统计量', '参数', '误差', '置信区间'],
      correctIndex: 0,
      explanation: '统计量由样本算；参数是总体未知常数。',
    },
  ],
  'kp8-13': [
    {
      difficulty: 'easy',
      stem: '一元线性回归中，通常可以（  ）。',
      options: ['由 x 预测 ŷ', '随意由 ŷ 反求 x', '不用 x 也能求 b', 'r=0 时不能回归'],
      correctIndex: 0,
      explanation: '预测单向：x→ŷ，不能随意逆推 x。',
    },
    {
      difficulty: 'medium',
      stem: '回归分析与相关分析在变量地位上的区别是（  ）。',
      options: ['回归 y 为因变量；相关 x、y 平等', '完全相同', '回归无因变量', '相关只能预测'],
      correctIndex: 0,
      explanation: '相关看相关强弱；回归看影响与预测。',
    },
  ],
  'kp9-13': [
    {
      difficulty: 'easy',
      stem: '各期指标值 a_i 称为（  ）。',
      options: ['发展水平', '增长速度', '季节指数', '抽样误差'],
      correctIndex: 0,
      explanation: '水平分析：发展水平、增长量、平均增长量。',
    },
    {
      difficulty: 'hard',
      stem: '2013–2022 共 10 年 GDP，平均增长量分母 n 应取（  ）。',
      options: ['9（间隔期数）', '10', '8', '1'],
      correctIndex: 0,
      explanation: 'n=间隔期数=(a_n−a_0)/n，10年数据间隔9期。',
    },
  ],
  'kp9-14': [
    {
      difficulty: 'easy',
      stem: '直线趋势 ŷ=a+bt 中，b 表示（  ）。',
      options: ['t 每增 1 单位 Y 的平均增减量', '截距即增长额', '环比发展速度', '季节指数'],
      correctIndex: 0,
      explanation: 'b 是斜率/年均增减，不是截距当增长额（B）。',
    },
    {
      difficulty: 'medium',
      stem: '用 1,2,3… 或 1988,1989… 作 t，拟合方程不同但（  ）。',
      options: ['同一时点预测值相同', '预测值一定不同', 'b 一定相同', 'a 一定为 0'],
      correctIndex: 0,
      explanation: '时间编号方式不影响同一时点的 ŷ。',
    },
  ],
}

/** 仅统计核心+课后题（不含旧 supplement），用于判断缺口 */
const coreSrc =
  readFileSync(join(root, 'src/data/questions.ts'), 'utf8') +
  readFileSync(join(root, 'src/data/homeworkQuestions.ts'), 'utf8')
const kpQCore = Object.fromEntries(kps.map((id) => [id, 0]))
for (const m of coreSrc.matchAll(/knowledgePointIds: \[([^\]]+)\]/g)) {
  for (const id of m[1].match(/kp[\w-]+/g) || []) {
    if (kpQCore[id] !== undefined) kpQCore[id]++
  }
}

const need = kps.filter((id) => (kpQCore[id] ?? 0) < 2)

/** 保留仍满足 ≥2 题的旧 supplement 条目 */
const kept = []
if (existsSync(supPath)) {
  const old = readFileSync(supPath, 'utf8')
  const blocks = old.match(/\{[\s\S]*?explanation:[\s\S]*?\},/g) || []
  for (const block of blocks) {
    const idM = block.match(/id: '(sup-[^']+)'/)
    const kpM = block.match(/knowledgePointIds: \['([^']+)'\]/)
    if (!idM || !kpM) continue
    if (need.includes(kpM[1])) continue
    kept.push(block.trim())
  }
}

const lines = [
  "import type { Question } from '../types'",
  '',
  '/** 自动补全：覆盖零题/单题知识点（node scripts/gen-supplement.mjs） */',
  'export const supplementQuestions: Question[] = [',
  ...kept,
]

let n = kept.length
for (const kpId of need) {
  const meta = kpMeta[kpId]
  if (!meta) continue
  const items = BANK[kpId]
  if (!items?.length) {
    console.warn('WARN: no BANK for', kpId)
    continue
  }
  const existing = kpQCore[kpId] ?? 0
  const toAdd = items.slice(0, Math.max(0, 2 - existing))
  toAdd.forEach((q, i) => {
    const id = `sup-${kpId}-${i + 1}`
    lines.push('  {')
    lines.push(`    id: '${id}',`)
    lines.push(`    chapterId: '${meta.chapterId}',`)
    lines.push(`    knowledgePointIds: ['${kpId}'],`)
    lines.push(`    difficulty: '${q.difficulty}',`)
    lines.push(`    stem: ${JSON.stringify(q.stem)},`)
    lines.push(`    options: ${JSON.stringify(q.options)},`)
    lines.push(`    correctIndex: ${q.correctIndex},`)
    lines.push(`    explanation: ${JSON.stringify(q.explanation)},`)
    lines.push('  },')
    n++
  })
}

lines.push(']')
lines.push('')

writeFileSync(join(root, 'src/data/supplementQuestions.ts'), lines.join('\n'), 'utf8')
console.log('Wrote', n, 'questions for', need.length, 'KPs → supplementQuestions.ts')
