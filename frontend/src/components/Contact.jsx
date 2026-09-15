import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, staggerParent, staggerChild } from '../lib/anim'

export default function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <section id="contact" className="w-full bg-surface-dim py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col gap-12">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-surface-container-high pb-6 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-hud-label text-hud-label text-primary-container tracking-widest">
              <span>// 06 — SECURE INTAKE</span>
              <span className="text-on-surface-variant">:: [TERMINAL_TRANSMISSION]</span>
            </div>
            <h2 className="font-jersey text-6xl sm:text-7xl lg:text-8xl text-primary tracking-tight uppercase leading-none">
              HAVE SOMETHING TO BUILD?
            </h2>
          </div>
          <p className="font-jakarta text-[15px] text-on-surface-variant max-w-md">
            Let&apos;s turn an idea into something real. Available for select web architecture, game development prototypes,
            and digital product consulting.
          </p>
        </Reveal>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <motion.div
            variants={staggerChild}
            className="lg:col-span-7 bg-surface-container-lowest border-2 border-primary p-6 sm:p-8 shadow-brutal-white"
          >
            {sent ? (
              <div className="flex flex-col gap-3 font-hud-code text-primary">
                <span className="text-primary-container font-bold">[TRANSMISSION RECEIVED]</span>
                <p className="text-on-surface-variant">IamFit Core will review your payload shortly. Response within 24h.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 inline-flex w-fit bg-surface-container-high text-primary px-4 py-2 border-2 border-primary font-hud-label text-hud-label uppercase"
                >
                  SEND ANOTHER →
                </button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <div className="flex flex-col gap-2">
                  <label className="font-hud-code text-hud-code text-primary uppercase font-bold">OPERATOR_NAME / ORG:</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Satoshi / Apex Labs"
                    className="bg-surface-container-low border-2 border-surface-container-highest px-4 py-3 font-hud-code text-primary placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container focus:bg-surface-container transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-hud-code text-hud-code text-primary uppercase font-bold">
                    COMM_CHANNEL (EMAIL / DISCORD):
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="operator@network.com or user#0001"
                    className="bg-surface-container-low border-2 border-surface-container-highest px-4 py-3 font-hud-code text-primary placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container focus:bg-surface-container transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-hud-code text-hud-code text-primary uppercase font-bold">PROJECT CLASSIFICATION:</label>
                  <select className="bg-surface-container-low border-2 border-surface-container-highest px-4 py-3 font-hud-code text-primary focus:outline-none focus:border-primary-container focus:bg-surface-container transition-all">
                    <option>Full-Stack Web Development</option>
                    <option>GameDev / Godot 4 Prototype</option>
                    <option>Store Digital Asset Licensing</option>
                    <option>Technical Consultation & Review</option>
                    <option>Other Wild Experimentation</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-hud-code text-hud-code text-primary uppercase font-bold">PAYLOAD BRIEF & OBJECTIVE:</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Describe project requirements, tech stack constraints, and timeline targets..."
                    className="bg-surface-container-low border-2 border-surface-container-highest px-4 py-3 font-hud-code text-primary placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container focus:bg-surface-container transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center bg-primary-container text-on-primary-fixed font-hud-label text-hud-label uppercase py-4 border-2 border-primary-container shadow-brutal-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-white-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mt-2 cursor-pointer font-bold"
                >
                  TRANSMIT PAYLOAD →
                </button>
              </form>
            )}
          </motion.div>

          <motion.div variants={staggerChild} className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="bg-surface-container-low border-2 border-primary p-6 flex flex-col gap-4 shadow-brutal-lime">
              <h4 className="font-grotesk text-lg text-primary uppercase font-semibold">DIRECT CHANNELS</h4>
              <p className="font-jakarta text-[13px] text-on-surface-variant">
                Skip the queue for urgent architecture reviews or game publishing inquiries.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="mailto:core@iamfit.space"
                  className="flex items-center justify-between p-3 bg-surface-container border border-surface-container-high hover:border-primary-container transition-colors group"
                >
                  <span className="font-hud-code text-hud-code text-on-surface-variant">EMAIL:</span>
                  <span className="font-hud-code text-hud-code text-primary group-hover:text-primary-container font-bold">
                    core@iamfit.space
                  </span>
                </a>
                <div className="flex items-center justify-between p-3 bg-surface-container border border-surface-container-high hover:border-primary-container transition-colors group">
                  <span className="font-hud-code text-hud-code text-on-surface-variant">DISCORD:</span>
                  <span className="font-hud-code text-hud-code text-primary group-hover:text-primary-container font-bold">
                    iamfit.space
                  </span>
                </div>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-surface-container border border-surface-container-high hover:border-primary-container transition-colors group"
                >
                  <span className="font-hud-code text-hud-code text-on-surface-variant">GITHUB:</span>
                  <span className="font-hud-code text-hud-code text-primary group-hover:text-primary-container font-bold">@iamfit</span>
                </a>
              </div>
            </div>
            <div className="bg-surface-container-lowest border-2 border-surface-container-high p-6 flex flex-col gap-3 font-hud-code text-hud-code">
              <div className="flex items-center justify-between text-primary-container">
                <span className="font-bold">// COMM_RELAY_STATUS</span>
                <span>200_OK</span>
              </div>
              <p className="font-jakarta text-[13px] text-on-surface-variant">
                Average transmission response rate is within 24 hours during production cycles. Direct encrypted payloads are
                prioritized.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-primary">
                <span className="w-2 h-2 bg-primary-container inline-block" />
                PUBLIC ENCRYPTION KEY: 0x98AF...7C12
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
