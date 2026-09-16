import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { staggerParent, staggerChild, EASE } from '../lib/anim'
import { scrollToSection } from '../lib/lenis.js'

const filters = ['ALL', 'SOURCE CODE', 'WEB TEMPLATES', 'READY APPS', 'UI / UX ASSETS', 'GAME ASSETS', 'DIGITAL PRODUCTS']

const products = [
  {
    cat: 'SOURCE CODE',
    meta: 'INSTANT ZIP',
    title: 'React Admin Starter',
    desc: 'High-performance production boilerplate equipped with dashboard layouts, authentication wrappers, dark mode, and customizable charts.',
    stack: 'React • Tailwind • Vite',
    price: 'Rp 149.000',
    tag: 'REACT_ADMIN_STARTER',
    lines: ['> pnpm install @iamfit/admin', '> ready in 218ms', '> auth: jwt + supabase ready'],
  },
  {
    cat: 'GAME ASSETS & CODE',
    meta: 'GODOT 4.X',
    title: 'Retro Rogue Game Kit',
    desc: 'Turnkey procedural dungeon crawling engine with tilemaps, finite state machines, player controller physics, and chiptune sound assets.',
    stack: 'Godot 4 • Sprite Sheets • Audio FX',
    price: 'Rp 189.000',
    tag: 'RETRO_ROGUE_KIT',
    lines: ['SPRITESHEETS + SFX PACK INCLUDED'],
  },
  {
    cat: 'WEB TEMPLATES',
    meta: 'ASTRO 4.0',
    title: 'Brutalist Dev Portfolio',
    desc: 'Aggressive, dark-mode personal portfolio template engineered with Astro for instant static page hydration and near-zero JS payload.',
    stack: 'Astro • Vanilla JS • Tailwind',
    price: 'Rp 99.000',
    tag: 'BRUTAL_PORTFOLIO_ASTRO',
    lines: ['LIGHTHOUSE 100/100/100/100'],
  },
]

export default function Store() {
  const [active, setActive] = useState('ALL')
  return (
    <section id="store" className="w-full bg-surface py-20 border-b-2 border-surface-container-high overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col gap-10">
        <SectionHeader
          code="// 04 — DIGITAL COMMERCE"
          tag=":: [COMMERCIAL_READY]"
          title="I BUILD IT. YOU CAN USE IT."
          desc="Digital products created directly from the battle-tested code of things I build. No filler, no toy boilerplate. Pure utility ready for production."
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-wrap gap-2 pt-2 font-hud-code text-hud-code"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={
                active === f
                  ? 'bg-primary-container text-on-primary font-bold px-4 py-2 border-2 border-primary-container shadow-brutal-dark'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:border-primary px-4 py-2 border-2 border-surface-container-high transition-colors'
              }
            >
              [ {f} ]
            </button>
          ))}
        </motion.div>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4"
        >
          <AnimatePresence mode="popLayout">
            {products.map((p) => (
              <motion.div
                key={p.title}
                variants={staggerChild}
                layout
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-surface-container-lowest border-2 border-primary p-6 flex flex-col justify-between shadow-brutal-white hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lime transition-all"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                    <span className="bg-surface-container-high text-primary-container px-2 py-0.5 font-hud-code text-[10px] font-bold uppercase tracking-wider">
                      {p.cat}
                    </span>
                    <span className="font-hud-code text-[11px] text-on-surface-variant">{p.meta}</span>
                  </div>
                  <div className="h-44 bg-surface-container-high border border-surface-container-highest relative overflow-hidden">
                    <div className="absolute inset-0 bg-surface-container-low p-4 flex flex-col justify-between">
                      <div className="font-hud-code text-xs text-primary-container">// {p.tag}</div>
                      <div className="space-y-1 font-hud-code text-[10px] text-on-surface-variant">
                        {p.lines.map((l) => (
                          <div key={l}>{l}</div>
                        ))}
                      </div>
                      <div className="w-full h-2 bg-primary-container" />
                    </div>
                  </div>
                  <h3 className="font-grotesk text-2xl text-primary uppercase font-bold">{p.title}</h3>
                  <p className="font-jakarta text-[13px] text-on-surface-variant">{p.desc}</p>
                  <div className="font-hud-code text-[11px] text-primary-container">{p.stack}</div>
                </div>
                <div className="pt-6 border-t-2 border-surface-container-high mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-hud-code text-[10px] text-on-surface-variant uppercase">PRICE</span>
                    <span className="font-jersey text-3xl text-primary">{p.price}</span>
                  </div>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection('#contact')
                    }}
                    className="inline-flex items-center justify-center bg-primary-container text-on-primary font-hud-label text-hud-label uppercase px-4 py-2.5 border-2 border-primary-container shadow-brutal-dark hover:bg-primary transition-colors"
                  >
                    VIEW PRODUCT →
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
