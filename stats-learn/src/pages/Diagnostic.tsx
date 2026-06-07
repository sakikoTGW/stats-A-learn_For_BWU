import { useCallback, useEffect, useMemo, useState } from 'react'

import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { chapters } from '../data/chapters'

import { useAppState } from '../hooks/useAppState'

import { useTutor } from '../context/TutorContext'

import { useToast } from '../components/Toast'

import {

  buildDiagnosticResult,

  pickDiagnosticQuestions,

  saveDiagnostic,

} from '../services/diagnostic'

import { proactiveAfterDiagnostic, instantAnswerFeedback } from '../services/tutor'

import { ensureTodayPlan } from '../services/plan'

import { applyFlowToDailyPlan } from '../services/planFlowSync'
import { prepareQuestionForDisplay } from '../services/questionDisplay'

import { knowledgePoints } from '../data/chapters'

import { DiagnosticViz } from '../components/DiagnosticViz'

import { TodayFlowStepper } from '../components/TodayFlowStepper'

import {

  loadTodayFlow,

  advanceFlow,

  flowPath,

  weakKpForChapter,

  skipFlowStep,

  stepKeyForIndex,

} from '../services/todayFlow'
import { useQuestionKeyboard, useScrollToQuestion } from '../hooks/useQuestionKeyboard'
import { QuestionKeyboardHint, QuestionOptions } from '../components/QuestionOptions'



export function Diagnostic() {

  const { chapterId = 'ch1' } = useParams<{ chapterId: string }>()

  const [searchParams] = useSearchParams()

  const flowMode = searchParams.get('flow') === 'today'

  const navigate = useNavigate()

  const { state, patch } = useAppState()

  const { pushTutorMessage } = useTutor()

  const { showToast } = useToast()



  const chapter = chapters.find((c) => c.id === chapterId)

  const questions = useMemo(() => pickDiagnosticQuestions(chapterId), [chapterId])

  const [flow, setFlow] = useState(() => (flowMode ? loadTodayFlow() : null))

  useEffect(() => {
    if (flowMode) setFlow(loadTodayFlow())
  }, [flowMode, chapterId])

  const handleSkipFlow = () => {
    if (!flow) return
    const next = skipFlowStep(flow, stepKeyForIndex(flow.currentStep))
    setFlow(next)
    patch((s) => applyFlowToDailyPlan(s, next))
    navigate(flowPath(next, state))
    showToast('已跳过本步')
  }

  const [qi, setQi] = useState(0)

  const [selected, setSelected] = useState<number | null>(null)

  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean }[]>([])

  const [finished, setFinished] = useState(false)

  const [result, setResult] = useState<ReturnType<typeof buildDiagnosticResult> | null>(null)



  const rawQ = questions[qi]
  const q = useMemo(
    () => (rawQ ? prepareQuestionForDisplay(rawQ) : undefined),
    [rawQ?.id, qi]
  )



  const submitAnswer = useCallback(() => {

    if (!q || selected === null) return

    const correct = selected === q.correctIndex

    pushTutorMessage(instantAnswerFeedback(correct, q.explanation))

    const nextAnswers = [...answers, { questionId: q.id, correct }]
    setAnswers(nextAnswers)

    if (qi < questions.length - 1) {

      setQi((i) => i + 1)

      setSelected(null)

    } else {

      const res = buildDiagnosticResult(chapterId, nextAnswers)

      setResult(res)

      setFinished(true)

      patch((s) => ensureTodayPlan(saveDiagnostic(s, res)))

      pushTutorMessage(proactiveAfterDiagnostic(res))

      showToast(`摸底完成：正确率 ${res.accuracy}%`)



      if (flowMode && flow) {

        const kp = weakKpForChapter({ ...state, diagnostics: { ...state.diagnostics, [chapterId]: res } }, chapterId)

        const next = advanceFlow(flow, {

          diagnosticDone: true,

          learnKpId: kp,

          currentStep: 2,

        })

        setFlow(next)

        patch((s) => applyFlowToDailyPlan(s, next))

      }

    }

  }, [

    q,

    selected,

    answers,

    qi,

    questions.length,

    chapterId,

    patch,

    pushTutorMessage,

    showToast,

    flowMode,

    flow,

    state,

  ])



  useQuestionKeyboard({
    optionCount: q?.options.length ?? 0,
    selected,
    disabled: finished || !q,
    onSelect: setSelected,
    onSubmit: submitAnswer,
  })

  useScrollToQuestion([qi, chapterId])

  if (!chapter) {

    return (

      <div className="page">

        <div className="card empty-state">

          <p>章节不存在</p>

          <Link to="/" className="btn-primary">返回首页</Link>

        </div>

      </div>

    )

  }



  if (questions.length === 0) {

    return (

      <div className="page">

        <h2>学前摸底 · {chapter.title}</h2>

        <div className="card empty-state">

          <p>该章暂无测验题</p>

          <p className="empty-next">下一步：直接学知识点。</p>

          <Link to={`/learn?chapter=${chapterId}${flowMode ? '&flow=today' : ''}`} className="btn-primary">

            去学知识点

          </Link>

        </div>

      </div>

    )

  }



  if (finished && result) {

    const weakTitles = result.weakKnowledgePointIds

      .map((id) => knowledgePoints.find((k) => k.id === id)?.title)

      .filter(Boolean) as string[]



    return (

      <div className="page">

        {flowMode && flow?.active && <TodayFlowStepper session={flow} onSkip={handleSkipFlow} />}

        <div className="page-header">

          <h2>摸底结果 · {chapter.title}</h2>

        </div>



        <div className="card diagnostic-result">

          <DiagnosticViz result={result} weakTitles={weakTitles} />



          <div className="diagnostic-section">

            <strong>建议学习顺序</strong>

            <ol className="suggest-order">

              {result.suggestedOrder

                .map((id) => knowledgePoints.find((k) => k.id === id)?.title)

                .filter(Boolean)

                .map((t, i) => (

                  <li key={t}>{i + 1}. {t}</li>

                ))}

            </ol>

          </div>



          <div className="row-actions">

            {flowMode && flow ? (

              <button

                type="button"

                className="btn-primary"

                onClick={() => navigate(flowPath(flow, state))}

              >

                下一步：学薄弱点

              </button>

            ) : (

              <Link

                to={`/learn?chapter=${chapterId}&kp=${result.suggestedOrder[0] ?? ''}`}

                className="btn-primary"

              >

                按推荐顺序学习

              </Link>

            )}

            <Link to="/" className="btn-ghost">

              回首页

            </Link>

          </div>

        </div>

      </div>

    )

  }



  return (

    <div className="page">

      {flowMode && flow?.active && <TodayFlowStepper session={flow} onSkip={handleSkipFlow} />}

      <div className="page-header">

        <h2>学前摸底 · {chapter.title}</h2>

        <p className="subtitle">
          第 {qi + 1}/{questions.length} 题
        </p>
        <QuestionKeyboardHint phase="answer" />

      </div>



      <div className="progress-bar">

        <div style={{ width: `${((qi + 1) / questions.length) * 100}%` }} />

        <span>{qi + 1} / {questions.length}</span>

      </div>



      {q && (

        <div className="card question-card">

          <p className="stem">{q.stem}</p>

          <QuestionOptions
            options={q.options}
            selected={selected}
            correctIndex={q.correctIndex}
            showResult={false}
            name="diag-opt"
            onSelect={setSelected}
          />

          <div className="row-actions">

            <button

              type="button"

              className="btn-primary"

              disabled={selected === null}

              onClick={submitAnswer}

            >

              提交 <span className="kbd-hint">Enter / Space</span>

              {qi < questions.length - 1 ? '下一题' : '提交并查看结果'}

            </button>

            <Link to={`/learn?chapter=${chapterId}`} className="btn-ghost">

              稍后再测

            </Link>

          </div>

        </div>

      )}

    </div>

  )

}

