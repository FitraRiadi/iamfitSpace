import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { staggerParent, staggerChild } from '../lib/anim'
import ScrambledText from './ScrambledText'
import CircularText from './CircularText'
import TiltedCard from './TiltedCard'
import meImg from '../assets/me.png'
import { scrollToSection } from '../lib/lenis.js'

const PHRASES = ['Web Development.', 'Game Development.', 'App Development.', 'Digital Products.']
const PIN_VH = 220

function useTypewriter(phrases = PHRASES, typeSpeed = 90, deleteSpeed = 45, pause = 1400) {
  const [text, setText] = useState('')
  useEffect(() => {
    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timer

    const tick = () => {
      const current = phrases[phraseIndex]
      if (!deleting) {
        charIndex += 1
        setText(current.slice(0, charIndex))
        if (charIndex === current.length) {
          deleting = true
          timer = setTimeout(tick, pause)
          return
        }
        timer = setTimeout(tick, typeSpeed)
      } else {
        charIndex -= 1
        setText(current.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % phrases.length
          timer = setTimeout(tick, 350)
          return
        }
        timer = setTimeout(tick, deleteSpeed)
      }
    }

    timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [phrases, typeSpeed, deleteSpeed, pause])

  return text
}

function go(e, href) {
  e.preventDefault()
  scrollToSection(href)
}

function HeroTop() {
  const typed = useTypewriter()
  return (
    <div className="relative max-w-7xl mx-auto px-4 lg:px-12 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="lg:col-span-8 flex flex-col gap-3"
        >
          <motion.h1
            variants={staggerChild}
            className="font-jersey text-6xl sm:text-7xl lg:text-8xl tracking-tight text-primary leading-none uppercase"
          >
            <span className="lg:whitespace-nowrap">BUILDING DIGITAL</span> <span className="text-primary-container block">WORLDS.</span>
          </motion.h1>
          <motion.p
            variants={staggerChild}
            className="font-grotesk text-2xl text-primary font-semibold tracking-tight min-h-[2rem]"
          >
            <span>{typed}</span>
            <span className="inline-block w-[3px] h-[1.1em] bg-primary-container ml-1 align-middle animate-pulse" />
          </motion.p>
          <motion.div
            variants={staggerChild}
            className="sm:hidden font-jakarta text-[15px] text-on-surface-variant leading-relaxed"
          >
            Websites, games, apps & digital products — engineered with zero fluff.
          </motion.div>
          <motion.div
            variants={staggerChild}
            className="hidden sm:block font-jakarta text-lg text-on-surface-variant max-w-3xl leading-relaxed"
          >
            <ScrambledText
              className="scrambled-sub"
              radius={20}
              duration={0.9}
              speed={0.6}
              scrambleChars=".:"
            >
              <>I build websites, games, applications, and digital products under the IamFit ecosystem. A developer&apos;s personal digital headquarters engineered with raw speed, mechanical precision, and zero corporate fluff.</>
            </ScrambledText>
          </motion.div>
          <motion.div variants={staggerChild} className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#work"
              onClick={(e) => go(e, '#work')}
              className="inline-flex items-center justify-center bg-primary-container text-on-primary-fixed font-hud-label text-hud-label uppercase px-7 py-3 border-2 border-primary-container shadow-brutal-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-white-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              EXPLORE MY WORK →
            </a>
            <a
              href="#store"
              onClick={(e) => go(e, '#store')}
              className="inline-flex items-center justify-center bg-surface-container-low text-primary font-hud-label text-hud-label uppercase px-7 py-3 border-2 border-primary shadow-brutal-lime hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lime-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              VISIT IAMFIT STORE →
            </a>
            <div className="hidden sm:flex items-center gap-2 pl-2">
              <span className="w-3 h-3 border border-primary-container flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-primary-container" />
              </span>
              <span className="font-hud-code text-hud-code text-on-surface-variant">READY TO DEPLOY</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="lg:col-span-4 w-full max-w-[150px] sm:max-w-[260px] lg:max-w-[300px] mx-auto lg:mx-0 lg:justify-self-end lg:self-start mt-2 lg:mt-2"
        >
          <div className="relative aspect-[719/1024] w-full">
            {/* CircularText — 1 layer di belakang kepala me.png */}
            <div
              className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 ml-0 max-sm:-ml-1 sm:-ml-2 z-0 pointer-events-auto"
              aria-hidden="true"
            >
              <CircularText
                text="IAMFIT*SPACE*FITRA*RIADI*"
                onHover="speedUp"
                spinDuration={14}
                className="hero-circular-badge"
              />
            </div>
            <div className="relative z-10 w-full h-full">
              <TiltedCard
                imageSrc={meImg}
                altText="Pixel portrait of IamFit"
                captionText="@IAMFIT // OPERATOR"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.08}
                showMobileWarning={false}
                showTooltip={true}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Ecosystem() {
  return (
    <div className="relative max-w-7xl mx-auto px-4 lg:px-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full bg-surface-container-lowest border-2 border-primary p-4 sm:p-6 lg:p-8 shadow-brutal-lime relative"
      >
        <div className="absolute top-1 left-1 text-[10px] font-hud-code text-primary-container font-bold">+00.00</div>
        <div className="absolute top-1 right-1 text-[10px] font-hud-code text-primary-container font-bold">128.00+</div>
        <div className="absolute bottom-1 left-1 text-[10px] font-hud-code text-on-surface-variant font-bold">SYS_MAP_OK</div>
        <div className="absolute bottom-1 right-1 text-[10px] font-hud-code text-on-surface-variant font-bold">[RADIAL_HUD]</div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-2 border-surface-container-high pb-4 mb-6 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-jersey text-3xl text-primary-container">ECOSYSTEM ARCHITECTURE</span>
            <span className="bg-surface-container-high px-2 py-0.5 font-hud-code text-[11px] text-primary border border-surface-container-highest uppercase">
              ONE SPACE → MULTIPLE WORLDS
            </span>
          </div>
          <div className="flex items-center gap-4 font-hud-code text-hud-code text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-primary-container inline-block" /> CORE BUS ACTIVE
            </span>
            <span>TOPOLOGY: DECENTRALIZED</span>
          </div>
        </div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
        >
          <motion.div
            variants={staggerChild}
            className="eco-cursor-target md:col-span-3 bg-surface-container-low border-2 border-surface-container-high p-4 flex flex-col gap-2 hover:border-primary-container transition-colors group"
          >
            <div className="flex items-center justify-between font-hud-code text-[11px] text-on-surface-variant">
              <span>NODE_A // 01</span>
              <span className="text-primary-container group-hover:underline">STABLE</span>
            </div>
            <h4 className="font-grotesk text-lg text-primary uppercase font-semibold">IAMFIT WEB DEV</h4>
            <p className="font-jakarta text-[13px] text-on-surface-variant">
              Full-stack web architecture, reactive portals, Next.js, and high-load backend APIs.
            </p>
            <div className="pt-2 border-t border-surface-container-high font-hud-code text-[10px] text-primary-container uppercase">
              NEXT.JS // POSTGRES // LARAVEL
            </div>
          </motion.div>

          <div className="hidden md:flex md:col-span-1 items-center justify-center">
            <div className="w-full border-t-2 border-dashed border-surface-container-high relative">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary-container" />
            </div>
          </div>

          <motion.div
            variants={staggerChild}
            className="eco-cursor-target md:col-span-4 bg-surface-container border-2 border-primary-container p-6 text-center shadow-brutal-lime relative my-2 md:my-0"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary font-hud-code text-[10px] px-3 py-0.5 font-bold uppercase tracking-wider">
              COMMAND NEXUS
            </div>
            <div className="flex justify-center items-center gap-2 mb-2">
              <span className="w-3 h-3 bg-primary-container animate-ping" />
              <span className="font-jersey text-4xl text-primary uppercase tracking-wide">IAMFIT SPACE</span>
            </div>
            <p className="font-hud-code text-hud-code text-primary-container uppercase mb-3">[ CORE HEADQUARTERS ]</p>
            <p className="font-jakarta text-[13px] text-on-surface-variant">
              Central routing console dispatching engineering, playable experiences, tools, and digital inventory.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-surface-container-lowest px-3 py-1 border border-surface-container-high font-hud-code text-[11px] text-primary">
              <span className="text-primary-container">•</span> DISPATCH: ONLINE (100%)
            </div>
          </motion.div>

          <div className="hidden md:flex md:col-span-1 items-center justify-center">
            <div className="w-full border-t-2 border-dashed border-surface-container-high relative">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary-container" />
            </div>
          </div>

          <motion.div
            variants={staggerChild}
            className="eco-cursor-target md:col-span-3 bg-surface-container-low border-2 border-surface-container-high p-4 flex flex-col gap-2 hover:border-primary-container transition-colors group"
          >
            <div className="flex items-center justify-between font-hud-code text-[11px] text-on-surface-variant">
              <span>NODE_B // 02</span>
              <span className="text-primary-container group-hover:underline">LIVE ENGINE</span>
            </div>
            <h4 className="font-grotesk text-lg text-primary uppercase font-semibold">IAMFIT GAMEDEV</h4>
            <p className="font-jakarta text-[13px] text-on-surface-variant">
              Indie games, Godot 4 shaders, combat physics, retro pixel violence, and experimental mechanics.
            </p>
            <div className="pt-2 border-t border-surface-container-high font-hud-code text-[10px] text-primary-container uppercase">
              GODOT 4 // C# // GLSL // 2D/3D
            </div>
          </motion.div>

          <motion.div
            variants={staggerChild}
            className="eco-cursor-target md:col-span-6 bg-surface-container-low border-2 border-surface-container-high p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary transition-colors"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-hud-code text-[11px] text-on-surface-variant">
                <span>NODE_C // 03</span>
                <span className="text-primary-container">[INVENTORY SYSTEM]</span>
              </div>
              <h4 className="font-grotesk text-lg text-primary uppercase font-semibold">IAMFIT STORE</h4>
              <p className="font-jakarta text-[13px] text-on-surface-variant">
                Direct commercial licensing for boilerplate repos, ready-to-run apps, and UI kits.
              </p>
            </div>
            <span className="shrink-0 font-hud-code text-[11px] bg-surface-container-high border border-surface-container-highest px-3 py-1.5 text-primary text-center">
              COMMERCIAL CODE →
            </span>
          </motion.div>

          <motion.div
            variants={staggerChild}
            className="eco-cursor-target md:col-span-6 bg-surface-container-low border-2 border-surface-container-high p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary transition-colors"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-hud-code text-[11px] text-on-surface-variant">
                <span>NODE_D // 04</span>
                <span className="text-primary-container">[EXPERIMENTAL SANDBOX]</span>
              </div>
              <h4 className="font-grotesk text-lg text-primary uppercase font-semibold">IAMFIT LABS</h4>
              <p className="font-jakarta text-[13px] text-on-surface-variant">
                WebGL prototypes, algorithmic animations, generative visual synthesizers, and AI experiments.
              </p>
            </div>
            <span className="shrink-0 font-hud-code text-[11px] bg-surface-container-high border border-surface-container-highest px-3 py-1.5 text-primary text-center">
              R&D ARCHIVE →
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const pinRef = useRef(null)
  const { scrollYProgress } = useScroll(
    reduced ? {} : { target: pinRef, offset: ['start start', 'end end'] }
  )

  const zoom = useTransform(scrollYProgress, [0, 1], [1, 2.4])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const vis = useTransform(scrollYProgress, (p) => (p > 0.85 ? 'hidden' : 'visible'))
  const pe = useTransform(fade, (o) => (o > 0.15 ? 'auto' : 'none'))
  const hint = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  const gridBg = (
    <div
      className="absolute inset-0 opacity-15 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(to right, #353534 1px, transparent 1px), linear-gradient(to bottom, #353534 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />
  )

  if (reduced) {
    return (
      <section id="top" className="relative w-full border-b-2 border-surface-container-high bg-surface-dim overflow-hidden">
        {gridBg}
        <div className="relative max-w-7xl mx-auto px-4 lg:px-12 pt-4 pb-16 lg:pt-8 lg:pb-20 flex flex-col gap-12">
          <HeroTop />
          <Ecosystem />
        </div>
      </section>
    )
  }

  return (
    <section id="top" className="relative w-full border-b-2 border-surface-container-high bg-surface-dim overflow-x-clip">
      {/* Mini pin: hero top zooms inward, then releases to normal flow */}
      <div ref={pinRef} className="relative" style={{ height: `${PIN_VH}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          {gridBg}
          <motion.div
            style={{ scale: zoom, opacity: fade, pointerEvents: pe, visibility: vis }}
            className="absolute inset-0 flex items-start will-change-transform"
          >
          <div className="w-full pt-12 lg:pt-14 pb-6">
            <HeroTop />
          </div>
        </motion.div>
          <motion.div
            style={{ opacity: hint }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
          >
            <span className="font-hud-code text-[11px] text-primary-container tracking-widest">SCROLL TO DIVE</span>
            <span className="w-2 h-2 bg-primary-container animate-bounce" />
          </motion.div>
        </div>
      </div>
      {/* Ecosystem flows normally underneath */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-12 pb-16 lg:pb-20">
        <Ecosystem />
      </div>
    </section>
  )
}
