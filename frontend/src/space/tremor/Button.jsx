import { forwardRef } from 'react'
import { VscLoading } from 'react-icons/vsc'
import { cx, focusRing } from './cx'

// Tremor Raw Button — ported to JSX + dark neobrutalism:
// radius 0, flat, lime primary. API-compatible with our old Btn
// (variant primary/secondary/ghost + destructive), plus isLoading.
const VARIANTS = {
  primary: [
    'border-[#c0f500] bg-[#c0f500] text-[#161f00] font-bold',
    'hover:bg-[#d4ff4d] hover:border-[#d4ff4d]',
    'disabled:bg-[#353534] disabled:border-[#353534] disabled:text-[#a8b09a]',
  ].join(' '),
  secondary: [
    'border-[#353534] bg-[#201f1f] text-[#e5e2e1]',
    'hover:border-[#c0f500] hover:text-[#c0f500]',
    'disabled:text-[#a8b09a]/60',
  ].join(' '),
  ghost: [
    'border-transparent bg-transparent text-[#a8b09a]',
    'hover:text-[#e5e2e1] hover:bg-white/[0.04]',
    'disabled:text-[#a8b09a]/60',
  ].join(' '),
  destructive: [
    'border-[#ffb4ab] bg-[#ffb4ab] text-[#161f00] font-bold',
    'hover:opacity-80',
    'disabled:opacity-50',
  ].join(' '),
}

const Button = forwardRef(function Button(
  { variant = 'primary', isLoading = false, loadingText, className, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cx(
        'relative inline-flex items-center justify-center whitespace-nowrap border px-4 py-2.5 text-center font-mono text-[12px] tracking-wider uppercase transition-colors duration-100',
        'disabled:pointer-events-none',
        focusRing,
        VARIANTS[variant] || VARIANTS.primary,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="pointer-events-none flex shrink-0 items-center justify-center gap-2">
          <VscLoading className="size-4 shrink-0 animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingText || 'Loading'}</span>
          {loadingText || children}
        </span>
      ) : (
        children
      )}
    </button>
  )
})

export { Button }
export default Button
