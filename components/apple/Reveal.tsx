'use client'

import { useState } from 'react'
import { useInView } from '@/components/features/useInView'

export function Reveal({
  children,
  delay = 0,
  index,
  blur = false,
  variant = 'apple',
  panel = false,
  className = '',
}: {
  children: React.ReactNode
  /** explicit transition-delay in ms (overrides index stagger) */
  delay?: number
  /** stagger slot: delay = index * 70ms (apple) or 60ms (light) via the --i CSS var */
  index?: number
  /** blur-materialize variant — apple variant only, headlines/window blocks */
  blur?: boolean
  /** 'apple' (default, existing dark-theme timing) or 'light' (warm rebuild timing) */
  variant?: 'apple' | 'light'
  /** light variant only — adds a 0.98→1 scale settle, for rounded-panel sections */
  panel?: boolean
  className?: string
}) {
  const { ref, inView } = useInView(variant === 'light' ? 0.15 : 0.2)
  const [settled, setSettled] = useState(false)

  const base = variant === 'light' ? 'reveal-light' : (blur ? 'reveal-blur' : 'reveal')
  const cls = [
    base,
    variant === 'light' && panel ? 'panel' : '',
    inView ? 'is-visible' : '',
    blur && settled ? 'is-settled' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={cls}
      style={{
        ...(delay ? { transitionDelay: `${delay}ms` } : {}),
        ...(index !== undefined ? ({ '--i': index } as React.CSSProperties) : {}),
      }}
      onTransitionEnd={blur && !settled ? e => { if (e.propertyName === 'filter') setSettled(true) } : undefined}
    >
      {children}
    </div>
  )
}
