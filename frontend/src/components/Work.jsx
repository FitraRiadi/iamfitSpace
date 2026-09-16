import { useState, useEffect } from 'react'
import { Reveal } from '../lib/anim'
import CardSwap, { Card } from './CardSwap'
import { scrollToSection } from '../lib/lenis.js'
import workOsb from '../assets/work-osb.jpg'
import workKnight from '../assets/work-knight.jpg'
import workHypergrid from '../assets/work-hypergrid.jpg'

const projects = [
  {
    prj: 'PRJ_01 // WEB ARCHITECTURE',
    status: 'STATUS: BUILDING',
    statusLive: true,
    img: workOsb,
    rev: 'REV: 0.8.4',
    cat: 'WEB DEV',
    title: 'OSB — ONLINE SCHOOL BOOK',
    desc: 'Modular school management system with offline-first classroom sync.',
    tags: ['React', 'Laravel', 'PostgreSQL'],
    cta: 'VIEW BRIEF →',
    ctaStyle: 'bg-primary-container text-on-primary border-primary-container shadow-brutal-dark hover:bg-primary',
  },
  {
    prj: 'PRJ_02 // INDIE GAME DEV',
    status: 'IN DEVELOPMENT',
    statusLive: false,
    img: workKnight,
    rev: 'ALPHA_03',
    cat: 'GAMEDEV',
    title: 'KNIGHT BATTLE',
    desc: 'Fast 2D combat platformer with parry mechanics and pixel brutality.',
    tags: ['Godot 4', 'C#', 'Shaders'],
    cta: 'DEVLOG & PLAY →',
    ctaStyle: 'bg-surface-container-high text-primary border-primary hover:bg-primary-container hover:text-on-primary',
  },
  {
    prj: 'PRJ_03 // OPEN SOURCE CORE',
    status: 'SHIPPED V1.2',
    statusLive: true,
    img: workHypergrid,
    rev: 'NPM 14.2K/MO',
    cat: 'UI ENGINE',
    title: 'HYPERGRID UI ENGINE',
    desc: 'Terminal dashboard UI kit with real-time ticker charts.',
    tags: ['React', 'Tailwind', 'Vite'],
    cta: 'OPEN REPO →',
    ctaStyle: 'bg-surface-container-high text-primary border-primary hover:bg-primary-container hover:text-on-primary',
  },
]

export default function Work() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const cardW = isMobile ? 270 : 320
  const cardH = 440
  const cardDist = isMobile ? 30 : 40
  const vertDist = isMobile ? 45 : 55

  return (
    <section id="work" className="w-full bg-surface-dim py-20 border-b-2 border-surface-container-high overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <Reveal className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 font-hud-label text-hud-label text-primary-container tracking-widest">
            <span>{'// 03 — PRODUCTION DEPLOYS'}</span>
            <span className="text-on-surface-variant">:: [VERIFIED_BUILDS]</span>
          </div>
          <h2 className="font-jersey text-6xl sm:text-7xl lg:text-8xl text-primary tracking-tight uppercase leading-none">
            WHAT I&apos;M BUILDING
          </h2>
          <p className="font-jakarta text-lg text-on-surface-variant leading-relaxed">
            Three flagship builds, one standard: engineered from scratch, shipped with intent.
            Web systems, playable games, and reusable engines — production-grade, zero bloat.
          </p>
          <ul className="flex flex-col gap-2 pt-2">
            {projects.map((p, i) => (
              <li
                key={p.title}
                className="flex items-center gap-3 font-hud-code text-hud-code border border-surface-container-high bg-surface-container-low px-3 py-2"
              >
                <span className="text-primary-container font-bold">0{i + 1}</span>
                <span className="text-primary font-bold uppercase">{p.title}</span>
                <span className="ml-auto text-on-surface-variant hidden sm:inline">{p.cat}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2 font-hud-code text-hud-code text-primary-container">
            [ AUTO-CYCLING // 03 BUILDS ]
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" y={32} delay={0.1}>
          <div
            className="relative w-full mx-auto"
            style={{ height: isMobile ? 560 : 580, '--swap-cx': `${cardDist}px` }}
          >
            <CardSwap
              width={cardW}
              height={cardH}
              cardDistance={cardDist}
              verticalDistance={vertDist}
              delay={2000}
              pauseOnHover={false}
              skewAmount={0}
              easing="elastic"
              durationScale={0.45}
              dropDistance={isMobile ? 200 : 240}
            >
              {projects.map((p) => (
                <Card key={p.title}>
                  <div className="w-full h-full flex flex-col bg-surface-container-lowest">
                    <div className="flex items-center justify-between bg-surface-container-low border-b-2 border-primary px-3 py-1.5 font-hud-code text-[10px] flex-wrap gap-1 shrink-0">
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
                    <div className="relative w-full h-28 sm:h-32 bg-surface-container overflow-hidden border-b-2 border-primary shrink-0">
                      <img
                        src={p.img}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-surface-container-lowest border border-primary px-2 py-0.5 font-hud-code text-[10px] text-primary">
                        {p.rev}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-2 min-h-0">
                      <span className="font-hud-code text-[11px] text-on-surface-variant uppercase">{p.cat}</span>
                      <h3 className="font-grotesk text-xl sm:text-2xl text-primary uppercase font-bold leading-tight">
                        {p.title}
                      </h3>
                      <p className="font-jakarta text-[13px] text-on-surface-variant line-clamp-2">{p.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="font-hud-code text-[10px] bg-surface-container border border-surface-container-high px-2 py-0.5 text-primary-container"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToSection('#contact')
                        }}
                        className={`mt-auto inline-flex items-center justify-center font-hud-label text-hud-label uppercase py-2.5 border-2 transition-colors ${p.ctaStyle}`}
                      >
                        {p.cta}
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
