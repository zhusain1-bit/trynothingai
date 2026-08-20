'use client'

import { useEffect, useState } from 'react'
import { FeatureBlock } from './FeatureBlock'
import { CapturePillMock } from './CapturePillMock'
import { CaptureContextMock } from './CaptureContextMock'
import { DailyNoteOverlayMock, type NoteEntry, type CloseoutItem } from './DailyNoteOverlayMock'

const DAILY_ENTRIES: NoteEntry[] = [
  { id: 'd1', time: '8:45 AM', summary: 'morning standup notes' },
  { id: 'd2', time: '9:12 AM', summary: 'Q3 roadmap doc' },
  { id: 'd3', time: '10:15 AM', summary: 'Slack', group: { rangeLabel: '10:15–10:40', count: 8 } },
  { id: 'd4', time: '11:05 AM', summary: 'flight confirmation', annotation: 'gate B12' },
  { id: 'd5', time: '1:30 PM', summary: "lunch spot — priya's rec" },
  { id: 'd6', time: '2:50 PM', summary: 'invoice from the printer', annotation: 'due Friday' },
  { id: 'd7', time: '4:00 PM', summary: 'tour at 4?' },
]

const CLOSEOUT_ITEMS: CloseoutItem[] = [
  { id: 'c1', summary: 'reply to the Figma comment' },
  { id: 'c2', summary: 'confirm the 4pm tour' },
]

const ASK_ENTRIES: NoteEntry[] = [
  { id: 'a1', time: '2:05 PM', date: 'Today', summary: 'the address tyler sent — office lease' },
  { id: 'a2', time: '10:02 AM', date: 'Today', summary: 'moving company quote' },
  { id: 'a3', time: '11:20 AM', date: 'Mon', summary: 'tyler — moving checklist' },
  { id: 'a4', time: '4:30 PM', date: 'Tue', summary: 'storage unit pricing' },
  { id: 'a5', time: '9:15 AM', date: 'Wed', summary: 'tyler — apartment listing link' },
  { id: 'a6', time: '3:40 PM', date: 'Fri', summary: 'lease renewal terms' },
]

export function CaptureBlock() {
  return (
    <FeatureBlock
      id="capture"
      eyebrow="capture"
      heading="One key. Nothing to open."
      body="See something you can't deal with right now? Press the key. It's saved, timestamped, and out of your head. No picker, no folder, no decision."
      media={
        <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
          <CaptureContextMock />
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
      heading="Your day, written as you go."
      body="Everything you captured becomes a running note for the day. At 5pm it hands the day back to you with anything still open at the top."
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
      heading="Everything you captured, findable."
      body="Search across every day. You get the actual entries back, with the original screenshot — not a chatbot's summary of them."
      media={<DailyNoteOverlayMock mode="search" entries={ASK_ENTRIES} searchQuery="the address tyler sent" />}
    />
  )
}
