import { Routes, Route } from 'react-router-dom'
import { AppStateProvider } from './context/AppStateContext'
import { TutorProvider } from './context/TutorContext'
import { ToastProvider } from './components/Toast'
import { Layout } from './components/Layout'
import { TodayPlan } from './pages/TodayPlan'
import { Learn } from './pages/Learn'
import { Practice } from './pages/Practice'
import { Review } from './pages/Review'
import { Notes } from './pages/Notes'
import { Summary } from './pages/Summary'
import { Diagnostic } from './pages/Diagnostic'
import { WrongBook } from './pages/WrongBook'
import { Settings } from './pages/Settings'
import { ChapterExam } from './pages/ChapterExam'
import { ReviewRetest } from './pages/ReviewRetest'
import { ChapterNotes } from './pages/ChapterNotes'

export default function App() {
  return (
    <AppStateProvider>
      <TutorProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<TodayPlan />} />
              <Route path="learn" element={<Learn />} />
              <Route path="practice" element={<Practice />} />
              <Route path="review" element={<Review />} />
              <Route path="review/retest" element={<ReviewRetest />} />
              <Route path="settings" element={<Settings />} />
              <Route path="exam/:chapterId" element={<ChapterExam />} />
              <Route path="wrong-book" element={<WrongBook />} />
              <Route path="notes" element={<Notes />} />
              <Route path="chapter-notes" element={<ChapterNotes />} />
              <Route path="summary" element={<Summary />} />
              <Route path="diagnostic/:chapterId" element={<Diagnostic />} />
            </Route>
          </Routes>
        </ToastProvider>
      </TutorProvider>
    </AppStateProvider>
  )
}
