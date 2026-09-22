import { forwardRef } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cx, focusRing } from './cx'

// Tremor Raw Slider — ported: Radix behavior, square neobrutal thumb,
// lime range on dark track.
const Slider = forwardRef(function Slider({ className, ...props }, ref) {
  const value = props.value ?? props.defaultValue
  const count = Array.isArray(value) ? value.length : 1
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cx(
        'relative flex cursor-pointer touch-none select-none',
        "data-[orientation='horizontal']:w-full data-[orientation='horizontal']:items-center",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-fit data-[orientation='vertical']:justify-center",
        'data-disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cx(
          'relative grow overflow-hidden bg-[#2a2a2a]',
          "data-[orientation='horizontal']:h-1.5 data-[orientation='horizontal']:w-full",
          "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-1.5"
        )}
      >
        <SliderPrimitive.Range className="absolute bg-[#c0f500] data-[orientation='horizontal']:h-full data-[orientation='vertical']:w-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: count }).map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          aria-label={props['aria-label']}
          className={cx(
            'block size-[17px] shrink-0 border-2 border-[#c0f500] bg-[#0e0e0e] transition-colors',
            'hover:bg-[#c0f500]',
            'data-disabled:pointer-events-none data-disabled:border-[#353534] data-disabled:bg-[#353534]',
            focusRing,
            'outline-offset-0'
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
})

export { Slider }
export default Slider
