# Landing Page Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild trynothingai.com's homepage (plus `/download`, `/privacy`, `/confirmed`, `/subscribed`) from the current dark "Apple product page" style into the new warm, light, granola.ai/cluely.com/wisprflow.ai-caliber system, telling the product's real current story (capture → daily note → ask) instead of the old one (calendar/email/collections).

**Architecture:** New light-theme components live under `components/light/`, built and wired into the real pages incrementally (one task = one visible, working change), on a feature branch so the live site is never shown mid-rebuild. Motion reuses the existing `Reveal`/`useInView`/`useAnimationLoop` hooks with new timing values gated behind a `variant="light"` prop, so the untouched dark pages (`/reset`) keep their current behavior unmodified. Product UI (capture pill, daily-note overlay) is placeholder mock UI built to the real app's spec'd dimensions, not real screenshots.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 (`@theme` tokens in `globals.css`). No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-19-landing-page-rebuild-design.md`

## Global Constraints

- No new npm dependencies — no shadcn/ui, no Framer Motion. Reuse `components/apple/Reveal.tsx`, `components/features/useInView.ts`, `components/features/useAnimationLoop.ts` as-is (hooks) or via a new `variant` prop (Reveal only).
- Color: ground `#FAF8F5`, alt section `#F2EFE9`, primary text `#1A1A1A`, secondary text `#6B6B6B`, border `#E5E0D8`, single accent `#C2410C`. The accent (`#C2410C`) appears **only** on primary CTAs and the capture-key glyph — never as a section background, body text, or decorative fill.
- Type: Instrument Serif (display) + Inter (body/UI), both self-hosted via `next/font/google`.
- Motion: fade 0→1 opacity + 12px upward translateY, 400ms `cubic-bezier(0.16,1,0.3,1)`, 60ms stagger, fires once at ~15% intersection, never re-triggers on scroll-up. Honors `prefers-reduced-motion: reduce` (final state, no transforms, animation loops stay on their first/idle frame).
- Product imagery frame: 12px border-radius, `box-shadow: 0 24px 48px -12px rgba(26,26,26,0.18)`.
- No fabricated content: the 14 existing testimonials are deleted, not restyled or ported.
- `/reset` and its shared dependents (`components/Nav.tsx`, `components/Footer.tsx`, the dark CSS tokens in `globals.css:1-...`) must keep working unmodified — do not edit those files or their existing CSS variables. All new work uses new files under `components/light/` and new, additively-added CSS.
- `/api/waitlist` and its Resend Audience data (127 real contacts, the actual launch list) must not be modified or migrated. Its only change in scope is which page renders a form that calls it.
- No test framework exists in this repo (no Jest/Vitest) and none is being added. Every task's "test" step is: `npx tsc --noEmit`, `npm run lint`, and a manual check via `npm run dev` (exact URL and what to look for given per task). Presentational leaf components with no page consumer yet in that same task are verified by typecheck + lint + a careful read of the code; full visual verification happens in the task that first renders them on a real route.
- All work happens on a feature branch (Task 1 creates it). Every task's commit pushes to that branch, never to `master`. The plan's final task stops at "branch pushed, ready for review" — merging to `master` is an explicit, separate decision outside this plan.

---

### Task 1: Feature branch + warm design tokens, fonts, and retuned Reveal variant

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `components/apple/Reveal.tsx`

**Interfaces:**
- Produces: CSS custom properties `--warm-ground`, `--warm-alt`, `--ink`, `--ink-2`, `--warm-border`, `--amber`, `--ease-warm`; Tailwind `@theme` tokens `--color-warm-ground`, `--color-warm-alt`, `--color-ink`, `--color-ink-2`, `--color-warm-border`, `--color-amber`; CSS classes `.reveal-light`, `.btn-warm`, `.card-warm`, `.link-warm`; font CSS variable `--font-instrument-serif` on `<html>`; `Reveal` component gains `variant?: 'apple' | 'light'` (default `'apple'` — every existing call site is unaffected).

- [ ] **Step 1: Confirm the feature branch**

The executing agent's workspace is already an isolated git worktree checked out on branch `rebuild/light-theme` (created before this task started). Confirm with `git branch --show-current` — expected output: `rebuild/light-theme`. Do not create a new branch.

- [ ] **Step 2: Add warm design tokens to `app/globals.css`**

Append at the end of the file (after the existing `section[id] { scroll-margin-top: 64px; }` block):

```css
/* ─── Warm rebuild tokens (light system) ──────────────────────────────
   Additive only — the dark tokens above stay untouched for /reset. */
:root {
  --warm-ground: #FAF8F5;
  --warm-alt: #F2EFE9;
  --ink: #1A1A1A;
  --ink-2: #6B6B6B;
  --warm-border: #E5E0D8;
  --amber: #C2410C;
  --ease-warm: cubic-bezier(0.16, 1, 0.3, 1);
}
@theme {
  --color-warm-ground: #FAF8F5;
  --color-warm-alt: #F2EFE9;
  --color-ink: #1A1A1A;
  --color-ink-2: #6B6B6B;
  --color-warm-border: #E5E0D8;
  --color-amber: #C2410C;
}

/* ─── Warm reveal system — 400ms, 12px translate, 60ms stagger ───────── */
.reveal-light {
  transition: opacity .4s var(--ease-warm), transform .4s var(--ease-warm);
  transition-delay: calc(var(--i, 0) * 60ms);
}
@media (scripting: enabled) {
  .reveal-light { opacity: 0; transform: translateY(12px); }
  .reveal-light.is-visible { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .reveal-light { opacity: 1; transform: none; }
}

/* ─── Warm micro-interactions ─────────────────────────────────────────── */
.btn-warm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  background: var(--amber);
  color: #FFF7F0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(26,26,26,.08);
  transition: transform .15s var(--ease-warm), box-shadow .15s var(--ease-warm), background .15s var(--ease-warm);
}
.btn-warm:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px -8px rgba(194,65,12,.45);
  background: #A8380A;
}
.btn-warm:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: 2px;
}
.btn-warm:disabled {
  opacity: .6;
  cursor: not-allowed;
  transform: none;
}

.card-warm {
  transition: box-shadow .2s var(--ease-warm);
}
.card-warm:hover {
  box-shadow: 0 16px 40px -20px rgba(26,26,26,.25);
}

.link-warm {
  position: relative;
  color: var(--ink);
  text-decoration: none;
  padding-bottom: 1px;
}
.link-warm::after {
  content: '';
  position: absolute;
  left: 0;
  right: 100%;
  bottom: -2px;
  height: 1px;
  background: var(--amber);
  transition: right .2s var(--ease-warm);
}
.link-warm:hover::after { right: 0; }
```

- [ ] **Step 3: Add the Instrument Serif font in `app/layout.tsx`**

Change the import line:

```ts
import { Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
```

Add after the `jetbrainsMono` declaration:

```ts
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
})
```

Update the `<html>` className:

```tsx
<html
  lang="en"
  className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
>
```

- [ ] **Step 4: Add the `variant` prop to `components/apple/Reveal.tsx`**

Replace the file's contents:

```tsx
'use client'

import { useState } from 'react'
import { useInView } from '@/components/features/useInView'

export function Reveal({
  children,
  delay = 0,
  index,
  blur = false,
  variant = 'apple',
  className = '',
}: {
  children: React.ReactNode
  /** explicit transition-delay in ms (overrides index stagger) */
  delay?: number
  /** stagger slot: delay = index * 70ms (apple) or 60ms (light) via the --i CSS var */
  index?: number
  /** blur-materialize variant — apple variant only, headlines/window blocks */
  blur?: boolean
  /** 'apple' (default, existing dark-theme timing) or 'light' (warm rebuild timing) */
  variant?: 'apple' | 'light'
  className?: string
}) {
  const { ref, inView } = useInView(variant === 'light' ? 0.15 : 0.2)
  const [settled, setSettled] = useState(false)

  const base = variant === 'light' ? 'reveal-light' : (blur ? 'reveal-blur' : 'reveal')
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
```

- [ ] **Step 5: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. (No page renders anything new yet — this is a purely additive, non-breaking change; the homepage and every other route still use `Reveal`'s default `'apple'` variant.)

- [ ] **Step 6: Commit and push**

```bash
git add app/globals.css app/layout.tsx components/apple/Reveal.tsx
git commit -m "feat: add warm design tokens, Instrument Serif, and light Reveal variant"
git push -u origin rebuild/light-theme
```

---

### Task 2: Mock UI components — MockFrame, CapturePillMock, DailyNoteOverlayMock

**Files:**
- Create: `components/light/MockFrame.tsx`
- Create: `components/light/CapturePillMock.tsx`
- Create: `components/light/DailyNoteOverlayMock.tsx`

**Interfaces:**
- Consumes: nothing new (DailyNoteOverlayMock uses `useInView` from `components/features/useInView.ts`).
- Produces:
  - `MockFrame({ children, className?, rotate? }): JSX.Element`
  - `CapturePillMock({ state?: 'idle' | 'time-bound', timeLabel?: string, placeholder?: string, visible?: boolean }): JSX.Element` — must render inside a `position: relative` ancestor (it's `position: absolute`, bottom-centered).
  - `DailyNoteOverlayMock({ mode: 'note' | 'strip' | 'closeout' | 'search', entries?: NoteEntry[], closeoutItems?: CloseoutItem[], searchQuery?: string }): JSX.Element`, plus exported types `NoteEntry = { id: string; time: string; summary: string; annotation?: string; group?: { rangeLabel: string; count: number } }` and `CloseoutItem = { id: string; summary: string }`.

- [ ] **Step 1: Create `components/light/MockFrame.tsx`**

```tsx
export function MockFrame({
  children,
  className = '',
  rotate = 0,
}: {
  children: React.ReactNode
  className?: string
  rotate?: number
}) {
  return (
    <div
      className={`overflow-hidden rounded-[12px] ${className}`}
      style={{
        boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)',
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        background: '#0F0F0F',
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create `components/light/CapturePillMock.tsx`**

```tsx
'use client'

export type CapturePillState = 'idle' | 'time-bound'

// Placeholder mock UI — not a real screenshot. See docs/superpowers/specs/
// 2026-08-19-landing-page-rebuild-design.md §5 for the spec this matches.
export function CapturePillMock({
  state = 'idle',
  timeLabel = '4:00 PM',
  placeholder = 'add a note (optional)',
  visible = true,
}: {
  state?: CapturePillState
  timeLabel?: string
  placeholder?: string
  visible?: boolean
}) {
  return (
    <div
      role="img"
      aria-label="Capture pill — placeholder mock of the nothing.ai capture UI"
      className="absolute left-1/2 flex items-center gap-2 rounded-full"
      style={{
        bottom: 80,
        transform: `translateX(-50%) translateY(${visible ? '0' : '8px'})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity .3s ease, transform .3s ease',
        minWidth: 280,
        maxWidth: 420,
        height: 46,
        padding: '0 16px',
        background: 'rgba(31,31,31,0.96)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.24)',
      }}
    >
      <span aria-hidden="true" style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,.35)', flexShrink: 0 }} />
      {state === 'time-bound' && (
        <span className="font-mono" style={{ fontSize: 12, color: '#F4B183', whiteSpace: 'nowrap' }}>
          {timeLabel} ·
        </span>
      )}
      <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {placeholder}
      </span>
      <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid rgba(255,255,255,.3)', flexShrink: 0 }} />
    </div>
  )
}
```

- [ ] **Step 3: Create `components/light/DailyNoteOverlayMock.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/components/features/useInView'

export type NoteEntry = {
  id: string
  time: string
  summary: string
  annotation?: string
  group?: { rangeLabel: string; count: number }
}

export type CloseoutItem = { id: string; summary: string }

export type DailyNoteMode = 'note' | 'strip' | 'closeout' | 'search'

// Placeholder mock UI — not a real screenshot. All four modes share this
// panel's chrome, dimensions, and entry-row renderer on purpose: only the
// content differs. See docs/superpowers/specs/2026-08-19-landing-page-
// rebuild-design.md §5.

const PANEL_STYLE: React.CSSProperties = {
  width: 'min(420px, 90%)',
  maxHeight: 420,
  borderRadius: 14,
  background: '#1F1F1F',
  boxShadow: '0 24px 60px -16px rgba(0,0,0,.6)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

function SearchField({ value, placeholder }: { value: string; placeholder: string }) {
  const showingPlaceholder = value.length === 0
  return (
    <div style={{ padding: 16, paddingBottom: 8 }}>
      <div
        style={{
          height: 44,
          borderRadius: 8,
          background: '#2A2A2A',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          fontSize: 13,
          color: showingPlaceholder ? '#6B6B6B' : '#E5E5E5',
        }}
      >
        {showingPlaceholder ? placeholder : value}
      </div>
    </div>
  )
}

function EntryRow({ entry, view }: { entry: NoteEntry; view: 'note' | 'strip' | 'search' }) {
  const thumbSize = view === 'strip' ? 44 : 32
  return (
    <li className="flex items-center gap-3" style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <span aria-hidden="true" style={{ width: thumbSize, height: thumbSize, borderRadius: 6, background: '#3A3A3A', flexShrink: 0 }} />
      {view !== 'strip' ? (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            {view === 'search' && (
              <span className="font-mono" style={{ fontSize: 10, color: '#6B6B6B' }}>{entry.time.split(' ')[0]}</span>
            )}
            <span className="font-mono" style={{ fontSize: 11, color: '#8A8A8A' }}>{entry.time}</span>
          </div>
          <p style={{ fontSize: 13, color: '#E5E5E5', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {entry.group ? `${entry.group.rangeLabel} · ${entry.group.count} from ${entry.summary}` : entry.summary}
          </p>
          {entry.annotation && <p style={{ fontSize: 11, color: '#8A8A8A', margin: '2px 0 0' }}>{entry.annotation}</p>}
        </div>
      ) : (
        <span className="font-mono" style={{ fontSize: 11, color: '#8A8A8A' }}>{entry.time}</span>
      )}
    </li>
  )
}

function useTypedQuery(query: string, active: boolean) {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) return
    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setTyped(query); setDone(true); return }

    setTyped('')
    setDone(false)
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= query.length; i++) {
      timers.push(setTimeout(() => setTyped(query.slice(0, i)), i * 40))
    }
    timers.push(setTimeout(() => setDone(true), query.length * 40 + 300))
    return () => timers.forEach(clearTimeout)
  }, [active, query])

  return { typed, done }
}

export function DailyNoteOverlayMock({
  mode,
  entries = [],
  closeoutItems = [],
  searchQuery = 'the address tyler sent',
}: {
  mode: DailyNoteMode
  entries?: NoteEntry[]
  closeoutItems?: CloseoutItem[]
  searchQuery?: string
}) {
  const [view, setView] = useState<'note' | 'strip'>('note')
  const { ref, inView } = useInView(0.3)
  const { typed, done } = useTypedQuery(searchQuery, mode === 'search' && inView)

  const searchValue = mode === 'search' ? typed : ''
  const visibleEntries = mode === 'search' ? (done ? entries.slice(0, 3) : []) : entries
  const rowView: 'note' | 'strip' | 'search' = mode === 'search' ? 'search' : view

  return (
    <div ref={ref} style={PANEL_STYLE} role="img" aria-label="Daily note overlay — placeholder mock of the nothing.ai overlay">
      <SearchField value={searchValue} placeholder="search or ask" />

      {(mode === 'note' || mode === 'strip') && (
        <div className="flex items-center gap-2" style={{ padding: '0 16px 8px' }}>
          {(['note', 'strip'] as const).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              style={{
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: view === v ? '#3A3A3A' : 'transparent',
                color: view === v ? '#E5E5E5' : '#8A8A8A',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {(mode === 'note' || mode === 'strip' || mode === 'search') && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, overflowY: 'auto' }}>
          {visibleEntries.map(e => <EntryRow key={e.id} entry={e} view={rowView} />)}
        </ul>
      )}

      {mode === 'closeout' && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {closeoutItems.map(item => (
            <li key={item.id} className="flex items-center justify-between gap-3" style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <span style={{ fontSize: 13, color: '#E5E5E5' }}>{item.summary}</span>
              <div className="flex gap-2 font-mono" style={{ fontSize: 10, color: '#8A8A8A' }}>
                <span>done</span><span>snooze</span><span>dismiss</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. No page renders these yet (verified visually in Task 3).

- [ ] **Step 5: Commit and push**

```bash
git add components/light/MockFrame.tsx components/light/CapturePillMock.tsx components/light/DailyNoteOverlayMock.tsx
git commit -m "feat: add MockFrame, CapturePillMock, DailyNoteOverlayMock placeholder UI"
git push
```

---

### Task 3: WarmPage wrapper, light Nav, HeroLoop, Hero — first homepage integration

**Files:**
- Create: `components/light/WarmPage.tsx`
- Create: `components/light/Nav.tsx`
- Create: `components/light/HeroLoop.tsx`
- Create: `components/light/Hero.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `CapturePillMock`, `DailyNoteOverlayMock`, `NoteEntry` (Task 2); `useInView`, `useAnimationLoop` (existing hooks); `Reveal` with `variant="light"` (Task 1).
- Produces: `WarmPage({ children }): JSX.Element`, `Nav(): JSX.Element`, `HeroLoop(): JSX.Element`, `Hero(): JSX.Element`.

- [ ] **Step 1: Create `components/light/WarmPage.tsx`**

```tsx
// Overrides the dark body defaults locally for light-system pages, without
// touching global body CSS (which /reset still relies on).
export function WarmPage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#FAF8F5', color: '#1A1A1A', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create `components/light/Nav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6"
      style={{
        height: 64,
        background: scrolled ? 'rgba(250,248,245,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid #E5E0D8' : '1px solid transparent',
        transition: 'background .2s ease, border-color .2s ease',
      }}
    >
      <Link href="/" aria-label="nothing.ai home" style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
        nothing.ai
      </Link>
      <nav className="hidden sm:flex items-center gap-6" aria-label="Primary">
        <a href="#capture" className="link-warm" style={{ fontSize: 14 }}>Features</a>
        <a href="/privacy" className="link-warm" style={{ fontSize: 14 }}>Privacy</a>
      </nav>
      <a href="/download" className="btn-warm" style={{ padding: '9px 18px', fontSize: 13 }}>
        Download
      </a>
    </header>
  )
}
```

- [ ] **Step 3: Create `components/light/HeroLoop.tsx`**

```tsx
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
    setReducedMotion(mq.matches)
    const handler = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
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
```

- [ ] **Step 4: Create `components/light/Hero.tsx`**

```tsx
import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'
import { HeroLoop } from './HeroLoop'

export function Hero() {
  return (
    <section
      className="flex flex-col items-center text-center px-6"
      style={{ paddingTop: 'clamp(64px,10vw,120px)', paddingBottom: 'clamp(48px,8vw,96px)', background: '#FAF8F5' }}
    >
      <Reveal variant="light" index={0}>
        <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
          [placeholder eyebrow — final copy pending]
        </span>
      </Reveal>
      <Reveal variant="light" index={1}>
        <h1
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(40px,7vw,64px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#1A1A1A',
            marginTop: 16,
            maxWidth: 820,
          }}
        >
          [Placeholder headline — describes the outcome, not the mechanism. Final copy pending.]
        </h1>
      </Reveal>
      <Reveal variant="light" index={2}>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: '#6B6B6B', marginTop: 18, maxWidth: 560 }}>
          [Placeholder one-line subhead — final copy pending.]
        </p>
      </Reveal>
      <Reveal variant="light" index={3}>
        <div className="flex flex-col items-center gap-3" style={{ marginTop: 28 }}>
          <Link href="/download" className="btn-warm" style={{ padding: '14px 28px', fontSize: 15 }}>
            Download for Windows
          </Link>
          <a href="#capture" className="link-warm" style={{ fontSize: 13, color: '#6B6B6B' }}>
            see how it works
          </a>
        </div>
      </Reveal>
      <Reveal variant="light" index={4}>
        <div
          className="w-full"
          style={{ marginTop: 40, maxWidth: 640, borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)' }}
        >
          <HeroLoop />
        </div>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 5: Replace the top of `app/page.tsx` with the new Nav/Hero**

In `app/page.tsx`, change the imports at the top of the file — remove:

```tsx
import { Nav }                from '@/components/Nav'
import { LocalNav }           from '@/components/apple/LocalNav'
import { AppleHero }          from '@/components/apple/AppleHero'
```

**Do not remove the `Fn` or `BrightenText` imports in this task** — both are still referenced by JSX further down in the file that this task does not touch (`Fn` by the "at a glance" section, removed only in Task 10; `BrightenText` by the problem-statement section, removed only in Task 4). Removing them now would leave the file broken until those later tasks land.

and add:

```tsx
import { WarmPage } from '@/components/light/WarmPage'
import { Nav }       from '@/components/light/Nav'
import { Hero }      from '@/components/light/Hero'
```

(Leave every other existing import in `app/page.tsx` untouched for now — later tasks remove them as each section is replaced.)

Then change the top of the `Home()` return statement — replace:

```tsx
  return (
    <>
      <Nav />
      <LocalNav />
      <main id="main-content" style={{ background: 'var(--void)' }}>

        {/* Hero */}
        <AppleHero />
```

with:

```tsx
  return (
    <WarmPage>
      <Nav />
      <main id="main-content">

        {/* Hero */}
        <Hero />
```

Leave everything below this point in the file (the "People screenshot things..." problem statement onward) exactly as it is for now — this task's scope is only the top of the page. The file's closing tags (`</main></>`) will need matching to the new `<WarmPage>` wrapper; make that change now too — replace the file's final lines:

```tsx
        <Footer />
      </main>
    </>
  )
}
```

with:

```tsx
        <Footer />
      </main>
    </WarmPage>
  )
}
```

- [ ] **Step 6: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000`. Expected: the page now starts with a light warm nav + hero (headline/subhead/CTA/hero loop), then abruptly switches to the old dark theme below the hero — that's expected and correct at this point in the plan; every later task replaces one more section going down the page. Confirm: the hero loop animates (message → hotkey glyph → pill → note entry) and loops under 8s; toggling OS "reduce motion" and reloading shows only the static message frame with no animation.

- [ ] **Step 7: Commit and push**

```bash
git add components/light/WarmPage.tsx components/light/Nav.tsx components/light/HeroLoop.tsx components/light/Hero.tsx app/page.tsx
git commit -m "feat: replace homepage nav/hero with the warm light system"
git push
```

---

### Task 4: ProblemStatement (absorbs the cross-device point)

**Files:**
- Create: `components/light/ProblemStatement.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Reveal` (`variant="light"`).
- Produces: `ProblemStatement(): JSX.Element`.

- [ ] **Step 1: Create `components/light/ProblemStatement.tsx`**

```tsx
import { Reveal } from '@/components/apple/Reveal'

// Placeholder copy — final copy pending. The second line compresses the
// cross-device point that used to be its own section (see components/
// _archive/WhyNotPhoneSection.tsx, archived in Task 7): phones already turn
// a screenshot with a time in it into a calendar event; the computer doesn't,
// and that's where work actually gets lost. No Apple mention, not comparative.
export function ProblemStatement() {
  return (
    <section className="flex flex-col items-center text-center px-6" style={{ padding: 'clamp(64px,10vw,140px) 24px', background: '#FAF8F5' }}>
      <Reveal variant="light">
        <p
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(28px,4vw,40px)',
            lineHeight: 1.3,
            color: '#1A1A1A',
            maxWidth: 720,
          }}
        >
          [Placeholder — you screenshot things for a reason, then forget the reason.]
        </p>
      </Reveal>
      <Reveal variant="light" delay={80}>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: '#6B6B6B', marginTop: 20, maxWidth: 640 }}>
          [Placeholder — your phone already turns a screenshot with a time in it into a calendar
          event. Work happens on your computer — Slack, docs, tabs — and that&rsquo;s where it gets lost.]
        </p>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Replace the problem-statement block in `app/page.tsx`**

Remove the import of `BrightenText` usage block. Replace:

```tsx
        {/* Statement — the problem (scroll-linked word brightening) */}
        <Chapter
          tone="black"
          headline={<BrightenText text="People screenshot things for a reason. And then they forget that reason." />}
          sub="Everyone has thousands of dead screenshots — the show they meant to get tickets to, the jacket they meant to buy, the address they meant to save. The intent was real. It just got buried."
        />
```

with:

```tsx
        {/* Problem statement — absorbs the cross-device point (design spec §4) */}
        <ProblemStatement />
```

Add the import at the top of `app/page.tsx`:

```tsx
import { ProblemStatement } from '@/components/light/ProblemStatement'
```

Remove the now-unused `BrightenText` import (this is the task that makes it dead — the problem-statement block that used it was just replaced above, and no other code in the file references it):

```tsx
import { BrightenText }       from '@/components/apple/BrightenText'
```

- [ ] **Step 3: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000`. Expected: hero → new light problem-statement section (serif line + subline, centered, reveals on scroll) → then the old dark theme continues below.

- [ ] **Step 4: Commit and push**

```bash
git add components/light/ProblemStatement.tsx app/page.tsx
git commit -m "feat: replace problem statement with light version, absorb cross-device point"
git push
```

---

### Task 5: FeatureBlock + the three full blocks (Capture, Daily Note, Ask)

**Files:**
- Create: `components/light/FeatureBlock.tsx`
- Create: `components/light/FeatureBlocks.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `CapturePillMock`, `DailyNoteOverlayMock` + its types (Task 2); `Reveal` (`variant="light"`).
- Produces: `FeatureBlock({ id?, eyebrow, heading, body, media, reverse? }): JSX.Element`; `CaptureBlock(): JSX.Element`; `DailyNoteBlock(): JSX.Element`; `AskBlock(): JSX.Element`.

- [ ] **Step 1: Create `components/light/FeatureBlock.tsx`**

```tsx
import { Reveal } from '@/components/apple/Reveal'

export function FeatureBlock({
  id,
  eyebrow,
  heading,
  body,
  media,
  reverse = false,
}: {
  id?: string
  eyebrow: string
  heading: React.ReactNode
  body: string
  media: React.ReactNode
  reverse?: boolean
}) {
  return (
    <section
      id={id}
      className={`w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
      style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(64px,10vw,120px) 24px' }}
    >
      <Reveal variant="light" index={0}>
        <div style={{ maxWidth: 440 }}>
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#C2410C' }}>
            {eyebrow}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(28px,3.4vw,36px)',
              color: '#1A1A1A',
              marginTop: 10,
              lineHeight: 1.15,
            }}
          >
            {heading}
          </h3>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#6B6B6B', marginTop: 14 }}>
            {body}
          </p>
        </div>
      </Reveal>
      <Reveal variant="light" index={1}>
        <div
          className="card-warm"
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0F0F0F',
            minHeight: 320,
            padding: 24,
          }}
        >
          {media}
        </div>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/light/FeatureBlocks.tsx`**

```tsx
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
  { id: 'a1', time: '2:05 PM', summary: 'the address tyler sent — office lease' },
  { id: 'a2', time: 'Mon 11:20 AM', summary: 'tyler — moving checklist' },
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
```

- [ ] **Step 3: Replace the old feature chapters in `app/page.tsx`**

Remove this whole block (from the "Highlights rail" comment through the end of the "ask" `Chapter`, i.e. everything between the problem statement and the `WhyNotPhoneSection`):

```tsx
        {/* Highlights rail */}
        <Chapter
          id="highlights"
          ...
        {/* Feature chapter — ask */}
        <Chapter
          id="ask"
          ...
        </Chapter>
```

(This removes the "Highlights rail" `Chapter`, the "how it works" `StatGrid` `Chapter` with the hotkey watermark `div`, and the calendar/email/collections/ask `Chapter` blocks — the entire middle of the current homepage.)

Replace it with:

```tsx
        {/* Feature blocks — capture, daily note, ask (design spec §4) */}
        <CaptureBlock />
        <DailyNoteBlock />
        <AskBlock />
```

Add the import at the top of `app/page.tsx`:

```tsx
import { CaptureBlock, DailyNoteBlock, AskBlock } from '@/components/light/FeatureBlocks'
```

Remove these now-unused imports from the top of `app/page.tsx`: `MacWindow`, `HighlightsRail`, `DemoVideo`, `AskHero`.

**Do not remove `Chapter`, `StatGrid`, or `Fn`** — all three are still used by the "at a glance" section further down in the file, which this task does not touch (it's removed only in Task 10, where those imports finally become dead).

- [ ] **Step 4: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000`. Expected: hero → problem statement → three light feature blocks (Capture pill, Daily Note overlay auto-toggling note/close-out every 4s, Ask overlay typing "the address tyler sent" and landing on 2 results) → old dark theme continues below.

- [ ] **Step 5: Commit and push**

```bash
git add components/light/FeatureBlock.tsx components/light/FeatureBlocks.tsx app/page.tsx
git commit -m "feat: replace old feature chapters with capture/daily-note/ask blocks"
git push
```

---

### Task 6: Email→clipboard highlights rail

**Files:**
- Create: `components/light/HighlightsRailMock.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Reveal` (`variant="light"`).
- Produces: `HighlightsRailMock(): JSX.Element`.

- [ ] **Step 1: Create `components/light/HighlightsRailMock.tsx`**

```tsx
import { Reveal } from '@/components/apple/Reveal'

// Placeholder copy — final copy pending.
export function HighlightsRailMock() {
  return (
    <section style={{ padding: 'clamp(48px,8vw,96px) 24px', background: '#F2EFE9' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <Reveal variant="light">
          <div
            className="card-warm"
            style={{
              maxWidth: 420,
              margin: '0 auto',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)',
              background: '#0F0F0F',
              padding: 24,
            }}
          >
            <span className="font-mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#F4B183' }}>
              email → clipboard
            </span>
            <p style={{ fontSize: 14, color: '#E5E5E5', marginTop: 10, lineHeight: 1.5 }}>
              [Placeholder — screenshot an email, the reply&rsquo;s in your clipboard.]
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Insert it after the feature blocks in `app/page.tsx`**

Add directly after `<AskBlock />`:

```tsx
        <HighlightsRailMock />
```

Add the import:

```tsx
import { HighlightsRailMock } from '@/components/light/HighlightsRailMock'
```

- [ ] **Step 3: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`. Expected: the email→clipboard card now appears right after the Ask block, on the `#F2EFE9` alt background.

- [ ] **Step 4: Commit and push**

```bash
git add components/light/HighlightsRailMock.tsx app/page.tsx
git commit -m "feat: add email-to-clipboard highlights rail"
git push
```

---

### Task 7: Archive the manifesto and cross-device sections

**Files:**
- Create: `components/_archive/WhyNothingSection.tsx` (moved)
- Create: `components/_archive/WhyNotPhoneSection.tsx` (moved)
- Delete: `components/WhyNothingSection.tsx`
- Delete: `components/WhyNotPhoneSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:** none (these components are no longer imported by any page after this task).

- [ ] **Step 1: Remove their usage from `app/page.tsx`**

Remove these two lines from `app/page.tsx`:

```tsx
        {/* Cross-device */}
        <WhyNotPhoneSection />

        {/* Brand manifesto */}
        <WhyNothingSection />
```

Remove their imports:

```tsx
import { WhyNothingSection }  from '@/components/WhyNothingSection'
import { WhyNotPhoneSection } from '@/components/WhyNotPhoneSection'
```

- [ ] **Step 2: Move both files to `components/_archive/`, preserving history**

```bash
mkdir -p components/_archive
git mv components/WhyNothingSection.tsx components/_archive/WhyNothingSection.tsx
git mv components/WhyNotPhoneSection.tsx components/_archive/WhyNotPhoneSection.tsx
```

- [ ] **Step 3: Add an archive note to the top of each moved file**

At the very top of `components/_archive/WhyNothingSection.tsx`, add:

```tsx
// ARCHIVED 2026-08-19 — not rendered anywhere. Cut from the light rebuild
// per docs/superpowers/specs/2026-08-19-landing-page-rebuild-design.md
// (no reference sites carry a manifesto section). Kept as source material
// for the hero subhead copy later.
```

At the very top of `components/_archive/WhyNotPhoneSection.tsx`, add:

```tsx
// ARCHIVED 2026-08-19 — not rendered anywhere. Its point was absorbed into
// components/light/ProblemStatement.tsx as one line instead of a full
// section (design spec §4). Kept as original phrasing to work from.
```

- [ ] **Step 4: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors — both files still compile (they still import `Chapter`/`Reveal` from `components/apple/`, which are untouched), they're just unreferenced by any route now.

Run: `npm run dev`. Expected: no visible change from Task 6's state (these two sections were already effectively superseded; this task just completes the cleanup).

- [ ] **Step 5: Commit and push**

```bash
git add -A
git commit -m "chore: archive superseded manifesto and cross-device sections"
git push
```

---

### Task 8: Privacy columns

**Files:**
- Create: `components/light/PrivacyColumns.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Reveal` (`variant="light"`).
- Produces: `PrivacyColumns(): JSX.Element`.

- [ ] **Step 1: Create `components/light/PrivacyColumns.tsx`**

```tsx
import { Reveal } from '@/components/apple/Reveal'

const COLUMNS = [
  { title: 'stays on your machine', body: 'it sees your screen, so it runs locally. nothing is sent to a server unless you choose to.' },
  { title: 'never trained on', body: "what you capture is yours. we don't see it, we don't use it, we don't improve our model with it." },
  {
    title: 'you control retention',
    body: '[Placeholder — non-numeric retention language pending final policy copy. Do not state a specific day count (e.g. "90 days") until real policy language is supplied.]',
  },
]

export function PrivacyColumns() {
  return (
    <section id="privacy" style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#F2EFE9' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Reveal variant="light">
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
            privacy
          </span>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ marginTop: 24 }}>
          {COLUMNS.map((c, i) => (
            <Reveal key={c.title} variant="light" index={i}>
              <div className="card-warm" style={{ background: '#FAF8F5', border: '1px solid #E5E0D8', borderRadius: 12, padding: 24, height: '100%' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 8, lineHeight: 1.6 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace `<PrivacySection />` in `app/page.tsx`**

Replace:

```tsx
        {/* Privacy */}
        <PrivacySection />
```

with:

```tsx
        {/* Privacy */}
        <PrivacyColumns />
```

Replace the import:

```tsx
import { PrivacySection }     from '@/components/PrivacySection'
```

with:

```tsx
import { PrivacyColumns } from '@/components/light/PrivacyColumns'
```

(`components/PrivacySection.tsx` itself is left in place, unreferenced — it's real, non-fabricated copy someone may want to reuse later, unlike the reviews in Task 9. Leaving it as dead code is fine; it is not part of this plan's cleanup scope.)

- [ ] **Step 3: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`. Expected: after the highlights rail, a light `#F2EFE9` privacy section with 3 cards now appears instead of the old dark one.

- [ ] **Step 4: Commit and push**

```bash
git add components/light/PrivacyColumns.tsx app/page.tsx
git commit -m "feat: replace privacy section with light 3-column version"
git push
```

---

### Task 9: Remove fabricated reviews

**Files:**
- Delete: `components/ReviewsSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:** none.

- [ ] **Step 1: Replace `<ReviewsSection />` in `app/page.tsx` with a commented empty slot**

Replace:

```tsx
        {/* Wall of love */}
        <ReviewsSection />
```

with:

```tsx
        {/* Social proof — intentionally empty. The previous 14 testimonials
            here were fabricated quotes attributed to people who don't exist
            and have been removed sitewide (design spec §4, item 9). Fill
            with real quotes/logos once available — do not invent content. */}
```

Remove the import:

```tsx
import { ReviewsSection }     from '@/components/ReviewsSection'
```

- [ ] **Step 2: Delete the file**

```bash
git rm components/ReviewsSection.tsx
```

- [ ] **Step 3: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`. Expected: no reviews/testimonials section appears anywhere on the page; the privacy section is now followed directly by whatever Task 10 adds (or, until Task 10 lands, directly by the old dark "at a glance" stat grid + waitlist section still further down).

- [ ] **Step 4: Commit and push**

```bash
git add app/page.tsx
git commit -m "fix: remove fabricated testimonials, leave empty social-proof slot"
git push
```

---

### Task 10: Download CTA + light Footer, completing `app/page.tsx`

**Files:**
- Create: `components/light/DownloadCta.tsx`
- Create: `components/light/Footer.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Reveal` (`variant="light"`).
- Produces: `DownloadCta(): JSX.Element`, `Footer(): JSX.Element`.

- [ ] **Step 1: Create `components/light/DownloadCta.tsx`**

```tsx
import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'

// Placeholder copy — final copy pending.
export function DownloadCta() {
  return (
    <section style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#FAF8F5', textAlign: 'center' }}>
      <Reveal variant="light">
        <h2 style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 'clamp(32px,4.5vw,48px)', color: '#1A1A1A' }}>
          [Placeholder — download CTA headline]
        </h2>
        <p style={{ fontSize: 16, color: '#6B6B6B', marginTop: 12 }}>
          Windows · 3-day free trial, then $9.99/mo
        </p>
        <Link href="/download" className="btn-warm" style={{ display: 'inline-flex', marginTop: 24, padding: '16px 36px', fontSize: 16 }}>
          Download for Windows
        </Link>
        <p className="font-mono" style={{ fontSize: 12, color: '#6B6B6B', marginTop: 14 }}>
          macOS coming soon
        </p>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/light/Footer.tsx`**

Copy the four SVG icon blocks verbatim from `components/Footer.tsx` (the `SOCIALS` array, lines defining X/TikTok/Instagram/LinkedIn `viewBox`/`path` markup) into this file's `SOCIALS` array unchanged — only the surrounding link's color token changes (`#6B6B6B`, hover `#1A1A1A`, via `link-warm`).

```tsx
import type { ReactNode } from 'react'

const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
  // Paste the 4 icon objects from components/Footer.tsx's SOCIALS array here
  // verbatim (same label/href/svg path data) — real, existing social accounts.
]

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'product',
    links: [
      { href: '#capture', label: 'capture' },
      { href: '#daily-note', label: 'daily note' },
      { href: '#ask', label: 'ask' },
      { href: '#privacy', label: 'privacy' },
    ],
  },
  { title: 'get it', links: [{ href: '/download', label: 'download' }] },
  {
    title: 'company',
    links: [
      { href: 'mailto:hi@trynothingai.com', label: 'contact' },
      { href: '/privacy', label: 'privacy policy' },
    ],
  },
]

export function Footer() {
  return (
    <footer role="contentinfo" style={{ borderTop: '1px solid #E5E0D8', background: '#FAF8F5', padding: '48px 24px' }}>
      <div className="mx-auto flex flex-col gap-8" style={{ maxWidth: 980 }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {COLUMNS.map(col => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2">
              <div className="font-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                {col.title}
              </div>
              {col.links.map(l => (
                <a key={l.label} href={l.href} className="link-warm" style={{ fontSize: 13, padding: '4px 0' }}>
                  {l.label}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4" style={{ borderTop: '1px solid #E5E0D8', paddingTop: 24 }}>
          <p className="font-mono" style={{ fontSize: 12, color: '#6B6B6B' }}>© 2026 nothing.ai</p>
          <div className="flex items-center gap-4" aria-label="Social links">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="link-warm"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, color: '#6B6B6B' }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Replace the tail of `app/page.tsx`**

Replace this whole block (the "at a glance" `Chapter` through the waitlist `div`):

```tsx
        {/* At-a-glance specs — Apple product pages close with one */}
        <Chapter
          defer
          eyebrow="at a glance"
          ...
        </Chapter>

        {/* Waitlist */}
        <div className="w-full flex justify-center" style={{ padding: 'clamp(80px, 12vw, 160px) 16px' }}>
          <WaitlistSection />
        </div>

        <Footer />
```

with:

```tsx
        {/* Download CTA */}
        <DownloadCta />

        <Footer />
```

Update imports: remove `import { WaitlistSection } from '@/components/WaitlistSection'` and the old `import { Footer } from '@/components/Footer'`; add:

```tsx
import { DownloadCta } from '@/components/light/DownloadCta'
import { Footer }      from '@/components/light/Footer'
```

- [ ] **Step 4: Remove now-fully-unused old imports from `app/page.tsx`**

Read through the file's remaining import list and delete any that are no longer referenced anywhere in the file (candidates, verify each with a search before removing: `Fn`, `Chapter`, `MacWindow`, `Reveal` from `components/apple/` if unused, `StatGrid`, `HighlightsRail`, `DemoVideo`, `AskHero`). Leave `components/apple/*` and `components/features/AskHero.tsx` files themselves in place — they're unused now but out of this plan's cleanup scope.

- [ ] **Step 5: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors, no unused-import warnings.

Run: `npm run dev`, scroll the full homepage top to bottom. Expected: **the entire homepage is now light-themed, top to bottom** — Nav → Hero → Problem statement → Capture/Daily Note/Ask blocks → email rail → Privacy columns → (empty social-proof gap) → Download CTA → Footer. No dark sections remain.

- [ ] **Step 6: Commit and push**

```bash
git add components/light/DownloadCta.tsx components/light/Footer.tsx app/page.tsx
git commit -m "feat: complete homepage rebuild with download CTA and light footer"
git push
```

---

### Task 11: Restyle `/download` + secondary Mac waitlist capture

**Files:**
- Create: `components/light/InstallSteps.tsx`
- Create: `components/light/MacWaitlistCapture.tsx`
- Modify: `app/download/page.tsx`
- Modify: `app/download/DownloadKick.tsx`

**Interfaces:**
- Consumes: `WarmPage`, `Nav`, `Footer` (Task 3/10); `Reveal` (`variant="light"`); `capture`, `getSource` from `@/lib/posthog` (existing).
- Produces: `InstallSteps(): JSX.Element`, `MacWaitlistCapture(): JSX.Element`.

- [ ] **Step 1: Create `components/light/InstallSteps.tsx`**

```tsx
import { Reveal } from '@/components/apple/Reveal'

const STEPS = [
  { label: '01 · run', stat: 'Open the installer.', body: 'NothingAI-Setup.exe — from your downloads bar or folder.' },
  { label: '02 · smartscreen', stat: '"More info" → "Run anyway."', body: 'Windows warns about apps it hasn’t seen before. nothing.ai is safe — it runs entirely on your machine.' },
  { label: '03 · summon', stat: 'Press ⊞ ⇧ S.', body: 'that’s it. snip anything — it reads it and acts. no window to find.' },
]

export function InstallSteps() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ maxWidth: 900, margin: '0 auto' }}>
      {STEPS.map((s, i) => (
        <Reveal key={s.label} variant="light" index={i}>
          <div className="card-warm" style={{ background: '#F2EFE9', border: '1px solid #E5E0D8', borderRadius: 12, padding: 24, height: '100%' }}>
            <div className="font-mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A', marginTop: 8 }}>{s.stat}</div>
            <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 8, lineHeight: 1.55 }}>{s.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create `components/light/MacWaitlistCapture.tsx`**

```tsx
'use client'

import { useId, useState } from 'react'
import { capture, getSource } from '@/lib/posthog'

// The waitlist is NOT deprecated — its 127 real Resend Audience contacts are
// the launch list. This is its new, secondary home (design spec §7): the
// homepage's primary CTA is Download; this is for macOS-only visitors.
export function MacWaitlistCapture() {
  const emailId = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'loading' || state === 'success' || !email.trim()) return
    setState('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = (await res.json()) as { ok?: boolean }
      if (!res.ok || !data.ok) throw new Error('request failed')
      setState('success')
      capture('waitlist_signup', { source: getSource(), location: 'download_mac_waitlist' })
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return <p style={{ fontSize: 14, color: '#6B6B6B' }}>you&rsquo;re on the list — we&rsquo;ll email you when macOS ships.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2" style={{ maxWidth: 380, margin: '0 auto' }} aria-label="macOS waitlist">
      <label htmlFor={emailId} className="sr-only">Email</label>
      <input
        id={emailId}
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={state === 'loading'}
        style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E0D8', background: '#FAF8F5', color: '#1A1A1A', fontSize: 14 }}
      />
      <button type="submit" disabled={state === 'loading'} className="btn-warm" style={{ padding: '10px 18px', fontSize: 13 }}>
        {state === 'loading' ? 'sending…' : 'notify me'}
      </button>
      {state === 'error' && <p role="alert" style={{ fontSize: 12, color: '#B3261E' }}>something went wrong — try again.</p>}
    </form>
  )
}
```

- [ ] **Step 3: Rewrite `app/download/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { WarmPage } from '@/components/light/WarmPage'
import { Nav } from '@/components/light/Nav'
import { Footer } from '@/components/light/Footer'
import { Reveal } from '@/components/apple/Reveal'
import { InstallSteps } from '@/components/light/InstallSteps'
import { MacWaitlistCapture } from '@/components/light/MacWaitlistCapture'
import { DownloadKick } from './DownloadKick'

export const metadata: Metadata = {
  title: 'Download — nothing.ai',
  description:
    'Download nothing.ai for Windows — the faceless desktop AI that makes your screenshots smarter. 3-day free trial, then $9.99/mo.',
}

export default function DownloadPage() {
  return (
    <WarmPage>
      <Nav />
      <main id="main-content">
        <section
          className="flex flex-col items-center text-center"
          style={{ padding: 'clamp(64px, 10vw, 140px) 24px clamp(80px, 12vw, 160px)' }}
          aria-label="Download nothing.ai"
        >
          <div className="flex flex-col items-center gap-[18px]" style={{ maxWidth: 820 }}>
            <Reveal variant="light" index={0}>
              <div className="font-mono" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                download
              </div>
            </Reveal>
            <Reveal variant="light" index={1}>
              <h1 style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 'clamp(32px,5vw,52px)', color: '#1A1A1A' }}>
                Almost there.
              </h1>
            </Reveal>
            <Reveal variant="light" index={2}>
              <p style={{ fontSize: 17, lineHeight: 1.5, color: '#6B6B6B', maxWidth: 560 }}>
                nothing.ai for Windows is on its way. it lives in{' '}
                <span className="font-mono" style={{ color: '#1A1A1A' }}>⊞ ⇧ S</span> — here&rsquo;s how to wake it up.
              </p>
            </Reveal>
            <Reveal variant="light" index={3}>
              <DownloadKick />
            </Reveal>
          </div>

          <div className="w-full" style={{ marginTop: 'clamp(48px, 7vw, 88px)' }}>
            <InstallSteps />
          </div>

          <Reveal variant="light">
            <div className="font-mono flex flex-wrap items-center justify-center gap-x-[18px] gap-y-[6px]" style={{ fontSize: 12, color: '#6B6B6B', marginTop: 'clamp(36px, 5vw, 56px)' }}>
              <span>Windows 10/11 · 64-bit</span>
              <span aria-hidden="true">·</span>
              <span>3-day free trial, then $9.99/mo — sign in inside the app</span>
            </div>
          </Reveal>

          <Reveal variant="light">
            <div style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid #E5E0D8', width: '100%', maxWidth: 420 }}>
              <p className="font-mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 14 }}>
                macOS coming soon
              </p>
              <MacWaitlistCapture />
            </div>
          </Reveal>

          <Reveal variant="light">
            <Link href="/" className="link-warm" style={{ fontSize: 13, marginTop: 28, display: 'inline-block', padding: '6px 0' }}>
              back to nothing.ai ›
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </WarmPage>
  )
}
```

- [ ] **Step 4: Restyle `app/download/DownloadKick.tsx`**

Replace the two inline-styled elements' tokens — change:

```tsx
      <p className="font-mono" style={{ fontSize: 12, color: 'var(--ghost2)' }} aria-live="polite">
```

to:

```tsx
      <p className="font-mono" style={{ fontSize: 12, color: '#6B6B6B' }} aria-live="polite">
```

and change:

```tsx
      <a
        href="/download/latest"
        className="cta-link"
        style={{ fontSize: 15 }}
```

to:

```tsx
      <a
        href="/download/latest"
        className="link-warm"
        style={{ fontSize: 15, color: '#C2410C' }}
```

- [ ] **Step 5: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000/download`. Expected: full light theme, install steps in 3 cards, macOS waitlist form at the bottom. Submit a test email in the Mac waitlist form; expected: `POST /api/waitlist` returns `{ ok: true }` (check Network tab) and the form shows the success message — this proves `/api/waitlist` still works untouched.

- [ ] **Step 6: Commit and push**

```bash
git add components/light/InstallSteps.tsx components/light/MacWaitlistCapture.tsx app/download/page.tsx app/download/DownloadKick.tsx
git commit -m "feat: restyle /download to the light system, add secondary Mac waitlist"
git push
```

---

### Task 12: Restyle `/privacy`

**Files:**
- Modify: `app/privacy/page.tsx`

**Interfaces:** none new — consumes `WarmPage`, `Nav`, `Footer` from Task 3/10.

- [ ] **Step 1: Update imports and token usage in `app/privacy/page.tsx`**

Replace:

```tsx
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
```

with:

```tsx
import { WarmPage } from '@/components/light/WarmPage'
import { Nav } from '@/components/light/Nav'
import { Footer } from '@/components/light/Footer'
```

Replace the token definition:

```tsx
const link = { color: 'var(--mist)', textDecoration: 'underline' } as const
```

with:

```tsx
const link = { color: '#C2410C', textDecoration: 'underline' } as const
```

Wrap the return value in `WarmPage` and swap every remaining `var(--mist)`/`var(--ghost)`/`var(--ghost2)` inline style value in the file:
- `var(--mist)` → `#1A1A1A`
- `var(--ghost)` → `#6B6B6B`
- `var(--ghost2)` → `#6B6B6B`

Replace:

```tsx
  return (
    <>
      <Nav />
      <main
```

with:

```tsx
  return (
    <WarmPage>
      <Nav />
      <main
```

and the closing:

```tsx
      </main>
      <Footer />
    </>
  )
}
```

with:

```tsx
      </main>
      <Footer />
    </WarmPage>
  )
}
```

(Leave every section's title/body text content completely unchanged — this task is a token swap only, per design spec §7: "legal content unchanged.")

- [ ] **Step 2: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000/privacy`. Expected: same legal text as before, now on the light warm background with dark ink text and amber links.

- [ ] **Step 3: Commit and push**

```bash
git add app/privacy/page.tsx
git commit -m "feat: restyle /privacy to the light system"
git push
```

---

### Task 13: Restyle `/confirmed` and `/subscribed`

**Files:**
- Modify: `app/confirmed/page.tsx`
- Modify: `app/subscribed/page.tsx`

**Interfaces:** none new — consumes `WarmPage`, `Nav`, `Footer` from Task 3/10.

- [ ] **Step 1: Update `app/confirmed/page.tsx`**

Replace the imports:

```tsx
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
```

with:

```tsx
import { WarmPage } from '@/components/light/WarmPage'
import { Nav } from '@/components/light/Nav'
import { Footer } from '@/components/light/Footer'
```

Wrap the return in `WarmPage` (same pattern as Task 12, Step 1) and swap all inline tokens:
- `var(--phosphor)` → `#C2410C`
- `var(--phosphor-glow)` → replace `boxShadow: '0 0 20px var(--phosphor-glow)'` with `boxShadow: '0 0 0 rgba(0,0,0,0)'` (drop the glow — it was a dark-theme-specific effect; a plain amber-outlined circle reads fine on the light ground without it)
- `var(--mist)` → `#1A1A1A`
- `var(--ghost)` → `#6B6B6B`
- `var(--ghost2)` → `#6B6B6B`
- The `btn-phosphor` className on the "back to nothing.ai" link → `btn-warm`

Leave all copy text unchanged.

- [ ] **Step 2: Update `app/subscribed/page.tsx`**

Apply the identical set of changes as Step 1 (same imports, same `WarmPage` wrap, same token swaps, same `btn-phosphor` → `btn-warm`). Leave all copy text unchanged.

- [ ] **Step 3: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000/confirmed` and `http://localhost:3000/subscribed`. Expected: both show the light warm theme, amber checkmark circle, amber "back to nothing.ai" button, unchanged copy.

- [ ] **Step 4: Commit and push**

```bash
git add app/confirmed/page.tsx app/subscribed/page.tsx
git commit -m "feat: restyle /confirmed and /subscribed to the light system"
git push
```

---

### Task 14: Regenerate the OG image and root metadata

**Files:**
- Modify: `app/opengraph-image.tsx`
- Modify: `app/layout.tsx`

**Interfaces:** none new.

- [ ] **Step 1: Rewrite `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'

// Social share card (1200×630), rendered at build time. Placeholder copy —
// final copy pending, matches the new capture/daily-note/ask narrative
// (design spec §8).

export const alt = 'nothing.ai — capture, and it finds its way into your day'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#FAF8F5',
          color: '#1A1A1A',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', fontSize: 30, letterSpacing: 4 }}>
            <span style={{ color: '#1A1A1A' }}>nothing</span>
            <span style={{ color: '#C2410C' }}>.ai</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ fontSize: 68, fontWeight: 600, letterSpacing: -2, lineHeight: 1.08, color: '#1A1A1A', maxWidth: 940 }}>
            [Placeholder headline — final copy pending]
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: '#6B6B6B', maxWidth: 880 }}>
            [Placeholder subline — capture, daily note, ask across every day. Final copy pending.]
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 1, color: '#C2410C' }}>
            trynothingai.com
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#6B6B6B' }}>
            3-day free trial · $9.99/mo
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
```

- [ ] **Step 2: Update the root metadata placeholder copy in `app/layout.tsx`**

Replace:

```ts
  title: 'nothing.ai — make your screenshots smarter',
  description: 'the ai that lives in your copy and paste. your life happens in pictures, not words.',
  openGraph: {
    title: 'nothing.ai — make your screenshots smarter',
    description: 'the ai that lives in your copy and paste. your life happens in pictures, not words.',
    url: 'https://trynothingai.com',
    siteName: 'nothing.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nothing.ai — make your screenshots smarter',
    description: 'the ai that lives in your copy and paste.',
  },
```

with:

```ts
  title: '[Placeholder] nothing.ai — capture, and it finds its way into your day',
  description: '[Placeholder — final copy pending] one hotkey. it resurfaces as your day, searchable across every day you’ve captured.',
  openGraph: {
    title: '[Placeholder] nothing.ai — capture, and it finds its way into your day',
    description: '[Placeholder — final copy pending] one hotkey. it resurfaces as your day, searchable across every day you’ve captured.',
    url: 'https://trynothingai.com',
    siteName: 'nothing.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '[Placeholder] nothing.ai — capture, and it finds its way into your day',
    description: '[Placeholder — final copy pending]',
  },
```

- [ ] **Step 3: Typecheck, lint, and manually verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000/opengraph-image`. Expected: a 1200×630 light-themed card renders with the amber `.ai` wordmark.

- [ ] **Step 4: Commit and push**

```bash
git add app/opengraph-image.tsx app/layout.tsx
git commit -m "feat: regenerate OG image and root metadata for the new narrative"
git push
```

---

### Task 15: Remove the now-unused GSAP dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (regenerated by npm)

**Interfaces:** none.

- [ ] **Step 1: Confirm GSAP is genuinely unused**

Run: `grep -rl "gsap" --include=*.tsx --include=*.ts . | grep -v node_modules`
Expected output: only `components/apple/HeroStage.tsx` (the old hero-stage component, no longer imported by any page after Task 3 replaced `AppleHero`). Confirm with: `grep -rl "HeroStage" --include=*.tsx --include=*.ts . | grep -v node_modules` — expected: only the file itself, no importers.

- [ ] **Step 2: Remove the dependencies**

```bash
npm uninstall gsap @gsap/react
```

- [ ] **Step 3: Typecheck, lint, and build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass. (`components/apple/HeroStage.tsx` will show an unresolved-import error only if something still references `gsap` — if the build fails here, stop and re-check Step 1; do not delete `HeroStage.tsx` itself, it's out of this plan's cleanup scope, just leave it as unreferenced dead code that happens to import a now-removed package, which is only a problem if TypeScript's build actually type-checks unreferenced files — if it does error, add `// @ts-nocheck` is not appropriate; instead, in that case, delete `components/apple/HeroStage.tsx` since it is provably dead code with no importers.)

- [ ] **Step 4: Commit and push**

```bash
git add package.json package-lock.json
git commit -m "chore: remove unused gsap dependency"
git push
```

---

### Task 16: Final verification pass and asset inventory

**Files:** none (verification only).

- [ ] **Step 1: Full typecheck, lint, and production build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all three pass cleanly.

- [ ] **Step 2: Viewport check**

Run: `npm run dev`. In the browser devtools, check the homepage, `/download`, `/privacy`, `/confirmed`, `/subscribed` at 375px, 768px, and 1440px widths. Expected: no horizontal overflow, no overlapping text, feature blocks stack to one column below `md` breakpoint.

- [ ] **Step 3: Reduced-motion check**

Enable "reduce motion" in OS settings (or emulate via Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce"). Reload the homepage. Expected: all `Reveal`-wrapped content renders immediately in its final position (no fade/translate), and the hero loop shows only its first frame (Slack message) with no hotkey/pill/note animation.

- [ ] **Step 4: PostHog event spot-check**

With the browser devtools Network tab open, submit the `/download` page's macOS waitlist form. Expected: a request fires to PostHog's ingestion endpoint (or console-logs if `NEXT_PUBLIC_POSTHOG_KEY` is unset locally) carrying a `waitlist_signup` event with `location: 'download_mac_waitlist'`.

- [ ] **Step 5: `/reset` regression check**

Open `http://localhost:3000/reset`. Expected: unchanged — still the original dark theme, since it was never touched.

- [ ] **Step 6: Lighthouse check**

Run a production build and serve it, then audit the homepage:

```bash
npm run build
npm run start
```

In Chrome DevTools → Lighthouse (or `npx lighthouse http://localhost:3000 --view`), run a Performance + Accessibility audit against `http://localhost:3000`. Expected: Performance > 90, Accessibility > 95 (design spec §9). If either falls short, note the specific failing audits (e.g. image sizing, contrast, missing alt text) rather than treating the whole pass as blocked — file them as follow-ups if they're pre-existing (e.g. from unrelated old dark-theme routes) rather than introduced by this rebuild.

- [ ] **Step 7: Push the branch and report the asset inventory**

```bash
git push
```

Produce this checklist as the task's output (this is the deliverable from design spec §8 — every mock that needs a real screen recording/screenshot before launch):

- [ ] Hero loop (`components/light/HeroLoop.tsx`) — capture → daily note sequence
- [ ] Capture pill — idle and time-bound states (`components/light/CapturePillMock.tsx`)
- [ ] Daily note overlay — note, strip, and close-out states (`components/light/DailyNoteOverlayMock.tsx`)
- [ ] Ask/search — query + results state (`components/light/DailyNoteOverlayMock.tsx`, `mode="search"`)
- [ ] OG image (`app/opengraph-image.tsx`) — currently placeholder copy on the new visual system, needs final copy

Do not merge this branch to `master`. Report the branch name (`rebuild/light-theme`) and its Vercel preview URL (check the Vercel dashboard or `vercel ls` for the preview deployment) back to the user for review before any merge decision is made.
