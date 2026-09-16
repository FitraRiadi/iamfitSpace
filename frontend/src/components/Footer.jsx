import { motion } from 'framer-motion'
import { Reveal } from '../lib/anim'

const index = [
  { n: '//01', label: 'Work', href: '#work' },
  { n: '//02', label: 'Web Development', href: '#space' },
  { n: '//03', label: 'GameDev', href: '#space' },
  { n: '//04', label: 'Store', href: '#store' },
  { n: '//05', label: 'Labs', href: '#status' },
]

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full bg-surface-container-lowest border-t-2 border-surface-container-high pt-10 pb-8 overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        <Reveal className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-surface-container-high">
          <div className="md:col-span-6 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-grotesk text-5xl text-primary tracking-tighter uppercase font-bold">IAMFIT SPACE</span>
              <p className="font-hud-label text-hud-label text-primary-container tracking-widest">BUILD. MANAGE. SHOWCASE.</p>
            </div>
            <p className="font-jakarta text-[13px] text-on-surface-variant max-w-md">
              Dark neobrutalist digital chassis for high-grade creative technology, interactive game environments, and modern
              web systems engineering.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-hud-label text-hud-label text-primary uppercase tracking-widest border-b border-surface-container-high pb-2">
              INDEX MATRIX
            </span>
            <ul className="flex flex-col gap-2">
              {index.map((i) => (
                <li key={i.label} className="flex items-center gap-2">
                  <span className="text-primary-container font-hud-code text-hud-code">{i.n}</span>
                  <a href={i.href} className="font-hud-code text-hud-code text-on-surface-variant hover:text-on-surface transition-colors">
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-hud-label text-hud-label text-primary uppercase tracking-widest border-b border-surface-container-high pb-2">
              SYS.STATUS
            </span>
            <div className="font-hud-code text-[12px] text-on-surface-variant flex flex-col gap-1.5">
              <span>BUILD: STABLE_v1.0.4</span>
              <span className="text-primary-container">● ALL SYSTEMS OPERATIONAL</span>
              <span>© 2026 IAMFIT SPACE</span>
            </div>
          </div>
        </Reveal>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-hud-code text-[11px] text-on-surface-variant">
          <span>ONE SPACE. MULTIPLE WORLDS.</span>
          <span>
            DESIGNED IN <span className="text-primary-container">DARK NEOBRUTALISM</span>
          </span>
        </div>
      </div>
    </motion.footer>
  )
}
