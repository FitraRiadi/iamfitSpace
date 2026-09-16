import OrbitImages from './OrbitImages'
import { Reveal } from '../lib/anim'
import reactIcon from '../assets/svg/react.svg'
import laravelIcon from '../assets/svg/laravel.svg'
import tailwindIcon from '../assets/svg/tailwindcss.svg'
import postgresIcon from '../assets/svg/postgresql.svg'
import viteIcon from '../assets/svg/vite.svg'
import gitIcon from '../assets/svg/git.svg'
import githubIcon from '../assets/svg/github.svg'
import bootstrapIcon from '../assets/svg/bootstrap.svg'

const stacks = [
  { name: 'React', icon: reactIcon },
  { name: 'Laravel', icon: laravelIcon },
  { name: 'Tailwind CSS', icon: tailwindIcon },
  { name: 'PostgreSQL', icon: postgresIcon },
  { name: 'Vite', icon: viteIcon },
  { name: 'Git', icon: gitIcon },
  { name: 'GitHub', icon: githubIcon },
  { name: 'Bootstrap', icon: bootstrapIcon },
]

const images = stacks.map((s) => s.icon)

export default function TechStack() {
  return (
    <section id="stack" className="w-full bg-surface py-20 border-b-2 border-surface-container-high overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <Reveal className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-2 font-hud-label text-hud-label text-primary-container tracking-widest">
            <span>{'// 02 — TECH ARSENAL'}</span>
            <span className="text-on-surface-variant">:: [STACK_MATRIX]</span>
          </div>
          <h2 className="font-jersey text-6xl sm:text-7xl lg:text-8xl text-primary tracking-tight uppercase leading-none">
            TECHNOLOGY WE USE
          </h2>
          <p className="font-jakarta text-lg text-on-surface-variant leading-relaxed">
            Battle-tested tools running in permanent orbit around every build. Modern web stacks for speed,
            versioned everything, and boring-reliable infrastructure underneath — nothing here is a toy.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {stacks.map((s) => (
              <span
                key={s.name}
                className="font-hud-code text-hud-code px-3 py-1.5 bg-surface-container-high text-primary border-2 border-primary"
              >
                [{s.name.toUpperCase()}]
              </span>
            ))}
          </div>
          <div className="pt-2 font-hud-code text-hud-code text-primary-container">
            [08 MODULES // ORBIT ACTIVE]
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" y={32} delay={0.1}>
          <OrbitImages
            images={images}
            altPrefix="Tech stack logo"
            shape="ellipse"
            baseWidth={800}
              radiusX={300}
              radiusY={170}
            rotation={-8}
            duration={30}
            itemSize={72}
            responsive={true}
            showPath={true}
            pathColor="rgba(192,245,0,0.35)"
            pathWidth={2}
            centerContent={
              <div className="text-center">
                <div className="font-jersey text-3xl text-primary uppercase leading-none">STACK</div>
                <div className="font-hud-code text-[10px] text-primary-container font-bold">CORE // 08</div>
              </div>
            }
          />
        </Reveal>
      </div>
    </section>
  )
}
