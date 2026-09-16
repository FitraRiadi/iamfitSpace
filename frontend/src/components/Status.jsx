import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { staggerParent, staggerChild } from '../lib/anim'

const bars = [
  { name: 'OSB // WEB DEVELOPMENT', pct: 80, label: '[████████░░] 80% COMPLETE', log: '> Finalizing database migrations & offline-first student sync portal cache layers.' },
  { name: 'KNIGHT BATTLE // GAMEDEV', pct: 60, label: '[██████░░░░] 60% COMPLETE', log: '> Boss AI behavior tree states, parry window hitbox calibration, and gamepad vibration rumble hooks.' },
  { name: 'IAMFIT SPACE // PLATFORM', pct: 40, label: '[████░░░░░░] 40% COMPLETE', log: '> Automated store checkout webhook pipeline & interactive web terminal emulator integration.' },
  { name: 'NEURAL SHADER LAB // LABS', pct: 90, label: '[█████████░] 90% COMPLETE', log: '> Audio-reactive WebGL fragment shader sandbox with audio spectrum FFT texture pass.' },
]

const metrics = [
  { k: 'ACTIVE REPOSITORIES', v: '14 REPOS', lime: false },
  { k: 'LINES SHIPPED (2026)', v: '148,200', lime: true },
  { k: 'SYSTEM CAFFEINE', v: '94% FUEL', lime: false },
  { k: 'SERVER HEALTH', v: 'ALL GREEN', lime: true },
]

export default function Status() {
  return (
    <section id="status" className="w-full bg-surface-dim py-20 border-b-2 border-surface-container-high overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col gap-10">
        <SectionHeader
          code="// 05 — LIVE TELEMETRY"
          tag=":: [BIOS_KERNEL_STATUS]"
          title="CURRENTLY BUILDING"
          desc="Live snapshot from my active working directories and development pipelines. Real work in progress, updated directly from repo activity."
        />
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-surface-container-lowest border-2 border-primary p-6 lg:p-8 shadow-brutal-lime relative"
        >
          <div className="flex flex-wrap items-center justify-between border-b-2 border-surface-container-high pb-4 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-error inline-block" />
              <span className="w-3 h-3 bg-primary-container inline-block" />
              <span className="w-3 h-3 bg-primary inline-block" />
              <span className="font-hud-code text-hud-code text-primary font-bold ml-2">IAMFIT_KERNEL_v1.0.4 :: WORKBENCH</span>
            </div>
            <div className="flex items-center gap-6 font-hud-code text-hud-code">
              <span className="text-on-surface-variant">UPTIME: 142h 19m</span>
              <span className="text-primary-container font-bold">ALL SERVICES OPERATIONAL</span>
            </div>
          </div>
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-6"
          >
            {bars.map((b) => (
              <motion.div key={b.name} variants={staggerChild} className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-hud-code text-hud-code">
                  <span className="text-primary font-bold">{b.name}</span>
                  <span className="text-primary-container">{b.label}</span>
                </div>
                <div className="w-full h-3 bg-surface-container border border-surface-container-highest flex p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="h-full bg-primary-container"
                  />
                </div>
                <p className="font-hud-code text-[12px] text-on-surface-variant">{b.log}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-8 border-t-2 border-surface-container-high"
          >
            {metrics.map((m) => (
              <motion.div
                key={m.k}
                variants={staggerChild}
                className="bg-surface-container-low border border-surface-container-highest p-3 flex flex-col"
              >
                <span className="font-hud-code text-[10px] text-on-surface-variant uppercase">{m.k}</span>
                <span className={`font-hud-code text-[22px] leading-6 font-bold ${m.lime ? 'text-primary-container' : 'text-primary'}`}>
                  {m.v}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
