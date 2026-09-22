import { forwardRef } from 'react'
import { cx, focusRing } from './cx'

// Tremor Raw Input/Textarea pattern — ported: flat dark fields, lime focus,
// red error state. Drop-in for native inputs (same props API).
const fieldBase = [
  'w-full bg-[#0e0e0e] border px-3 py-2.5 text-[13px] text-[#e5e2e1]',
  'placeholder:text-[#a8b09a]/50 transition-colors',
  'disabled:opacity-50',
  focusRing,
]

const Input = forwardRef(function Input({ className, hasError, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cx(
        fieldBase,
        hasError ? 'border-[#ffb4ab]' : 'border-[#353534] hover:border-[#a8b09a] focus:border-[#c0f500]',
        className
      )}
      {...props}
    />
  )
})

const Textarea = forwardRef(function Textarea({ className, hasError, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cx(
        fieldBase,
        'resize-none',
        hasError ? 'border-[#ffb4ab]' : 'border-[#353534] hover:border-[#a8b09a] focus:border-[#c0f500]',
        className
      )}
      {...props}
    />
  )
})

export { Input, Textarea }
export default Input
