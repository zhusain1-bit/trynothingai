'use client'

import { useEffect, useRef } from 'react'

// Wraps a single link/button: within 80px of the cursor, it translates
// toward the pointer up to 6px, lerped at 0.12/frame (rAF, direct style
// mutation via ref — no React state per frame). Disabled on touch.
export function MagneticButton({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const current = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    let raf = 0

    function onPointerMove(e: PointerEvent) {
      const el = wrapperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < 80) {
        const strength = (1 - dist / 80) * 6
        const len = dist || 1
        target.current = { x: (dx / len) * strength, y: (dy / len) * strength }
      } else {
        target.current = { x: 0, y: 0 }
      }
    }

    function tick() {
      current.current.x += (target.current.x - current.current.x) * 0.12
      current.current.y += (target.current.y - current.current.y) * 0.12
      const el = wrapperRef.current
      if (el) el.style.transform = `translate(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px)`
      raf = requestAnimationFrame(tick)
    }

    document.addEventListener('pointermove', onPointerMove)
    raf = requestAnimationFrame(tick)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <span ref={wrapperRef} style={{ display: 'inline-block' }}>
      {children}
    </span>
  )
}
