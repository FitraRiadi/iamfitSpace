import { Reveal } from '../lib/anim'

export default function SectionHeader({ code, tag, title, desc }) {
  return (
    <Reveal className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-surface-container-high pb-6 gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 font-hud-label text-hud-label text-primary-container tracking-widest">
          <span>{code}</span>
          <span className="text-on-surface-variant">{tag}</span>
        </div>
        <h2 className="font-jersey text-6xl sm:text-7xl lg:text-8xl text-primary tracking-tight uppercase leading-none">
          {title}
        </h2>
      </div>
      {desc && (
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          {desc}
        </p>
      )}
    </Reveal>
  )
}
