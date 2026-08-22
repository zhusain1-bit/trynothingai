# Animation Fixes and Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three concrete rendering bugs in the homepage animations, adopt the `motion` library scoped to just the hero's convergence choreography, correct stale privacy/pricing copy against the shipped v0.1.10 product, and add four new homepage sections (pricing, trust signals, feature grid, FAQ).

**Architecture:** No new routes. All work is edits to existing components in `components/light/`, `app/page.tsx`, `app/privacy/page.tsx`, `app/download/page.tsx`, plus four new section components wired into the existing single-page homepage. One new npm dependency (`motion`). *(Post-implementation amendment: originally scoped to touch only `HeroAnimation.tsx`; a Task 5 fix round found that wrapping `EntryRow` externally produced invalid `<li><li>` markup, so `EntryRow` itself gained optional, no-op-when-absent `layoutId`/`transition` props instead — `motion/react` is now imported by both `HeroAnimation.tsx` and `DailyNoteOverlayMock.tsx`, though only the hero's convergence choreography actually animates. See spec §2's amendment.)*

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4 (inline styles are this codebase's dominant pattern — follow it, don't introduce Tailwind classes for new layout that doesn't already use them), `motion` (new).

**Spec:** `docs/superpowers/specs/2026-08-21-animation-fixes-and-content-expansion-design.md`

## Global Constraints

- No BYOK (bring-your-own-key) language anywhere in marketing copy — it stays app-internal only (Settings → Account).
- Pricing copy everywhere on the site: **40 free captures, then $9.99/mo — cancel anytime.** Never "early access," never "3-day trial."
- No new npm dependencies beyond `motion` (§ Task 4).
- No dark-mode toggle, no blog, no docs site, no `/pricing` or `/faq` routes — new sections live on the existing homepage.
- Every animation change must be verified visually in the browser (`npm run dev`), not just by reading the code — the bugs this plan fixes were only visible as rendered output.
- `prefers-reduced-motion: reduce` must keep rendering the settled/final state with no animation, for every component touched.
- Colors/type: warm palette (`#FAF8F5` background, `#F2EFE9` alt background, `#1A1A1A` ink, `#6B6B6B` ink-2, `#C2410C`/`var(--amber)` accent used sparingly), Instrument Serif for headings (`var(--font-instrument-serif), Georgia, serif`), Inter for body/UI, `.font-mono` for eyebrows/labels — match every existing section's exact styling conventions, don't invent new ones.
- This project has no automated test suite (verified: `package.json` has no test runner). Verification for every task is `npm run typecheck`, `npm run build`, and a manual visual check via `npm run dev` — not unit tests. Don't invent a test framework.

---

### Task 1: Fix `HeroAnimation.tsx` text clipping (spec §1a)

**Files:**
- Modify: `components/light/HeroAnimation.tsx` (the `listing` case inside `DetailCard`, currently around line 87-94)

**Interfaces:** None — single-element style change, no new props or exports.

- [ ] **Step 1: Locate and read the current `listing` case**

Confirm the current code reads exactly:

```tsx
  if (id === 'listing') {
    return (
      <div style={{ padding: 8 }}>
        <div aria-hidden="true" style={{ height: 40, borderRadius: 6, background: 'linear-gradient(135deg,#E5E0D8,#D8D4CC)' }} />
        <p style={{ fontSize: 9, color: '#1A1A1A', margin: '6px 0 0', whiteSpace: 'nowrap' }}>543 East 6th · $2.4M</p>
      </div>
    )
  }
```

This `<p>` has `whiteSpace: 'nowrap'` but no `overflow`/`textOverflow`, so the outer card's `overflow: 'hidden'` (set where `CARDS.map` renders the card wrapper) clips it mid-character instead of the text truncating gracefully — this is the bug in the first screenshot the user shared ("$2.4M" cut off).

- [ ] **Step 2: Add ellipsis handling**

```tsx
  if (id === 'listing') {
    return (
      <div style={{ padding: 8 }}>
        <div aria-hidden="true" style={{ height: 40, borderRadius: 6, background: 'linear-gradient(135deg,#E5E0D8,#D8D4CC)' }} />
        <p style={{ fontSize: 9, color: '#1A1A1A', margin: '6px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>543 East 6th · $2.4M</p>
      </div>
    )
  }
```

- [ ] **Step 3: Verify with typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Visual check**

Run `npm run dev`, open the homepage, scroll the hero into view, watch a full 16s loop (or reload a couple times to see the scattered phase). Confirm "543 East 6th · $2.4M" now ends in `…` instead of clipping mid-character if it's still too wide, or fits cleanly.

- [ ] **Step 5: Commit**

```bash
git add components/light/HeroAnimation.tsx
git commit -m "fix: ellipsis on hero listing card instead of mid-character clip"
```

---

### Task 2: Remove the "email → clipboard" section (spec §1d)

**Files:**
- Delete: `components/light/HighlightsRailMock.tsx`
- Modify: `app/page.tsx`

**Interfaces:** Removes the `HighlightsRailMock` export entirely — confirm nothing else imports it first.

- [ ] **Step 1: Confirm no other usages**

Run: `grep -rn "HighlightsRailMock" app components --include="*.tsx"`
Expected: only `components/light/HighlightsRailMock.tsx` itself and its one import in `app/page.tsx`.

- [ ] **Step 2: Delete the component file**

```bash
git rm components/light/HighlightsRailMock.tsx
```

- [ ] **Step 3: Remove its usage from the homepage**

In `app/page.tsx`, remove this import line:

```tsx
import { HighlightsRailMock }  from '@/components/light/HighlightsRailMock'
```

and remove this usage (currently directly after `<FeatureBlocksSection />`):

```tsx
        <FeatureBlocksSection />
        <HighlightsRailMock />
```

becomes:

```tsx
        <FeatureBlocksSection />
```

- [ ] **Step 4: Verify with typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both succeed, no unresolved-import errors.

- [ ] **Step 5: Visual check**

Run `npm run dev`, confirm the "email → clipboard" card no longer appears between the feature blocks and the privacy section.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: remove email-to-clipboard section (not a shipped feature)"
```

---

### Task 3: Fix `CapturePillMock` overlapping content above it (spec §1c)

**Files:**
- Modify: `components/light/CaptureDemo.tsx`
- Modify: `components/light/CapturePillMock.tsx`

**Interfaces:**
- `CapturePillMock`'s props (`state`, `timeLabel`, `placeholder`, `visible`) are unchanged — only its internal `bottom` positioning value changes.
- `CaptureDemo`'s exported `CaptureDemo()` component signature is unchanged (no props).

The root cause: the pill is `position: absolute`, `bottom: 80` (a fixed pixel value) inside `CaptureDemo`'s `aspect-ratio: 16/10` box, while `CaptureContextMock`'s four message rows sit in normal document flow starting at the top of that same box. At the container's actual rendered size, `bottom: 80` lands inside the message-row zone instead of below it. Fix: restructure `CaptureDemo` so the message content and the pill each get their own non-overlapping vertical region via flexbox, instead of positioning the pill with a magic-number offset against the whole box.

- [ ] **Step 1: Read the current `CaptureDemo.tsx` return block**

Confirm it currently reads:

```tsx
  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: '16/10' }}>
      <CaptureContextMock />
      <div
        aria-hidden="true"
        className={`absolute font-mono capture-demo-press${displayPhase === 'press' ? ' active' : ''}`}
        style={{ top: '42%', left: '50%', fontSize: 16, letterSpacing: 1.5, color: 'var(--app-accent)', opacity: 0 }}
      >
        Ctrl ⇧ Space
      </div>
      <CapturePillMock state="time-bound" timeLabel="4:00 PM" visible={displayPhase === 'pill'} />
    </div>
  )
```

- [ ] **Step 2: Restructure into a reserved-footer flex layout**

```tsx
  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: '16/10' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <CaptureContextMock />
        </div>
        {/* Reserved footer strip — CapturePillMock anchors inside this fixed-
            height band, so it can never overlap the message rows above it
            regardless of the container's actual rendered width/height. */}
        <div style={{ flexShrink: 0, height: 72 }} />
      </div>
      <div
        aria-hidden="true"
        className={`absolute font-mono capture-demo-press${displayPhase === 'press' ? ' active' : ''}`}
        style={{ top: '42%', left: '50%', fontSize: 16, letterSpacing: 1.5, color: 'var(--app-accent)', opacity: 0 }}
      >
        Ctrl ⇧ Space
      </div>
      <CapturePillMock state="time-bound" timeLabel="4:00 PM" visible={displayPhase === 'pill'} />
    </div>
  )
```

- [ ] **Step 3: Move `CapturePillMock`'s anchor inside the reserved strip**

In `components/light/CapturePillMock.tsx`, change the fixed `bottom: 80` to sit within the new 72px reserved strip instead of the whole container:

```tsx
      style={{
        bottom: 16,
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
```

(was `bottom: 80` — the new reserved-footer layout in `CaptureDemo.tsx` means `bottom: 16` now measures from the bottom of the whole box, landing well inside the empty 72px strip instead of the message content above it.)

- [ ] **Step 4: Verify with typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Visual check at two widths**

Run `npm run dev`, open the homepage's Capture feature block. Resize the browser to a narrow width (~375px) and a wide desktop width. In both, watch a full capture-demo loop and confirm the pill never overlaps the "Priya · tour at 4" row or any other message row.

- [ ] **Step 6: Commit**

```bash
git add components/light/CaptureDemo.tsx components/light/CapturePillMock.tsx
git commit -m "fix: reserve footer space so capture pill never overlaps message rows"
```

---

### Task 4: Add the `motion` dependency

**Files:**
- Modify: `package.json`, `package-lock.json`

**Interfaces:** Makes `motion/react` importable in subsequent tasks.

- [ ] **Step 1: Install**

```bash
npm install motion
```

- [ ] **Step 2: Verify it installed cleanly**

Run: `npm run typecheck && npm run build`
Expected: both succeed (this only adds a dependency, no code uses it yet).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add motion dependency for hero convergence animation"
```

---

### Task 5: Rewrite `HeroAnimation.tsx` convergence with Motion shared-layout transitions (spec §1b, §2)

**Files:**
- Modify: `components/light/HeroAnimation.tsx`

**Interfaces:**
- `HeroAnimation()` export signature unchanged (no props, default export pattern unchanged).
- `EntryRow` import/usage from `./DailyNoteOverlayMock` unchanged (`entry`, `view`, `index` props as already defined there).
- `CARDS`, `CardId`, `CardDef`, `DetailCard`, `Phase` all stay exactly as-is — only the render (`return (...)`) block changes, plus deletion of now-unused geometry constants.

**Root cause being fixed:** the current code computes an approximate landing pixel for every card (`rowTargetPx`, built from `COLUMN_LEFT_PX`/`COLUMN_TOP_PX`/`SCALE`/`REF_W`/`REF_H`) and animates all 8 cards toward that shared math on nearly the same 3000ms window (staggered only 60ms apart) — several are visibly overlapping mid-flight, which is the "pile of cards" screenshot. The fix removes this hand-computed math entirely: give each scattered detail card and its corresponding converged-panel row the same `layoutId`. When a card's `landed` flag flips true, the detail card unmounts and the row (same `layoutId`) mounts — Motion's shared-layout transition (`layoutId` + `layout` + `AnimatePresence`) measures each element's *real* rendered position and interpolates between them automatically (a "magic move"), so every card flies from wherever it actually is to wherever its row actually renders, one at a time, driven by the existing per-card landing schedule — no shared approximate target, so no pile-up.

- [ ] **Step 1: Delete the now-unused geometry constants**

Remove this entire block (currently lines ~37-66, between the `CARDS` array and `DetailCard`):

```tsx
// ─── Converged timeline layout — the payoff frame reuses the actual
// EntryRow component from DailyNoteOverlayMock (same rendering used in the
// feature blocks below), scaled down uniformly to fit 8 rows in the hero's
// small frame rather than a hero-only row design. Computed once against a
// 640×400 reference canvas (matches Hero.tsx's maxWidth:640 wrapper + this
// component's own 16:10 aspect ratio).
const REF_W = 640
const REF_H = 400
const ROW_UNSCALED_W = 380
const ROW_UNSCALED_H = 53 // EntryRow's natural rendered height in 'note' view
const COLUMN_PAD = 8
const SCALE = 0.78
const N = CARDS.length
const COLUMN_UNSCALED_HEIGHT = N * ROW_UNSCALED_H + COLUMN_PAD * 2
const COLUMN_SCALED_WIDTH = (ROW_UNSCALED_W + COLUMN_PAD * 2) * SCALE
const COLUMN_SCALED_HEIGHT = COLUMN_UNSCALED_HEIGHT * SCALE
const COLUMN_LEFT_PX = (REF_W - COLUMN_SCALED_WIDTH) / 2
const COLUMN_TOP_PX = (REF_H - COLUMN_SCALED_HEIGHT) / 2
const COLUMN_LEFT_PCT = (COLUMN_LEFT_PX / REF_W) * 100
const COLUMN_TOP_PCT = (COLUMN_TOP_PX / REF_H) * 100

// Approximate target for each detail card's convergence motion — doesn't
// need to be pixel-exact since the card fades out as it arrives, just close
// enough that "card flies toward its row" reads as connected motion.
function rowTargetPx(i: number) {
  return {
    x: COLUMN_LEFT_PX + COLUMN_PAD * SCALE,
    y: COLUMN_TOP_PX + (COLUMN_PAD + i * ROW_UNSCALED_H) * SCALE,
  }
}
```

- [ ] **Step 2: Add the Motion import**

At the top of the file, alongside the existing imports:

```tsx
import { motion, AnimatePresence } from 'motion/react'
```

- [ ] **Step 3: Replace the return block**

Replace everything from `const showConverged = ...` through the end of the `return (...)` (currently lines ~242-327) with:

```tsx
  const showBackdrop = reducedMotion || phase === 'converging' || phase === 'held'

  return (
    <div ref={containerRef} className="relative w-full" style={{ aspectRatio: '16 / 10', background: 'var(--warm-alt)' }}>
      {/* Converged panel — centered backdrop. Rows inside share a layoutId
          with their scattered detail card, so Motion computes the FLIP
          transition from each card's real rendered rect to each row's real
          rendered rect — replaces the old rowTargetPx/COLUMN_* approximate
          math, which is what caused cards to visibly pile up mid-flight. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(380px, 86%)',
          borderRadius: 14,
          background: 'var(--app-surface)',
          border: '1px solid var(--warm-border)',
          boxShadow: '0 24px 56px -20px rgba(194,65,12,.18)',
          padding: 8,
          opacity: showBackdrop ? 1 : 0,
          transition: `opacity ${phase === 'converging' ? '600ms' : phase === 'dispersing' ? '400ms' : '300ms'} var(--ease-warm)`,
        }}
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {CARDS.map((c, i) => {
            const landed = reducedMotion || landedIds.has(c.id)
            if (!landed) return null
            return (
              <motion.li
                key={c.id}
                layoutId={`hero-card-${c.id}`}
                layout
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <EntryRow entry={{ id: c.id, time: c.time, summary: c.summary }} view="note" index={i} />
              </motion.li>
            )
          })}
        </ul>
      </div>

      {/* Scattered / dispersing detail cards — each always renders at its
          own scattered position (drift + cursor parallax on top, both
          unchanged below) until its `landed` flag flips true, at which
          point it unmounts and its layoutId partner above takes over the
          FLIP transition automatically. */}
      <AnimatePresence>
        {CARDS.map(c => {
          const landed = reducedMotion || landedIds.has(c.id)
          if (landed) return null
          return (
            <motion.div
              key={`card-${c.id}`}
              layoutId={`hero-card-${c.id}`}
              layout
              className="absolute"
              style={{
                left: 0,
                top: 0,
                width: c.width,
                transform: `translate(${c.scattered.x}px, ${c.scattered.y}px) rotate(${c.scattered.rotate}deg)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div ref={el => { parallaxRefs.current[c.id] = el }} style={{ transform: 'translate(0,0)' }}>
                <div
                  className="hero-anim-drift"
                  style={{ '--drift-duration': `${c.driftDuration}s`, '--drift-delay': `${c.driftDelay}s`, animationPlayState: phase === 'scattered' ? 'running' : 'paused' } as React.CSSProperties}
                >
                  <div
                    style={{
                      width: c.width,
                      borderRadius: 10,
                      background: '#fff',
                      border: '1px solid var(--warm-border)',
                      boxShadow: '0 4px 12px rgba(26,26,26,.10)',
                      overflow: 'hidden',
                    }}
                  >
                    <DetailCard id={c.id} />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
```

Note what stayed identical and must not be touched: the `useEffect` for `reducedMotion`, the `reset()` function, the `useAnimationLoop(...)` scheduling call, and the cursor-parallax `useEffect` (the `parallaxRefs`/`parallaxCurrent`/`pointerTarget` logic) — none of that changes. The parallax effect still works because `parallaxRefs.current[c.id]` still points to the same inner `<div>` it always did; Motion only owns the outer wrapper's mount/unmount/layout transition now, not the parallax transform.

- [ ] **Step 4: Verify with typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both succeed. Fix any TypeScript errors from the `motion.div`/`motion.li` prop types before proceeding (e.g. the `ref` callback on the inner plain `<div>` is untouched and fine; only the outer element's props changed to Motion's).

- [ ] **Step 5: Visual check — the actual bug this task fixes**

Run `npm run dev`, open the homepage, watch at least one full 16s hero loop start to finish (scattered → converging → held → dispersing → reset). Confirm:
- Cards land into the row list one at a time, each visibly flying from its own scattered position to its own row slot — no simultaneous pile-up of multiple cards in the same spot.
- The converged panel shows all 8 rows once fully landed, matching `EntryRow`'s normal rendering (same as it does elsewhere on the page).
- At the end of the loop, cards reappear scattered without a jarring pop.

- [ ] **Step 6: Reduced-motion check**

In Chrome DevTools, enable "Emulate CSS prefers-reduced-motion: reduce" (Rendering tab), reload the homepage. Confirm the hero renders directly in the fully-converged/settled state with no animation at all (no scattered cards ever visible).

- [ ] **Step 7: Commit**

```bash
git add components/light/HeroAnimation.tsx
git commit -m "feat: rebuild hero convergence on motion shared-layout transitions

Replaces the hand-computed rowTargetPx/COLUMN_* pixel math (source of the
card pile-up bug) with motion/react layoutId shared-layout transitions —
each card now animates to its own real measured row position instead of an
approximate shared target."
```

---

### Task 6: Remove the Google Calendar section from the privacy page (spec §3a)

**Files:**
- Modify: `app/privacy/page.tsx`

**Interfaces:** None — content-only change to the `SECTIONS` array.

- [ ] **Step 1: Remove the two calendar-related entries**

In `app/privacy/page.tsx`, delete these two objects from the `SECTIONS` array (currently between the `'The desktop app'` entry and the `'Third-party services'` entry):

```tsx
  {
    title: 'Google Calendar',
    body: (
      <>
        If you connect a Google account, nothing.ai asks for one permission: managing calendar
        events (the <span className="font-mono">calendar.events</span> scope). It is used for
        exactly one thing — creating the events you explicitly confirm in the app. The app never
        reads, changes, or deletes anything already on your calendar, and your calendar data is
        never shared with anyone. Your Google sign-in tokens are encrypted with Windows secure
        storage and kept only on your device — they never touch our servers. Unplugging the
        account inside the app deletes them immediately, and you can also revoke access at any
        time at{' '}
        <a href="https://myaccount.google.com/permissions" style={link}>
          myaccount.google.com/permissions
        </a>
        .
      </>
    ),
  },
  {
    title: 'Limited use',
    body: (
      <>
        nothing.ai&apos;s use and transfer to any other app of information received from Google
        APIs will adhere to the{' '}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          style={link}
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </>
    ),
  },
```

The `SECTIONS` array now goes directly from `'The desktop app'` to `'Third-party services'`.

- [ ] **Step 2: Update the "last updated" date**

Change:

```tsx
        <p className="font-mono" style={{ fontSize: 11, color: '#6B6B6B', marginTop: 8 }}>
          Last updated July 2026
        </p>
```

to:

```tsx
        <p className="font-mono" style={{ fontSize: 11, color: '#6B6B6B', marginTop: 8 }}>
          Last updated August 2026
        </p>
```

- [ ] **Step 3: Verify with typecheck**

Run: `npm run typecheck`
Expected: no errors (the unused `link` style constant is still used by the remaining `'Contact'`/other entries — if TypeScript/ESLint flags it as unused, confirm it's still referenced elsewhere in the file before removing it; it is not expected to become unused here since it's not used elsewhere in the visible entries — double check with `grep -n "link}" app/privacy/page.tsx` and remove the `const link = ...` declaration only if grep shows zero remaining usages).

- [ ] **Step 4: Visual check**

Run `npm run dev`, open `/privacy`, confirm the page now reads "The desktop app" → "Third-party services" with no Google Calendar or Limited Use section in between.

- [ ] **Step 5: Commit**

```bash
git add app/privacy/page.tsx
git commit -m "fix: remove Google Calendar section from privacy page (feature no longer exists)"
```

---

### Task 7: Correct pricing copy sitewide (spec §3b)

**Files:**
- Modify: `components/light/Hero.tsx`
- Modify: `components/light/DownloadCta.tsx`
- Modify: `app/download/page.tsx`

**Interfaces:** None — content-only changes.

- [ ] **Step 1: `Hero.tsx` — eyebrow copy**

Change:

```tsx
      <span className="font-mono load-eyebrow" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
        Windows · early access
      </span>
```

to:

```tsx
      <span className="font-mono load-eyebrow" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
        Windows · $9.99/mo
      </span>
```

- [ ] **Step 2: `DownloadCta.tsx` — subhead copy**

Change:

```tsx
        <p style={{ fontSize: 16, color: '#6B6B6B', marginTop: 12 }}>
          Free while in early access.
        </p>
```

to:

```tsx
        <p style={{ fontSize: 16, color: '#6B6B6B', marginTop: 12 }}>
          40 free captures, then $9.99/mo — cancel anytime.
        </p>
```

- [ ] **Step 3: `app/download/page.tsx` — page metadata description**

Change:

```tsx
export const metadata: Metadata = {
  title: 'Download — nothing.ai',
  description:
    'Download nothing.ai for Windows — the faceless desktop AI that makes your screenshots smarter. 3-day free trial, then $9.99/mo.',
}
```

to:

```tsx
export const metadata: Metadata = {
  title: 'Download — nothing.ai',
  description:
    'Download nothing.ai for Windows — the faceless desktop AI that makes your screenshots smarter. 40 free captures, then $9.99/mo.',
}
```

- [ ] **Step 4: `app/download/page.tsx` — visible pricing line**

Change:

```tsx
              <span>Windows 10/11 · 64-bit</span>
              <span aria-hidden="true">·</span>
              <span>3-day free trial, then $9.99/mo — sign in inside the app</span>
```

to:

```tsx
              <span>Windows 10/11 · 64-bit</span>
              <span aria-hidden="true">·</span>
              <span>40 free captures, then $9.99/mo — sign in inside the app</span>
```

- [ ] **Step 5: Grep-verify no stale copy remains**

Run: `grep -rni "early access\|3-day" app components --include="*.tsx"`
Expected: zero matches. If any remain, fix them the same way (real pricing model, no BYOK mention).

- [ ] **Step 6: Verify with typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 7: Visual check**

Run `npm run dev`, check the homepage hero, the Download CTA section, and `/download` — confirm all three read "40 free captures, then $9.99/mo" consistently and nothing says "early access" or "3-day."

- [ ] **Step 8: Commit**

```bash
git add components/light/Hero.tsx components/light/DownloadCta.tsx app/download/page.tsx
git commit -m "fix: correct pricing copy sitewide to 40 free captures then \$9.99/mo"
```

---

### Task 8: Add a homepage pricing section (spec §4a)

**Files:**
- Create: `components/light/PricingSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `export function PricingSection()` — no props, self-contained section, following the exact pattern of `PrivacyColumns`/`DownloadCta` (Reveal-wrapped, inline styles, warm palette).

- [ ] **Step 1: Create the component**

```tsx
// components/light/PricingSection.tsx
import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'

export function PricingSection() {
  return (
    <section id="pricing" style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#FAF8F5' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <Reveal variant="light">
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
            pricing
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(28px,4vw,40px)',
              color: '#1A1A1A',
              marginTop: 8,
            }}
          >
            Try it free. Then $9.99/mo.
          </h2>
        </Reveal>
        <Reveal variant="light" panel index={1}>
          <div
            className="card-warm"
            style={{ background: '#F2EFE9', border: '1px solid #E5E0D8', borderRadius: 14, padding: 32, marginTop: 28 }}
          >
            <p style={{ fontSize: 16, color: '#1A1A1A', lineHeight: 1.6 }}>
              <strong>40 free captures</strong> — genuinely try it, no card required.
              <br />
              After that, <strong>$9.99/mo</strong>. Cancel anytime.
            </p>
            <div style={{ marginTop: 20 }}>
              <Link href="/download" className="btn-warm" style={{ display: 'inline-flex', padding: '14px 32px', fontSize: 15 }}>
                Download for Windows
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Wire it into the homepage**

In `app/page.tsx`, add the import alongside the others:

```tsx
import { PricingSection } from '@/components/light/PricingSection'
```

and place it after the feature blocks / before the trust strip (Task 9 will add the trust strip right after; for now, place it directly before `<PrivacyColumns />`):

```tsx
        <FeatureBlocksSection />

        {/* Pricing */}
        <PricingSection />

        {/* Privacy */}
        <PrivacyColumns />
```

- [ ] **Step 3: Verify with typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both succeed.

- [ ] **Step 4: Visual check**

Run `npm run dev`, confirm the pricing section renders between the feature blocks and the privacy section, reveal-animates in on scroll like the surrounding sections, and the Download button works.

- [ ] **Step 5: Commit**

```bash
git add components/light/PricingSection.tsx app/page.tsx
git commit -m "feat: add homepage pricing section"
```

---

### Task 9: Add a trust-signals strip (spec §4b)

**Files:**
- Create: `components/light/TrustStrip.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `export function TrustStrip()` — no props.

- [ ] **Step 1: Create the component**

```tsx
// components/light/TrustStrip.tsx
import { Reveal } from '@/components/apple/Reveal'

const SIGNALS = [
  { label: 'Signed & notarized installer' },
  { label: 'Auto-updates' },
  { label: 'Captures stored on-device' },
  { label: 'Never used for training' },
]

export function TrustStrip() {
  return (
    <section style={{ padding: 'clamp(32px,5vw,56px) 24px', background: '#F2EFE9', borderTop: '1px solid #E5E0D8', borderBottom: '1px solid #E5E0D8' }}>
      <Reveal variant="light">
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ maxWidth: 960, margin: '0 auto', gap: '12px 32px' }}
        >
          {SIGNALS.map(s => (
            <span key={s.label} className="font-mono flex items-center gap-2" style={{ fontSize: 12, color: '#6B6B6B' }}>
              <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />
              {s.label}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Wire it into the homepage**

In `app/page.tsx`, add the import:

```tsx
import { TrustStrip } from '@/components/light/TrustStrip'
```

Place it directly after the pricing section added in Task 8:

```tsx
        {/* Pricing */}
        <PricingSection />

        {/* Trust signals */}
        <TrustStrip />

        {/* Privacy */}
        <PrivacyColumns />
```

- [ ] **Step 3: Verify with typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both succeed.

- [ ] **Step 4: Visual check**

Run `npm run dev`, confirm the trust strip renders as a scannable row (wrapping cleanly on narrow viewports) between pricing and privacy.

- [ ] **Step 5: Commit**

```bash
git add components/light/TrustStrip.tsx app/page.tsx
git commit -m "feat: add trust-signals strip"
```

---

### Task 10: Add the "more under the hood" feature grid (spec §4c)

**Files:**
- Create: `components/light/MoreFeaturesGrid.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `export function MoreFeaturesGrid()` — no props, follows the exact 3-column card pattern already established by `PrivacyColumns.tsx` (`card-warm` class, `Reveal panel index={i}`).

- [ ] **Step 1: Create the component**

```tsx
// components/light/MoreFeaturesGrid.tsx
import { Reveal } from '@/components/apple/Reveal'

const FEATURES = [
  { title: 'Projects', body: 'Organize captures by client or topic. A capture filed to a project lives only there — filing is a move, not a tag.' },
  { title: 'Future', body: "Anything with a date gets surfaced separately, soonest first — what's coming up, without you having to ask." },
  { title: 'Notes overlay', body: 'Alt+D jumps straight to your most recent capture, Ctrl+D opens today from the top — a fast glance without opening the app.' },
  { title: 'My notes vs Enhanced', body: 'Your own typed words are always kept exactly as you wrote them. A manual edit is never silently overwritten by AI again.' },
]

export function MoreFeaturesGrid() {
  return (
    <section style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#FAF8F5' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <Reveal variant="light">
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
            more under the hood
          </span>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginTop: 20 }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} variant="light" panel index={i}>
              <div className="card-warm" style={{ background: '#F2EFE9', border: '1px solid #E5E0D8', borderRadius: 12, padding: 22, height: '100%' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: '#6B6B6B', marginTop: 8, lineHeight: 1.6 }}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Wire it into the homepage**

In `app/page.tsx`, add the import:

```tsx
import { MoreFeaturesGrid } from '@/components/light/MoreFeaturesGrid'
```

Place it directly after the trust strip added in Task 9:

```tsx
        {/* Trust signals */}
        <TrustStrip />

        {/* More under the hood */}
        <MoreFeaturesGrid />

        {/* Privacy */}
        <PrivacyColumns />
```

- [ ] **Step 3: Verify with typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both succeed.

- [ ] **Step 4: Visual check**

Run `npm run dev`, confirm the 4-card grid renders (4 columns desktop, 2 columns tablet, 1 column mobile per the `sm:`/`lg:` breakpoints) between the trust strip and privacy section.

- [ ] **Step 5: Commit**

```bash
git add components/light/MoreFeaturesGrid.tsx app/page.tsx
git commit -m "feat: add more-under-the-hood feature grid (Projects, Future, Notes overlay, My notes vs Enhanced)"
```

---

### Task 11: Add an FAQ section (spec §4d)

**Files:**
- Create: `components/light/FaqSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `export function FaqSection()` — no props.

- [ ] **Step 1: Create the component**

```tsx
// components/light/FaqSection.tsx
import { Reveal } from '@/components/apple/Reveal'

const FAQS = [
  { q: 'Is it Windows-only?', a: 'Yes, today. macOS is coming — you can join the waitlist from the download page.' },
  { q: 'What happens after my 40 free captures?', a: "You'll need to subscribe ($9.99/mo, cancel anytime) to keep capturing. Everything you've already saved stays yours." },
  { q: 'Is my data used to train anything?', a: 'No. Screenshots are never used to train any model, ours or anyone else’s.' },
  { q: 'What does "faceless" actually mean?', a: 'No app window to manage, no taskbar entry, no dock icon. It lives in a hotkey and the tray — nothing to open unless you want to look back.' },
]

export function FaqSection() {
  return (
    <section id="faq" style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#F2EFE9' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Reveal variant="light">
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(26px,3.2vw,34px)',
              color: '#1A1A1A',
              textAlign: 'center',
            }}
          >
            Questions
          </h2>
        </Reveal>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {FAQS.map((item, i) => (
            <Reveal key={item.q} variant="light" index={i}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{item.q}</h3>
                <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 6, lineHeight: 1.6 }}>{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Wire it into the homepage**

In `app/page.tsx`, add the import:

```tsx
import { FaqSection } from '@/components/light/FaqSection'
```

Place it directly before the Download CTA (right before the download conversion moment, per the spec's reasoning):

```tsx
        {/* FAQ */}
        <FaqSection />

        {/* Download CTA */}
        <DownloadCta />
```

- [ ] **Step 3: Verify with typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both succeed.

- [ ] **Step 4: Visual check**

Run `npm run dev`, confirm the FAQ section renders directly before the final Download CTA, reveal-animates in on scroll consistent with the rest of the page.

- [ ] **Step 5: Commit**

```bash
git add components/light/FaqSection.tsx app/page.tsx
git commit -m "feat: add FAQ section before the download CTA"
```

---

### Task 12: Add nav anchor links for the new sections

**Files:**
- Modify: `components/light/NavPill.tsx`

**Interfaces:** None — content-only addition to the existing `<nav>` block.

- [ ] **Step 1: Add Pricing and FAQ links**

Change:

```tsx
        <nav className="hidden sm:flex items-center gap-6" aria-label="Primary">
          <a href="#capture" className="link-warm" style={{ fontSize: 14 }}>Features</a>
          <a href="/privacy" className="link-warm" style={{ fontSize: 14 }}>Privacy</a>
        </nav>
```

to:

```tsx
        <nav className="hidden sm:flex items-center gap-6" aria-label="Primary">
          <a href="#capture" className="link-warm" style={{ fontSize: 14 }}>Features</a>
          <a href="#pricing" className="link-warm" style={{ fontSize: 14 }}>Pricing</a>
          <a href="#faq" className="link-warm" style={{ fontSize: 14 }}>FAQ</a>
          <a href="/privacy" className="link-warm" style={{ fontSize: 14 }}>Privacy</a>
        </nav>
```

(This relies on `id="pricing"` from Task 8's `PricingSection` and `id="faq"` from Task 11's `FaqSection` — both already set in those components.)

- [ ] **Step 2: Verify with typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Visual check**

Run `npm run dev`, confirm the nav pill shows Features / Pricing / FAQ / Privacy on desktop widths, and each link scrolls to the right section.

- [ ] **Step 4: Commit**

```bash
git add components/light/NavPill.tsx
git commit -m "feat: add pricing and FAQ links to nav"
```

---

## Post-implementation

After all 12 tasks: run `npm run build` one final time end-to-end, then do a full manual pass through the homepage (desktop + narrow viewport), `/download`, and `/privacy` to confirm nothing regressed. This plan does not cover swapping in real screenshots/recordings from the user (per the spec's "Real-asset placeholders" section) — that's a follow-up pass once those assets are provided.
