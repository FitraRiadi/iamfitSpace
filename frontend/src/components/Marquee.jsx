import { motion } from 'framer-motion'
import { EASE } from '../lib/anim'

export default function Marquee() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="w-full bg-primary-container text-on-primary border-y-4 border-primary py-8 overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-2 hazard-stripes" />
      <div className="absolute bottom-0 left-0 w-full h-2 hazard-stripes" />
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col"
        >
          <span className="font-jersey text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-none text-on-primary">
            BUILD. BREAK. LEARN. SHIP.
          </span>
          <p className="font-hud-code text-hud-code font-bold tracking-wider text-on-primary uppercase mt-1">
            IamFit Space is a place to turn ideas into things that actually exist.
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="shrink-0 flex items-center gap-3"
        >
          <span className="w-4 h-4 bg-surface-container-lowest animate-bounce" />
          <span className="font-jersey text-3xl sm:text-4xl text-on-primary uppercase tracking-widest">NO COMPROMISE</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
