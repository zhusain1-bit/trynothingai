'use client'

import { useEffect, useState } from 'react'
import { FeatureBlock } from './FeatureBlock'
import { CaptureDemo } from './CaptureDemo'
import { DailyNoteOverlayMock, type NoteEntry, type CloseoutItem } from './DailyNoteOverlayMock'
import { StepRail } from './StepRail'

const DAILY_ENTRIES: NoteEntry[] = [
  { id: 'd1', time: '8:45 AM', summary: 'morning standup notes' },
  { id: 'd2', time: '9:12 AM', summary: 'Q3 roadmap doc' },
  {
    id: 'd3',
    time: '10:15 AM',
    summary: 'Slack',
    group: {
      rangeLabel: '10:15–10:40',
      count: 8,
      items: ['10:17 · reply from Jon', '10:24 · thread update', '10:38 · final confirmation'],
    },
  },
  { id: 'd4', time: '11:05 AM', summary: 'flight confirmation', annotation: 'gate B12' },
  { id: 'd5', time: '1:30 PM', summary: "lunch spot — priya's rec" },
  { id: 'd6', time: '2:50 PM', summary: 'invoice from the printer', annotation: 'due Friday' },
  { id: 'd7', time: '4:00 PM', summary: 'tour at 4?' },
]

const CLOSEOUT_ITEMS: CloseoutItem[] = [
  { id: 'c1', summary: 'reply to the Figma comment' },
  { id: 'c2', summary: 'confirm the 4pm tour' },
]

// Ordered non-matches first, true matches last -- search mode narrows by
// collapsing from the front as typing progresses, keeping the trailing rows.
const ASK_ENTRIES: NoteEntry[] = [
  { id: 'a1', time: '10:02 AM', date: 'Today', summary: 'moving company quote' },
  { id: 'a2', time: '4:30 PM', date: 'Tue', summary: 'storage unit pricing' },
  { id: 'a3', time: '3:40 PM', date: 'Fri', summary: 'lease renewal terms' },
  { id: 'a4', time: '9:40 AM', date: 'Thu', summary: 'invoice from the printer' },
  { id: 'a5', time: '11:20 AM', date: 'Mon', summary: 'tyler — moving checklist' },
  { id: 'a6', time: '2:15 PM', date: 'Wed', summary: 'dentist appointment reminder' },
  { id: 'a7', time: '9:15 AM', date: 'Wed', summary: 'tyler — apartment listing link' },
  { id: 'a8', time: '2:05 PM', date: 'Today', summary: 'the address tyler sent — office lease' },
]

// Chronological across 3 days, matching PROJECTS_BLOCK's "2-3 days' worth"
// in-block loop.
const PROJECT_ENTRIES: NoteEntry[] = [
  { id: 'p1', time: '9:15 AM', date: 'Tue, Aug 12', summary: 'listing photos — kitchen + backyard' },
  { id: 'p2', time: '2:40 PM', date: 'Tue, Aug 12', summary: 'inspection report PDF' },
  { id: 'p3', time: '10:05 AM', date: 'Thu, Aug 14', summary: 'comps from the agent' },
  { id: 'p4', time: '4:20 PM', date: 'Thu, Aug 14', summary: 'offer terms — redline', annotation: 'counter due Mon' },
  { id: 'p5', time: '11:30 AM', date: 'Mon, Aug 18', summary: 'appraisal scheduling email' },
]

export function CaptureBlock() {
  return (
    <FeatureBlock
      id="capture"
      eyebrow="capture"
      heading="One key. Nothing to open."
      body="See something you can't deal with right now? Press the key. It's saved, timestamped, and out of your head. No picker, no folder, no decision."
      media={<CaptureDemo />}
    />
  )
}

const GROUP_ROW_ID = 'd3'

export function DailyNoteBlock() {
  const [mode, setMode] = useState<'note' | 'closeout'>('note')
  const [cycleKey, setCycleKey] = useState(0)
  const [expandedGroupId, setExpandedGroupId] = useState<string | undefined>(undefined)

  // Toggles note/closeout every 4s (unchanged) and bumps cycleKey on every
  // tick so <DailyNoteOverlayMock key={cycleKey}> remounts each time 'note'
  // comes back around -- that remount is what retriggers every row's
  // entry-row-land stagger animation, rather than a second animation system.
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const t = setInterval(() => {
      setMode(m => (m === 'note' ? 'closeout' : 'note'))
      setCycleKey(k => k + 1)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  // Group row lands last (~last row's stagger delay, 6*80ms=480ms, +300ms
  // land duration), briefly expands to show what it contains, re-collapses,
  // then holds for the rest of the 4s note-visible window. Skipped entirely
  // under reduced motion (not just sped up) -- the expand/re-collapse is
  // motion, not a state the settled view depends on.
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (mode !== 'note' || prefersReduced) {
      const t = setTimeout(() => setExpandedGroupId(undefined), 0)
      return () => clearTimeout(t)
    }
    const t1 = setTimeout(() => setExpandedGroupId(GROUP_ROW_ID), 900)
    const t2 = setTimeout(() => setExpandedGroupId(undefined), 1700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [mode, cycleKey])

  return (
    <FeatureBlock
      id="daily-note"
      eyebrow="daily note"
      heading="Your day, written as you go."
      body="Everything you captured becomes a running note for the day. At 5pm it hands the day back to you with anything still open at the top."
      reverse
      media={
        mode === 'note'
          ? <DailyNoteOverlayMock key={cycleKey} mode="note" entries={DAILY_ENTRIES} expandedGroupId={expandedGroupId} />
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

export function ProjectsBlock() {
  const [cycleKey, setCycleKey] = useState(0)

  // Same pattern as DailyNoteBlock: remount on each tick to replay the
  // grouped-by-day entry-row-land stagger, skipped under reduced motion.
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const t = setInterval(() => setCycleKey(k => k + 1), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <FeatureBlock
      id="projects"
      eyebrow="projects"
      heading="Everything about one thing, in one place."
      body="Name a project — 543 East, Q3 refi — and captures land there as well as in your day. Two months of screenshots about one deal, in order, without filing anything."
      media={
        <DailyNoteOverlayMock
          key={cycleKey}
          mode="project"
          entries={PROJECT_ENTRIES}
          projectName="543 East"
          captureCount={34}
        />
      }
    />
  )
}

// Grid wrapper: rail column (sticky, hidden below 1024px) beside the four
// stacked blocks. FeatureBlock no longer self-centers (that moved here) so
// the rail and the blocks share one page-width column together.
export function FeatureBlocksSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-6 px-6" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <StepRail />
      <div>
        <CaptureBlock />
        <DailyNoteBlock />
        <AskBlock />
        <ProjectsBlock />
      </div>
    </div>
  )
}
