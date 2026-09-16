import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

// Preloader — custom IamFit Space (inspired by React Bits Pro "stairs" variant,
// rebuilt theme-native so no Pro license / shadcn setup is needed).
// Full-screen overlay: centered text, then 10 lime stairs lift up one-by-one
// to reveal the page.
//
// Animation runs on GSAP with pixel values (measured from window.innerHeight),
// no percentage transforms, no framer-motion in this file.

const STAIR_COUNT = 10
const STAIR_STAGGER_S = 0.18
const STAIR_DUR_S = 0.5
const HOLD_MIN_MS = 600

export default function Preloader({ duration = 2500, loadingText = 'Build Everything.', onComplete }) {
  const [exiting, setExiting] = useState(false)
  const [faded, setFaded] = useState(false)
  const doneRef = useRef(false)
  const rootRef = useRef(null)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Lock scroll while loading
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (reduced) {
      // Reduced motion: no sliding stairs — hold the text so it feels
      // intentional, then a plain fade. (Never an instant snap.)
      const HOLD_REDUCED_MS = 1400
      const FADE_REDUCED_MS = 450
      const t1 = setTimeout(() => setFaded(true), HOLD_REDUCED_MS)
      const t2 = setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true
          onComplete?.()
        }
      }, HOLD_REDUCED_MS + FADE_REDUCED_MS)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }

    const stairs = rootRef.current?.querySelectorAll('.preloader-stair')
    if (!stairs || stairs.length === 0) {
      onComplete?.()
      return undefined
    }

    const exitMs = (STAIR_COUNT - 1) * STAIR_STAGGER_S * 1000 + STAIR_DUR_S * 1000
    const holdMs = Math.max(HOLD_MIN_MS, duration - exitMs)
    const liftPx = window.innerHeight + 8

    const tl = gsap.timeline({
      onComplete: () => {
        if (!doneRef.current) {
          doneRef.current = true
          onComplete?.()
        }
      },
    })
    // Hold: text on screen. Text stays until the stairs are almost done,
    // then fades in the last stretch.
    tl.to({}, { duration: holdMs / 1000 })
    tl.to(
      stairs,
      {
        y: -liftPx,
        duration: STAIR_DUR_S,
        ease: 'power3.inOut',
        stagger: STAIR_STAGGER_S,
      },
      '+=0.05'
    )
    tl.call(() => setExiting(true), null, '-=0.5')

    return () => {
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, duration])

  // Total visible time ≈ hold + stairs exit (≈ `duration`).

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[100] bg-surface-dim transition-opacity duration-500 ${faded ? 'opacity-0' : 'opacity-100'}`}
      role="status"
      aria-label="Loading IamFit Space"
    >
      {/* Stairs layer */}
      <div className="absolute inset-0 flex" aria-hidden="true">
        {Array.from({ length: STAIR_COUNT }, (_, i) => (
          <div
            key={i}
            className="preloader-stair flex-1 bg-primary-container border-r-2 border-surface-container-lowest last:border-r-0 will-change-transform"
          />
        ))}
      </div>

      {/* Content layer — text only, fades right as stairs start lifting */}
      <div
        className={`absolute inset-0 flex items-center justify-center px-6 transition-opacity duration-300 ${exiting ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="font-jersey text-6xl sm:text-7xl lg:text-8xl text-on-primary-fixed tracking-tight uppercase leading-none text-center">
          {loadingText}
        </span>
      </div>
    </div>
  )
}
