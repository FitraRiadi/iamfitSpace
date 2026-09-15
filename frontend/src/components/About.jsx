import { motion } from 'framer-motion'
import { Reveal } from '../lib/anim'
import aboutPortrait from '../assets/about-portrait.jpg'

const badges = ['[ WEB DEVELOPMENT ]', '[ GAME DEVELOPMENT ]', '[ UI / UX ]', '[ DIGITAL PRODUCTS ]']

export default function About() {
  return (
    <section id="about" className="w-full bg-surface py-20 border-b-2 border-surface-container-high">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <Reveal className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2 font-hud-label text-hud-label text-primary-container tracking-widest">
              <span>// 05 — IDENTITY & CODEBASE</span>
              <span className="text-on-surface-variant">:: [INDEPENDENT_OPERATOR]</span>
            </div>
            <h2 className="font-jersey text-6xl sm:text-7xl lg:text-8xl text-primary tracking-tight uppercase leading-none">
              WHO IS IAMFIT?
            </h2>
            <p className="font-grotesk text-lg text-primary font-semibold leading-snug">
              Not a standard corporate coder, but an independent technologist turning wild ideas into executable software.
            </p>
            <p className="font-jakarta text-lg text-on-surface-variant leading-relaxed">
              IamFit is a developer and digital creator building things across web development, game development, and
              digital products. I operate on the intersection between raw computing power, tactile game feel, and brutalist
              web design. Every project is built from scratch with an emphasis on performance, ownership, and zero bloatware.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="font-hud-code text-hud-code px-3 py-1.5 bg-surface-container-high text-primary border-2 border-primary"
                >
                  {b}
                </span>
              ))}
              <span className="font-hud-code text-hud-code px-3 py-1.5 bg-primary-container text-on-primary font-bold border-2 border-primary-container">
                [ EXPERIMENTATION ]
              </span>
            </div>
            <div className="pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-surface-container-low text-primary font-hud-label text-hud-label uppercase px-6 py-3.5 border-2 border-primary shadow-brutal-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lime transition-all"
              >
                MORE ABOUT ME →
              </a>
            </div>
          </Reveal>
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 bg-surface-container-lowest border-2 border-primary p-6 shadow-brutal-lime flex flex-col gap-6"
          >
            <div className="flex items-center justify-between border-b-2 border-surface-container-high pb-3">
              <span className="font-hud-code text-[11px] text-primary-container font-bold">// TECH_STACK_MATRIX</span>
              <span className="font-hud-code text-[11px] text-on-surface-variant">LOC: JAKARTA // REMOTE</span>
            </div>
            <div className="relative w-full h-64 bg-surface-container border-2 border-surface-container-high overflow-hidden group">
              <img
                src={aboutPortrait}
                alt="IamFit portrait"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 bg-surface-container-lowest border border-primary px-2 py-1 font-hud-code text-[10px] text-primary-container">
                DEV_HANDLE: @IAMFIT
              </div>
            </div>
            <div className="flex flex-col gap-3 font-hud-code text-[12px]">
              <div className="flex justify-between border-b border-surface-container-high pb-1.5 gap-2">
                <span className="text-on-surface-variant">PRIMARY ENGINES:</span>
                <span className="text-primary text-right">Godot 4, Next.js 14, Laravel</span>
              </div>
              <div className="flex justify-between border-b border-surface-container-high pb-1.5 gap-2">
                <span className="text-on-surface-variant">LANGUAGES:</span>
                <span className="text-primary text-right">TypeScript, C#, PHP, GLSL, SQL</span>
              </div>
              <div className="flex justify-between border-b border-surface-container-high pb-1.5 gap-2">
                <span className="text-on-surface-variant">DESIGN SYSTEM:</span>
                <span className="text-primary text-right">Dark Neobrutalism / Monospace HUD</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">PHILOSOPHY:</span>
                <span className="text-primary-container font-bold text-right">SHIP WORKING SOFTWARE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
