'use client'

import { useState } from 'react'
import { useInView } from '@/components/features/useInView'
import { useAnimationLoop } from '@/components/features/useAnimationLoop'
import { CaptureContextMock } from './CaptureContextMock'
import { CapturePillMock } from './CapturePillMock'

type Phase = 'idle' | 'press' | 'pill'

// Replays every time it scrolls back into view (once: false) — this is a
// product demo, not a one-time entrance. Sequence: press glyph (400ms) ->
// pill rises + fades in (350ms, chip slides in 250ms/150ms-delay inside it,
// handled by CapturePillMock's own .pill-chip-enter) -> hold 1.5s -> pill
// fades out (200ms, via CapturePillMock's own visible-driven transition) ->
// wait 2s -> replay. Total loop 4800ms.
export function CaptureDemo() {
  const { ref, inView } = useInView({ threshold: 0.3, once: false })
  const [phase, setPhase] = useState<Phase>('idle')

  function reset() { setPhase('idle') }

  useAnimationLoop(
    [
      { ms: 300, action: () => setPhase('press') },
      { ms: 700, action: () => setPhase('pill') },
      { ms: 2600, action: () => setPhase('idle') },
    ],
    4800,
    reset,
    inView,
  )

  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: '16/10' }}>
      <CaptureContextMock />
      <div
        aria-hidden="true"
        className={`absolute font-mono capture-demo-press${phase === 'press' ? ' active' : ''}`}
        style={{ top: '42%', left: '50%', fontSize: 16, letterSpacing: 1.5, color: 'rgba(255,255,255,.85)', opacity: 0 }}
      >
        Ctrl ⇧ Space
      </div>
      <CapturePillMock state="time-bound" timeLabel="4:00 PM" visible={phase === 'pill'} />
    </div>
  )
}
