import { forwardRef } from 'react'
import * as SelectPrimitives from '@radix-ui/react-select'
import { VscChevronDown, VscChevronUp, VscCheck } from 'react-icons/vsc'
import { cx } from './cx'

// Tremor Raw Select — ported: Radix behavior, flat dark panels, lime accents.
// NOTE: content renders in a portal above modals (z-140) with Lenis opt-out.
const Select = SelectPrimitives.Root
const SelectGroup = SelectPrimitives.Group
const SelectValue = SelectPrimitives.Value

const SelectTrigger = forwardRef(function SelectTrigger({ className, hasError, children, ...props }, ref) {
  return (
    <SelectPrimitives.Trigger
      ref={ref}
      className={cx(
        'group/trigger flex w-full select-none items-center justify-between gap-2 truncate border bg-[#0e0e0e] px-3 py-2.5 text-[13px] text-[#e5e2e1] outline-none transition-colors',
        'border-[#353534] hover:border-[#a8b09a]',
        'data-placeholder:text-[#a8b09a]/50',
        'data-disabled:opacity-50',
        'focus:border-[#c0f500]',
        hasError ? 'border-[#ffb4ab]' : '',
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <SelectPrimitives.Icon asChild>
        <VscChevronDown className="size-4 shrink-0 text-[#a8b09a]" />
      </SelectPrimitives.Icon>
    </SelectPrimitives.Trigger>
  )
})

const SelectContent = forwardRef(function SelectContent(
  { className, position = 'popper', children, sideOffset = 8, collisionPadding = 10, ...props },
  ref
) {
  return (
    <SelectPrimitives.Portal>
      <SelectPrimitives.Content
        ref={ref}
        sideOffset={sideOffset}
        position={position}
        collisionPadding={collisionPadding}
        className={cx(
          'relative z-[140] max-h-[var(--radix-select-content-available-height)] min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw] overflow-hidden border border-[#353534] bg-[#1c1b1b] text-[#e5e2e1]',
          className
        )}
        {...props}
      >
        <SelectPrimitives.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
          <VscChevronUp className="size-3 shrink-0" aria-hidden="true" />
        </SelectPrimitives.ScrollUpButton>
        <SelectPrimitives.Viewport data-lenis-prevent className="p-1">
          {children}
        </SelectPrimitives.Viewport>
        <SelectPrimitives.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
          <VscChevronDown className="size-3 shrink-0" aria-hidden="true" />
        </SelectPrimitives.ScrollDownButton>
      </SelectPrimitives.Content>
    </SelectPrimitives.Portal>
  )
})

const SelectLabel = forwardRef(function SelectLabel({ className, ...props }, ref) {
  return (
    <SelectPrimitives.Label
      ref={ref}
      className={cx(
        'px-3 py-2 font-mono text-[11px] font-bold tracking-[0.15em] text-[#a8b09a] uppercase',
        className
      )}
      {...props}
    />
  )
})

const SelectItem = forwardRef(function SelectItem({ className, children, ...props }, ref) {
  return (
    <SelectPrimitives.Item
      ref={ref}
      className={cx(
        'grid cursor-pointer grid-cols-[1fr_20px] gap-x-2 px-3 py-2 text-[13px] outline-none transition-colors',
        'text-[#e5e2e1] data-disabled:pointer-events-none data-disabled:text-[#a8b09a]/50',
        'focus:bg-[#c0f500]/10 focus:text-[#c0f500]',
        'data-[state=checked]:font-bold data-[state=checked]:text-[#c0f500]',
        className
      )}
      {...props}
    >
      <SelectPrimitives.ItemText className="flex-1 truncate">
        {children}
      </SelectPrimitives.ItemText>
      <SelectPrimitives.ItemIndicator>
        <VscCheck className="size-5 shrink-0 text-[#c0f500]" aria-hidden="true" />
      </SelectPrimitives.ItemIndicator>
    </SelectPrimitives.Item>
  )
})

const SelectSeparator = forwardRef(function SelectSeparator({ className, ...props }, ref) {
  return (
    <SelectPrimitives.Separator
      ref={ref}
      className={cx('-mx-1 my-1 h-px bg-[#2a2a2a]', className)}
      {...props}
    />
  )
})

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
export default Select
