import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { staggerParent, staggerChild } from '../lib/anim'
import workOsb from '../assets/work-osb.jpg'
import workKnight from '../assets/work-knight.jpg'
import workHypergrid from '../assets/work-hypergrid.jpg'

const projects = [
  {
    prj: 'PRJ_01 // WEB ARCHITECTURE',
    status: 'STATUS: BUILDING',
    statusLive: true,
    img: workOsb,
    rev: 'REV: 0.8.4_STABLE',
    cat: 'CATEGORY: WEB DEV',
    stack: 'POSTGRESQL',
    title: 'OSB — ONLINE SCHOOL BOOK',
    desc: 'A modular school management system and digital curriculum book designed for extreme query speed and offline-first classroom synchronicity across remote educational centers.',
    tags: ['React', 'Laravel', 'PostgreSQL'],
    cta: 'VIEW PROJECT BRIEF →',
    ctaStyle: 'bg-primary-container text-on-primary border-primary-container shadow-brutal-dark hover:bg-primary',
  },
  {
    prj: 'PRJ_02 // INDIE GAME DEV',
    status: 'IN DEVELOPMENT',
    statusLive: false,
    img: workKnight,
    rev: 'BUILD: TEST_ALPHA_03',
    cat: 'CATEGORY: GAMEDEV',
    stack: 'GODOT 4',
    title: 'KNIGHT BATTLE',
    desc: 'Fast-paced 2D combat platformer featuring reactive parry mechanics, dynamic frame-perfect lighting, and pixel-art retro brutality with custom GLSL lighting passes.',
    tags: ['Godot 4', 'C#', 'Custom Shaders'],
    cta: 'WATCH DEVLOG & PLAY TEST →',
    ctaStyle: 'bg-surface-container-high text-primary border-primary hover:bg-primary-container hover:text-on-primary',
  },
  {
    prj: 'PRJ_03 // OPEN SOURCE CORE',
    status: 'SHIPPED V1.2',
    statusLive: true,
    img: workHypergrid,
    rev: 'NPM: 14.2K / MO',
    cat: 'CATEGORY: UI ENGINE',
    stack: 'TYPESCRIPT',
    title: 'HYPERGRID UI ENGINE',
    desc: 'Dense developer terminal dashboard kit with dark charcoal cards, stark white borders, acid lime monospace metrics, and real-time ticker charts.',
    tags: ['React', 'Tailwind', 'Vite'],
    cta: 'OPEN REPOSITORY →',
    ctaStyle: 'bg-surface-container-high text-primary border-primary hover:bg-primary-container hover:text-on-primary',
  },
]

export default function Work() {
  return (
    <section id="work" className="w-full bg-surface-dim py-20 border-b-2 border-surface-container-high overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col gap-12">
        <SectionHeader
          code="// 02 — PRODUCTION DEPLOYS"
          tag=":: [VERIFIED_BUILDS]"
          title="WHAT I'M BUILDING"
          desc="Curated production releases and games built from scratch. High mechanical precision, tight feedback loops, and zero bloat."
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {projects.map((p) => (
            <motion.div
              key={p.title}
              variants={staggerChild}
              className="bg-surface-container-lowest border-2 border-primary flex flex-col shadow-brutal-white hover:border-primary-container hover:shadow-brutal-lime transition-all group"
            >
              <div className="flex items-center justify-between bg-surface-container-low border-b-2 border-primary px-4 py-2 font-hud-code text-[11px] flex-wrap gap-1">
                <span className="text-primary font-bold">{p.prj}</span>
                <span
                  className={`font-bold inline-flex items-center gap-1.5 ${
                    p.statusLive ? 'text-primary-container' : 'text-error'
                  }`}
                >
                  <span className={`w-2 h-2 animate-pulse ${p.statusLive ? 'bg-primary-container' : 'bg-error'}`} />
                  {p.status}
                </span>
              </div>
              <div className="relative w-full h-56 bg-surface-container overflow-hidden border-b-2 border-primary">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-surface-container-lowest border border-primary px-2 py-0.5 font-hud-code text-[10px] text-primary">
                  {p.rev}
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between font-hud-code text-hud-code">
                    <span className="text-on-surface-variant uppercase">{p.cat}</span>
                    <span className="text-primary">{p.stack}</span>
                  </div>
                  <h3 className="font-grotesk text-[36px] leading-[40px] text-primary uppercase font-bold">{p.title}</h3>
                  <p className="font-jakarta text-[13px] text-on-surface-variant">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="font-hud-code text-[11px] bg-surface-container border border-surface-container-high px-2 py-1 text-primary-container"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href="#contact"
                  className={`inline-flex items-center justify-center font-hud-label text-hud-label uppercase py-3 border-2 transition-colors ${p.ctaStyle}`}
                >
                  {p.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
