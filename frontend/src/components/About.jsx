import { motion } from 'framer-motion'
import { Reveal } from '../lib/anim'
import TiltedCard from './TiltedCard'
import meImg from '../assets/me.png'

const badges = ['[ WEB DEVELOPMENT ]', '[ GAME DEVELOPMENT ]', '[ UI / UX ]', '[ DIGITAL PRODUCTS ]']

export default function About() {
  return (
    <section id="about" className="w-full bg-surface py-20 border-b-2 border-surface-container-high overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <Reveal className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2 font-hud-label text-hud-label text-primary-container tracking-widest">
              <span>// 06 — IDENTITY & CODEBASE</span>
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
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="aspect-[445/561] w-full">
              <TiltedCard
                imageSrc={meImg}
                altText="Pixel portrait of IamFit"
                captionText="@IAMFIT // OPERATOR"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={10}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <span className="bg-surface-container-lowest border border-primary px-2 py-1 font-hud-code text-[10px] font-bold text-primary-container">
                    DEV_HANDLE: Fitra Riadi
                  </span>
                }
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
