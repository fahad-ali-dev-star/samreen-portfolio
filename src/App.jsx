import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Loader from './components/common/Loader'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Admin = lazy(() => import('./pages/Admin'))

function App() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  )
}

export default App
