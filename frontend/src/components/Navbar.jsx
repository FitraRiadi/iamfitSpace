import { motion } from 'framer-motion'
import brandMark from '../assets/brand-mark.svg'
import { EASE } from '../lib/anim'

const links = [
  { label: 'SPACE', href: '#space' },
  { label: 'WORK', href: '#work' },
  { label: 'STORE', href: '#store' },
  { label: 'STATUS', href: '#status' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="sticky top-0 z-50 w-full bg-surface-container-lowest border-b-2 border-primary"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-3 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3">
          <img src={brandMark} alt="IamFit Space" className="h-9 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-1 font-hud-label text-hud-label">
          {links.map((l, i) => (
            <motion.a
              key={l.label}
              href={l.href}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.15 + i * 0.06 }}
              className="px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-surface-container border border-transparent hover:border-surface-container-high transition-colors"
            >
              [{l.label}]
            </motion.a>
          ))}
        </nav>
        <a
          href="#contact"
          className="inline-flex items-center justify-center bg-primary-container text-on-primary-fixed font-hud-label text-hud-label uppercase px-5 py-2.5 border-2 border-primary-container shadow-brutal-dark hover:bg-primary transition-colors"
        >
          HIRE ME →
        </a>
      </div>
    </motion.header>
  )
}
