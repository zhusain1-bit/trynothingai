'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { StripCard } from '@/components/strip/StripCard'
import { SongCard } from '@/components/illustrations/SongCard'
import { TrialCard } from '@/components/illustrations/TrialCard'
import { BoardingPass } from '@/components/illustrations/BoardingPass'
import { LoginCard } from '@/components/illustrations/LoginCard'
import { OrderCard } from '@/components/illustrations/OrderCard'

const CARDS = [
  {
    name: 'Save a song',
    toastText: 'Added to · Songs',
    desc: "screenshot a track → it's in your list",
    delayMs: 0,
    thumbnail: <div style={{ position: 'absolute', inset: 0 }}><SongCard className="w-full h-full" /></div>,
  },
  {
    name: 'Free-trial reminder',
    toastText: 'Reminder · cancel Apr 9',
    desc: "screenshot it → pinged before you're charged",
    delayMs: 500,
    thumbnail: <div style={{ position: 'absolute', inset: 0 }}><TrialCard className="w-full h-full" /></div>,
  },
  {
    name: 'Custom rules',
    toastText: 'Auto-filed by rule · Mexico',
    desc: '“any trip to Mexico → Mexico collection”',
    ruleFlag: 'flight to MX → Mexico',
    delayMs: 1000,
    thumbnail: <BoardingPass className="absolute inset-0" />,
  },
  {
    name: 'Save a password',
    toastText: 'Saved to autofill',
    desc: 'screenshot a login → ready to autofill',
    soon: true,
    delayMs: 1500,
    thumbnail: <div style={{ position: 'absolute', inset: 0 }}><LoginCard className="w-full h-full" /></div>,
  },
  {
    name: 'Log an order',
    toastText: 'Arriving Thu · return Apr 9',
    desc: 'screenshot the confirmation → arrival + returns',
    delayMs: 2000,
    thumbnail: <div style={{ position: 'absolute', inset: 0 }}><OrderCard className="w-full h-full" /></div>,
  },
]

// Apple-style horizontal rail: snap scroll + edge fade masks + circular
// paddles (disabled at the ends) + dot indicators.
export function HighlightsRail() {
  const railRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)

  const cardStep = useCallback(() => {
    const rail = railRef.current
    const first = rail?.firstElementChild as HTMLElement | null
    return first ? first.offsetWidth + 16 : 320
  }, [])

  const sync = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setCanPrev(rail.scrollLeft > 8)
    setCanNext(rail.scrollLeft < max - 8)
    setActiveIdx(Math.min(CARDS.length - 1, Math.round(rail.scrollLeft / cardStep())))
  }, [cardStep])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    sync()
    rail.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync, { passive: true })
    return () => {
      rail.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync])

  function page(dir: 1 | -1) {
    railRef.current?.scrollBy({ left: dir * cardStep(), behavior: 'smooth' })
  }

  function jumpTo(i: number) {
    railRef.current?.scrollTo({ left: i * cardStep(), behavior: 'smooth' })
  }

  return (
    <div className="w-full">
      <div ref={railRef} className="snap-rail rail-mask w-full" role="list" aria-label="More things it does">
        {CARDS.map(({ name, ...card }) => (
          <div key={name} role="listitem">
            <StripCard name={name} {...card} />
          </div>
        ))}
      </div>

      {/* Controls: dots centered, paddles right — Apple gallery anatomy */}
      <div className="relative flex items-center justify-center" style={{ marginTop: 24, minHeight: 36 }}>
        <div className="flex items-center gap-[10px]" role="group" aria-label="Highlight cards">
          {CARDS.map((card, i) => (
            <button
              key={card.name}
              type="button"
              className="rail-dot"
              aria-current={i === activeIdx}
              aria-label={`Go to ${card.name}`}
              onClick={() => jumpTo(i)}
            />
          ))}
        </div>
        <div className="absolute right-[24px] hidden sm:flex items-center gap-[10px]">
          <button type="button" className="paddle" disabled={!canPrev} aria-label="Previous card" onClick={() => page(-1)}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M7.8 1.8 3.8 6l4 4.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="paddle" disabled={!canNext} aria-label="Next card" onClick={() => page(1)}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4.2 1.8 8.2 6l-4 4.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
