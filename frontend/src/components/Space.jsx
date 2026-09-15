import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { staggerParent, staggerChild } from '../lib/anim'

const branches = [
  {
    id: 'BRANCH_01',
    meta: 'DEV // WEB',
    icon: '</>',
    title: 'IAMFIT WEB DEV',
    desc: 'Websites, web applications, client solutions, and high-performance web systems tailored for scale, speed, and clean typography.',
    tags: ['React', 'Next.js', 'Laravel', 'TailwindCSS'],
    cta: 'EXPLORE',
    href: '#work',
  },
  {
    id: 'BRANCH_02',
    meta: 'GAME // ENGINE',
    icon: '♦',
    title: 'IAMFIT GAMEDEV',
    desc: 'Indie games, prototypes, interactive physics experiments, and retro cybernetic combat worlds crafted with pixel-level tactile feedback.',
    tags: ['Godot 4', 'C#', 'GLSL', 'Pixel Art'],
    cta: 'PLAY / EXPLORE',
    href: '#work',
  },
  {
    id: 'BRANCH_03',
    meta: 'PROD // SHOP',
    icon: '$',
    title: 'IAMFIT STORE',
    desc: 'Production source code, battle-tested templates, ready-to-deploy web apps, UI kits, and digital developer productivity assets.',
    tags: ['Commercial License', 'Instant DL'],
    cta: 'SHOP',
    href: '#store',
  },
  {
    id: 'BRANCH_04',
    meta: 'EXP // R&D',
    icon: '◊',
    title: 'IAMFIT LABS',
    desc: 'Unhinged experiments, computer graphics research, algorithmic generation, and bleeding-edge WebGL interactive sandboxes.',
    tags: ['WebGL', 'Canvas API', 'Shaders', 'AI Exp'],
    cta: 'ENTER LABS',
    href: '#status',
  },
]

export default function Space() {
  return (
    <section id="space" className="w-full bg-surface py-20 border-b-2 border-surface-container-high">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col gap-12">
        <SectionHeader
          code="// 01 — DISPATCH MODULE"
          tag=":: [STRUCT_UNIFIED]"
          title="ONE SPACE. MULTIPLE WORLDS."
          desc="IamFit Space is the unified home for everything built, managed, and shipped. No fractured identities. Every line of code, game build, and released product originates here."
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {branches.map((b) => (
            <motion.div
              key={b.id}
              variants={staggerChild}
              className="bg-surface-container-low border-2 border-primary p-6 flex flex-col justify-between shadow-brutal-white hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lime transition-all"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-surface-container-high pb-3 font-hud-code text-hud-code">
                  <span className="text-primary-container font-bold">[ {b.id} ]</span>
                  <span className="text-on-surface-variant">{b.meta}</span>
                </div>
                <div className="w-10 h-10 bg-primary-container text-on-primary flex items-center justify-center font-hud-label font-bold text-lg border border-primary-container">
                  {b.icon}
                </div>
                <h3 className="font-grotesk text-2xl text-primary uppercase font-bold">{b.title}</h3>
                <p className="font-jakarta text-[13px] text-on-surface-variant">{b.desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {b.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-hud-code px-2 py-0.5 bg-surface-container border border-surface-container-highest text-on-surface"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-8">
                <a
                  href={b.href}
                  className="inline-flex w-full items-center justify-between bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary font-hud-label text-hud-label uppercase px-4 py-3 border-2 border-primary transition-colors"
                >
                  <span>{b.cta}</span>
                  <span>→</span>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
