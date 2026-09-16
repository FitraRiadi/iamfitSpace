import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { VscHome, VscLayers, VscCode, VscArchive, VscPulse, VscAccount, VscMail } from 'react-icons/vsc'
import Dock from './Dock'
import { EASE } from '../lib/anim'

const scrollTo = (href) => {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const items = [
  { icon: <VscHome size={20} />, label: 'TOP', onClick: () => scrollTo('#top') },
  { icon: <VscLayers size={20} />, label: 'SPACE', onClick: () => scrollTo('#space') },
  { icon: <VscCode size={20} />, label: 'WORK', onClick: () => scrollTo('#work') },
  { icon: <VscArchive size={20} />, label: 'STORE', onClick: () => scrollTo('#store') },
  { icon: <VscPulse size={20} />, label: 'STATUS', onClick: () => scrollTo('#status') },
  { icon: <VscAccount size={20} />, label: 'ABOUT', onClick: () => scrollTo('#about') },
  { icon: <VscMail size={20} />, label: 'CONTACT', onClick: () => scrollTo('#contact') },
]

export default function SiteDock({ intro = true }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <motion.div
      className="fixed bottom-3 left-1/2 z-50 max-w-[100vw] px-2"
      initial={{ opacity: 0, y: 48, x: '-50%' }}
      animate={intro ? { opacity: 1, y: 0, x: '-50%' } : { opacity: 0, y: 48, x: '-50%' }}
      transition={{ duration: 0.6, ease: EASE, delay: intro ? 0.5 : 0 }}
    >
      <Dock
        items={items}
        panelHeight={isMobile ? 50 : 60}
        baseItemSize={isMobile ? 32 : 44}
        magnification={isMobile ? 46 : 64}
        distance={isMobile ? 120 : 200}
      />
    </motion.div>
  )
}
