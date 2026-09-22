import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

// cx() — Tremor Raw util (ported): join classes, resolve conflicts.
export function cx(...args) {
  return twMerge(clsx(...args))
}

// Lime focus ring for the dark neobrutalist console.
export const focusRing =
  'outline outline-offset-2 outline-0 focus-visible:outline-2 outline-[#c0f500]'
