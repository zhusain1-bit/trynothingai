'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/components/features/useInView'
import { useAnimationLoop } from '@/components/features/useAnimationLoop'
import { CapturePillMock } from './CapturePillMock'
import { DailyNoteOverlayMock, type NoteEntry } from './DailyNoteOverlayMock'

type Phase = 'message' | 'hotkey' | 'pill' | 'note'

const HERO_ENTRIES: NoteEntry[] = [
  { id: 'new', time: '4:00 PM', summary: 'tour at 4? — scheduled' },
  { id: 'e2', time: '2:10 PM', summary: 'Q3 roadmap doc' },
  { id: 'e3', time: '11:40 AM', summary: 'flight confirmation' },
]

// Placeholder hero loop — composed live from CapturePillMock and
// DailyNoteOverlayMock (not a video). Sequence: static message → hotkey →
// pill → note landing → hold → loop. Under 8s total. See design spec §4.
export function HeroLoop() {
  const { ref, inView } = useInView(0.2)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [phase, setPhase] = useState<Phase>('message')
  const [entryVisible, setEntryVisible] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReducedMotion(mq.matches)
    const timer = setTimeout(handler, 0)
    mq.addEventListener('change', handler)
    return () => { clearTimeout(timer); mq.removeEventListener('change', handler) }
  }, [])

  function reset() { setPhase('message'); setEntryVisible(false) }

  useAnimationLoop(
    [
      { ms: 900, action: () => setPhase('hotkey') },
      { ms: 1600, action: () => setPhase('pill') },
      { ms: 3400, action: () => setPhase('note') },
      { ms: 3700, action: () => setEntryVisible(true) },
    ],
    7800,
    reset,
    inView && !reducedMotion,
  )

  const displayEntries = entryVisible ? HERO_ENTRIES : HERO_ENTRIES.slice(1)

  return (
    <div
      ref={ref}
      className="relative w-full flex items-end justify-center overflow-hidden"
      style={{ aspectRatio: '16 / 10', background: '#0D0D0D' }}
    >
      <div
        className="absolute flex justify-center"
        style={{ top: 40, left: 0, right: 0, opacity: phase === 'note' ? 0.12 : 1, transition: 'opacity .4s ease' }}
      >
        <div style={{ borderRadius: 12, padding: '10px 16px', maxWidth: 240, fontSize: 13, background: '#2A2A2A', color: '#E5E5E5' }}>
          tour at 4?
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute font-mono"
        style={{
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 18,
          letterSpacing: 2,
          color: 'rgba(255,255,255,.8)',
          opacity: phase === 'hotkey' ? 1 : 0,
          transition: 'opacity .3s ease',
        }}
      >
        Ctrl ⇧ Space
      </div>

      <CapturePillMock state="time-bound" timeLabel="4:00 PM" visible={phase === 'pill'} />

      <div
        className="absolute flex items-center justify-center"
        style={{ inset: 0, opacity: phase === 'note' ? 1 : 0, transition: 'opacity .5s ease', pointerEvents: 'none' }}
      >
        <DailyNoteOverlayMock mode="note" entries={displayEntries} />
      </div>
    </div>
  )
}
