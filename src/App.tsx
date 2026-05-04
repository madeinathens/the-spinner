import { HashRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/Home'
import { SipPage } from './pages/Sip'
import { BookPage } from './pages/Book'
import { LadderPage } from './pages/Ladder'
import { SpinPage } from './pages/Spin'
import { AdminPage } from './pages/Admin'
import './styles/global.css'
import './components/Header.css'
import './components/Footer.css'

export function App() {
  // HashRouter is required for IPFS deployment — no server-side rewrites available.
  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sip" element={<SipPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/ladder" element={<LadderPage />} />
          <Route path="/spin" element={<SpinPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  )
}
