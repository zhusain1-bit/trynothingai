'use client'

import { useEffect, useState } from 'react'
import { FeatureBlock } from './FeatureBlock'
import { CapturePillMock } from './CapturePillMock'
import { DailyNoteOverlayMock, type NoteEntry, type CloseoutItem } from './DailyNoteOverlayMock'

const DAILY_ENTRIES: NoteEntry[] = [
  { id: 'd1', time: '9:12 AM', summary: 'Q3 roadmap doc' },
  { id: 'd2', time: '10:15 AM', summary: 'Slack', group: { rangeLabel: '10:15–10:40', count: 8 } },
  { id: 'd3', time: '1:30 PM', summary: 'flight confirmation', annotation: 'gate B12' },
]

const CLOSEOUT_ITEMS: CloseoutItem[] = [
  { id: 'c1', summary: 'reply to the Figma comment' },
  { id: 'c2', summary: 'confirm the 4pm tour' },
]

const ASK_ENTRIES: NoteEntry[] = [
  { id: 'a1', time: '2:05 PM', date: 'Today', summary: 'the address tyler sent — office lease' },
  { id: 'a2', time: '11:20 AM', date: 'Mon', summary: 'tyler — moving checklist' },
]

// Placeholder copy on all three blocks — final copy pending.

export function CaptureBlock() {
  return (
    <FeatureBlock
      id="capture"
      eyebrow="capture"
      heading="[Placeholder — one key, nothing to open]"
      body="[Placeholder — one hotkey captures anything on screen, no picker to navigate.]"
      media={
        <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
          <CapturePillMock state="time-bound" timeLabel="4:00 PM" />
        </div>
      }
    />
  )
}

export function DailyNoteBlock() {
  const [mode, setMode] = useState<'note' | 'closeout'>('note')

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const t = setInterval(() => setMode(m => (m === 'note' ? 'closeout' : 'note')), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <FeatureBlock
      id="daily-note"
      eyebrow="daily note"
      heading="[Placeholder — your day, written for you]"
      body="[Placeholder — captures resurface as a running note for the day, with a 5pm close-out for anything still open.]"
      reverse
      media={
        mode === 'note'
          ? <DailyNoteOverlayMock mode="note" entries={DAILY_ENTRIES} />
          : <DailyNoteOverlayMock mode="closeout" closeoutItems={CLOSEOUT_ITEMS} />
      }
    />
  )
}

export function AskBlock() {
  return (
    <FeatureBlock
      id="ask"
      eyebrow="ask"
      heading="[Placeholder — everything you captured, findable]"
      body="[Placeholder — search across every day you've captured. Not a chatbot: you get the entries back, not a synthesized answer.]"
      media={<DailyNoteOverlayMock mode="search" entries={ASK_ENTRIES} searchQuery="the address tyler sent" />}
    />
  )
}
