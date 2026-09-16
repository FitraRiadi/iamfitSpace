import { useState } from 'react'
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

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <div className="dark min-h-screen bg-surface-dim text-on-surface">
      {loading && <Preloader duration={4000} onComplete={() => setLoading(false)} />}
      <TargetCursor
        targetSelector=".eco-cursor-target"
        spinDuration={2}
        hideDefaultCursor={false}
        parallaxOn={true}
        cursorColor="#c0f500"
        cursorColorOnTarget="#c0f500"
      />
      {/* Mount page content only after the preloader finishes, so all
          framer-motion entrances (Navbar, Hero, whileInView) play fresh
          on reveal instead of running unseen behind the overlay. */}
      {!loading && (
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
        </>
      )}
      <SiteDock intro={!loading} />
    </div>
  )
}

export default App
