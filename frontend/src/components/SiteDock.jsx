import { useState, useEffect } from 'react'
import { VscHome, VscLayers, VscCode, VscArchive, VscPulse, VscAccount, VscMail } from 'react-icons/vsc'
import Dock from './Dock'

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

export default function SiteDock() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 max-w-[100vw] px-2">
      <Dock
        items={items}
        panelHeight={isMobile ? 50 : 60}
        baseItemSize={isMobile ? 32 : 44}
        magnification={isMobile ? 46 : 64}
        distance={isMobile ? 120 : 200}
      />
    </div>
  )
}
