import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import TargetCursor from './components/TargetCursor'
import Hero from './components/Hero'
import TechStack from './components/TechStack'
import Space from './components/Space'
import Work from './components/Work'
import Store from './components/Store'
import Status from './components/Status'
import About from './components/About'
import Marquee from './components/Marquee'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SiteDock from './components/SiteDock'
import SpaceShell, { RequireAuth } from './space/SpaceShell'
import Overview from './space/Overview'
import Clients from './space/Clients'
import Leads from './space/Leads'
import Projects from './space/Projects'
import Finance from './space/Finance'
import Products from './space/Products'
import Settings from './space/Settings'
import { getLenis } from './lib/lenis.js'

function PublicSite() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <Space />
        <Work />
        <Store />
        <Status />
        <About />
        <Marquee />
        <Contact />
      </main>
      <Footer />
      <SiteDock intro />
    </>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const inSpace = location.pathname.startsWith('/space')

  // Freeze Lenis while the preloader runs; release on reveal.
  useEffect(() => {
    const l = getLenis()
    if (!l) return
    if (loading) l.stop()
    else l.start()
  }, [loading])

  return (
    <div className="dark min-h-screen bg-surface-dim text-on-surface">
      {loading && <Preloader duration={4000} onComplete={() => setLoading(false)} />}
      {/* Custom cursor hanya di publik — dashboard pake kursor normal (profesional). */}
      {!inSpace && (
        <TargetCursor
          targetSelector=".eco-cursor-target"
          spinDuration={2}
          hideDefaultCursor={false}
          parallaxOn={true}
          cursorColor="#c0f500"
          cursorColorOnTarget="#c0f500"
        />
      )}
      {/* Mount page content only after the preloader finishes, so all
          framer-motion entrances (Navbar, Hero, whileInView) play fresh
          on reveal instead of running unseen behind the overlay. */}
      {!loading && (
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route
            path="/space"
            element={
              <RequireAuth>
                <SpaceShell />
              </RequireAuth>
            }
          >
            <Route index element={<Overview />} />
            <Route path="clients" element={<Clients />} />
            <Route path="leads" element={<Leads />} />
            <Route path="projects" element={<Projects />} />
            <Route path="finance" element={<Finance />} />
            <Route path="products" element={<Products />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/space" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  )
}

export default App
