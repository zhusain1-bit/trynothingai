'use client'

import { useEffect, useRef, useState } from 'react'
import { MockFrame } from './MockFrame'

// Wraps MockFrame with the "scale on pin" effect: as the block centers in
// the viewport, the mock scales 0.96->1, driven by IntersectionObserver's
// intersectionRatio (21 threshold steps, not a scroll listener) rather than
// per-frame scroll math.
export function PinnedMockFrame({ children, minHeight }: { children: React.ReactNode; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const initial = setTimeout(() => setScale(0.96), 0)
    const obs = new IntersectionObserver(
      ([entry]) => setScale(0.96 + entry.intersectionRatio * 0.04),
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    )
    obs.observe(el)
    return () => { clearTimeout(initial); obs.disconnect() }
  }, [])

  return (
    <div ref={ref} style={{ transform: `scale(${scale})`, transition: 'transform .2s linear' }}>
      <MockFrame chrome layered minHeight={minHeight}>
        {children}
      </MockFrame>
    </div>
  )
}
