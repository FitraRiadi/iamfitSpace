import { forwardRef } from 'react'
import * as RadioGroupPrimitives from '@radix-ui/react-radio-group'
import { cx, focusRing } from './cx'

// Tremor Raw RadioGroup — ported: square neobrutal radios, lime check.
const RadioGroup = forwardRef(function RadioGroup({ className, ...props }, ref) {
  return (
    <RadioGroupPrimitives.Root
      ref={ref}
      className={cx('grid gap-2', className)}
      {...props}
    />
  )
})

const RadioGroupItem = forwardRef(function RadioGroupItem({ className, children, ...props }, ref) {
  return (
    <label
      className={cx(
        'flex cursor-pointer items-center gap-3 border px-3 py-2.5 transition-colors',
        'border-[#353534] bg-[#0e0e0e] hover:border-[#a8b09a]',
        'has-checked:border-[#c0f500] has-checked:bg-[#c0f500]/10',
        className
      )}
    >
      <RadioGroupPrimitives.Item
        ref={ref}
        className={cx(
          'group relative flex size-4 shrink-0 appearance-none items-center justify-center outline-none',
          focusRing
        )}
        {...props}
      >
        <span
          className={cx(
            'flex size-4 shrink-0 items-center justify-center border-2 transition-colors',
            'border-[#353534] bg-[#0e0e0e]',
            'group-data-[state=checked]:border-[#c0f500] group-data-[state=checked]:bg-[#c0f500]'
          )}
        >
          <RadioGroupPrimitives.Indicator className="flex items-center justify-center">
            <span className="size-1.5 shrink-0 bg-[#161f00]" />
          </RadioGroupPrimitives.Indicator>
        </span>
      </RadioGroupPrimitives.Item>
      <span className="flex-1 text-[13px]">{children}</span>
    </label>
  )
})

export { RadioGroup, RadioGroupItem }
export default RadioGroup
