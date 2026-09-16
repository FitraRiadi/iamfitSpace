// Lenis smooth-scroll singleton.
// Created once in main.jsx. Components use getLenis() / scrollToSection()
// so anchor navigation stays smooth under Lenis instead of fighting it
// with native scrollIntoView.

import Lenis from 'lenis'

let lenis = null
let rafId = 0

export function initLenis(options = {}) {
  if (lenis) return lenis
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, ...options })
  const raf = (time) => {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
  return lenis
}

export function getLenis() {
  return lenis
}

export function destroyLenis() {
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  lenis = null
}

export function scrollToSection(target, options = {}) {
  const l = getLenis()
  if (typeof target === 'number') {
    if (l) {
      l.scrollTo(target, { duration: 1.4, ...options })
      return
    }
    window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }
  if (l) {
    l.scrollTo(target, { duration: 1.4, ...options })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
}
