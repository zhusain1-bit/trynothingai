'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Apple-style hero settle: on desktop (and only without reduced motion) the
 * hero pins for ~0.7 extra viewports while the demo window settles from a
 * slight oversize and the copy fades up and away — the page's opening
 * handshake that teaches "scroll drives this page".
 *
 * Mobile / reduced-motion / no-JS render the plain static hero.
 */
export function HeroStage({
  copy,
  stage,
}: {
  copy: React.ReactNode
  stage: React.ReactNode
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        setPinned(true)
        const copyEl = root.querySelector('[data-hero-copy]')
        const winEl = root.querySelector('[data-hero-stage]')
        if (!copyEl || !winEl) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        })
        tl.fromTo(winEl, { scale: 1.06, y: 24 }, { scale: 1, y: 0, ease: 'none', duration: 0.6 }, 0)
        tl.to(copyEl, { opacity: 0, y: -28, ease: 'none', duration: 0.4 }, 0.35)

        return () => setPinned(false)
      })

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="relative w-full" style={pinned ? { height: '170vh' } : undefined}>
      <div
        className={pinned ? 'sticky top-0 flex flex-col items-center overflow-hidden' : 'flex flex-col items-center'}
        style={pinned ? { minHeight: '100vh' } : undefined}
      >
        <div data-hero-copy className="flex flex-col items-center w-full">{copy}</div>
        <div data-hero-stage className="w-full" style={{ willChange: pinned ? 'transform' : undefined }}>
          {stage}
        </div>
      </div>
    </div>
  )
}
