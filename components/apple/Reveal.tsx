'use client'

import { useState } from 'react'
import { useInView } from '@/components/features/useInView'

export function Reveal({
  children,
  delay = 0,
  index,
  blur = false,
  className = '',
}: {
  children: React.ReactNode
  /** explicit transition-delay in ms (overrides index stagger) */
  delay?: number
  /** stagger slot: delay = index * 70ms via the --i CSS var */
  index?: number
  /** blur-materialize variant — headlines/window blocks only (raster cost) */
  blur?: boolean
  className?: string
}) {
  const { ref, inView } = useInView(0.2)
  const [settled, setSettled] = useState(false)

  const base = blur ? 'reveal-blur' : 'reveal'
  const cls = [
    base,
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
