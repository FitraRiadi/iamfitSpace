import { AnimatePresence, motion } from 'framer-motion'
import { useTasks } from '../lib/tasks'
import StatusMark from './StatusMark'

const MAX_SHOW = 6

function Item({ task, onDismiss }) {
  const failed = task.status === 'failed'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80, transition: { duration: 0.25, ease: 'easeIn' } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-center gap-2.5 bg-[#1c1b1b] border border-[#353534] pl-3 pr-2 py-2 min-w-[240px] max-w-[320px] shadow-[4px_4px_0px_rgba(0,0,0,0.55)] pointer-events-auto"
    >
      <StatusMark
        status={task.status}
        progress={task.progress}
        size={18}
        fontSize={12}
        color="#a8b09a"
        doneColor="#c0f500"
        errorColor="#ffb4ab"
      />
      <span className="flex-1 min-w-0 font-mono text-[12px] text-[#e5e2e1] truncate">
        {task.label}
      </span>
      {failed && (
        <button
          onClick={() => onDismiss(task.id)}
          aria-label="Dismiss"
          className="font-mono text-[#a8b09a] hover:text-[#e5e2e1] text-sm leading-none px-1 shrink-0"
        >
          ✕
        </button>
      )}
    </motion.div>
  )
}

export default function TaskStack() {
  const { tasks, remove } = useTasks()
  const visible = tasks.slice(0, MAX_SHOW)
  const extra = tasks.length - visible.length
  if (!visible.length) return null
  return (
    <div className="fixed bottom-5 right-5 z-[140] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence initial={false}>
        {visible.map((t) => (
          <Item key={t.id} task={t} onDismiss={remove} />
        ))}
      </AnimatePresence>
      {extra > 0 && (
        <div className="font-mono text-[11px] text-[#a8b09a] bg-[#0e0e0e] border border-[#2a2a2a] px-2.5 py-1">
          +{extra} MORE
        </div>
      )}
    </div>
  )
}
