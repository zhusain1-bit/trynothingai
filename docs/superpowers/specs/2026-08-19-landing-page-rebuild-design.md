# Nothing AI — landing page rebuild design

Status: approved, ready for implementation planning
Date: 2026-08-19
Pre-rebuild snapshot: git tag `pre-rebuild-v1` on `origin/master`

## Goal

Rebuild trynothingai.com to match the craft level of granola.ai, cluely.com,
and wisprflow.ai — their structural conventions, motion vocabulary, and
polish — without copying their layouts, copy, or palettes. The current site
is a dark "Apple product page" style build that is static, has no motion,
and tells a product story (screenshot → calendar / email reply / shopping
collections) that no longer matches the real product.

The product's actual core loop, as of this rebuild, is:

1. **Capture** — one global hotkey, no picker UI, snips anything on screen.
   Time-bound captures (something with a date/time in it) get a scheduled
   notification — this is a tier of capture, not a separate feature.
2. **Daily note** — captures resurface as a running note for the day, with
   a 5pm close-out for anything still open. This is new territory; nothing
   in the current site represents it.
3. **Ask** — search/retrieval across all captured days. Not a chatbot. The
   payoff is "I found the thing," not a synthesized answer.

Email → clipboard (screenshot an email, get a drafted reply on your
clipboard) remains a real feature but is secondary — it lives in a
highlights rail, not a full block.

## Non-goals

- No blog, no docs, no separate pricing page — single page only (plus the
  existing utility pages listed in scope, §7)
- No email capture popup, no exit-intent modal, no chat widget
- No dark mode toggle — one theme, warm and light
- No cookie banner beyond what's legally required
- No new dependencies (no shadcn/ui, no Framer Motion) — see §5
- No fabricated content presented as real (see §6 on social proof)

## 1. Visual system

### Color
- Page ground: `#FAF8F5` (warm off-white)
- Alternating sections: `#F2EFE9`
- Primary text: `#1A1A1A`
- Secondary text: `#6B6B6B`
- Borders/dividers: `#E5E0D8`
- Single accent: `#C2410C` (burnt amber)

No black or near-black page background anywhere on the rebuilt pages. The
accent appears only on primary CTAs and the capture-key glyph — never body
text, icons, or decorative fills. The app's own UI (captured in mockups) is
dark and sits on the light ground with shadow separation so it reads as an
object, not a hole in the page.

### Typography
- Display: Instrument Serif (headlines, hero), self-hosted via `next/font`
- Body/UI: Inter, self-hosted via `next/font`
- Hero headline ~64px desktop / ~40px mobile, line-height 1.05, slight
  negative tracking
- Section headers ~40px. Body ~18px, line-height 1.6
- Generous whitespace — sections get minimum 120px vertical padding desktop

### Product imagery
- Every mock sits in a rounded-corner (12px) frame with shadow
  `0 24px 48px -12px rgba(26,26,26,.18)`
- Where showing layered states, overlap two frames with a slight offset and
  1-2° rotation for depth
- Never flush against a section edge

## 2. Motion system

Reuse and retune the existing `Reveal` / `useInView` IntersectionObserver
infrastructure (`components/apple/Reveal.tsx`,
`components/features/useInView.ts`) rather than adding a new library. The
existing dark-theme pages keep their current timing untouched; the rebuilt
pages get new values:

- Scroll reveal: fade 0 → 1 opacity + 12px upward translate, 400ms,
  `cubic-bezier(0.16, 1, 0.3, 1)`, 60ms stagger between children, fires once
  at ~15% viewport intersection, does not re-trigger on scroll-up
- Micro-interactions, plain CSS transitions:
  - Buttons: 2px lift + shadow deepen, 150ms
  - Cards/feature blocks: shadow deepen, 200ms
  - Links: accent underline wipe left-to-right, 200ms
- `prefers-reduced-motion: reduce` → final state rendered immediately, no
  transforms, hero loop shows its first frame only and does not animate
- No parallax, no scroll-jacking, no mesh gradients, no cursor followers, no
  animation longer than 500ms except the hero loop itself

GSAP stays in `package.json` only if something in the rebuild still needs
it; the current sole consumer (`HeroStage.tsx`) is being replaced by the new
hero (§4), so GSAP is expected to become unused and should be removed from
dependencies if nothing else picks it up during implementation.

## 3. Component architecture

New components, light-theme only, under `components/light/`:

- `MockFrame.tsx` — the 12px-radius/shadow frame described in §1, with an
  optional overlap+rotate layout for showing two states at once. Replaces
  `MacWindow` for this rebuild.
- `CapturePillMock.tsx` — the capture pill (spec in §4)
- `DailyNoteOverlayMock.tsx` — **one component**, four modes via a `mode`
  prop: `'note' | 'strip' | 'closeout' | 'search'`. All four modes render
  through the same panel chrome, dimensions, and entry-row renderer — only
  the content differs. This one component covers both the Daily Note
  feature block and the Ask feature block (Ask = search mode).
- `Nav.tsx`, `Hero.tsx`, `ProblemStatement.tsx`, `FeatureBlock.tsx` (generic,
  used 3×), `PrivacyColumns.tsx`, `DownloadCta.tsx`, `Footer.tsx`
- A rail entry for email→clipboard reusing the existing
  `HighlightsRail`/`StripCard` pattern, restyled light

Reused as-is: `useInView`, `useAnimationLoop` hooks (no changes needed).
`Reveal` gets its new timing values scoped so the still-dark pages
(`/reset`) are unaffected.

Archived, not deleted, to `components/_archive/`:
- `WhyNothingSection.tsx` (brand manifesto) — source material for hero
  subhead copy later
- `WhyNotPhoneSection.tsx` (cross-device explainer) — source phrasing for
  the problem-statement's cross-device line (§4)

Deleted: none of the above two — both archived per explicit instruction.

## 4. Homepage structure

In order:

1. **Nav** — sticky, condenses on scroll (transparent → `#FAF8F5` at 88%
   opacity + backdrop blur + 1px bottom border, 200ms transition). Logo
   left, Features/Privacy/Download links, accent Download CTA right.
2. **Hero** — eyebrow, serif headline, one-line subhead, primary CTA
   (Download, Windows) + quiet secondary link ("see how it works" scrolls
   to the feature blocks), then the hero loop (below).
3. **Problem statement** — single centered serif line(s), large type, lots
   of whitespace, no image. Carries the core "screenshotted for a reason,
   forgot the reason" idea plus a compressed cross-device point pulled from
   the archived `WhyNotPhoneSection` copy: phones already turn a
   screenshot with a time in it into a calendar event; your computer
   doesn't, and that's where work — Slack, docs, tabs — actually gets lost.
   One or two lines, not a paragraph. No naming Apple, not comparative.
4. **Feature block — Capture.** `CapturePillMock` in idle state and
   time-bound-chip state, alternating left/right layout, short header + two
   sentence body.
5. **Feature block — Daily note.** `DailyNoteOverlayMock` in `note`/`strip`
   modes (toggle shown), including the 5pm close-out (`closeout` mode) as
   part of the story.
6. **Feature block — Ask.** `DailyNoteOverlayMock` in `search` mode: query
   types in ~40ms/char, results filter live, lands on 2-3 rows (not one),
   no synthesized answer text. Copy leads with finding, not asking/chat
   framing.
7. **Rail** — email→clipboard, `HighlightsRail`/`StripCard` pattern,
   restyled light.
8. **Privacy** — 3 columns: local-first ("stays on your machine"), no
   training, and a retention column using non-numeric placeholder language
   ("you control how long captures are kept" or similar) — **do not state
   a specific retention period** (e.g. "90 days") until real policy
   language is supplied. Flagged copy, not a live claim.
9. **Social proof** — **omitted**, not ported forward. The current 14
   reviews are fabricated quotes attributed to people who don't exist and
   are being removed from the rebuild *and* from the currently-live site
   (bundled into this rebuild's ship, not a separate hotfix — confirmed
   with user). Leave a clearly commented, empty section slot in
   `app/page.tsx` for real testimonials/logos later; do not invent
   placeholder content to fill it.
10. **Download CTA** — full-width, accent-forward, single button, Windows
    labeled clearly, "macOS coming soon" noted rather than a dead Mac
    button.
11. **Footer** — logo, product links (updated anchors matching the new
    section ids), "get it" column points to `/download` (not `#waitlist` —
    waitlist no longer lives on the homepage), privacy policy link,
    copyright, existing real social links (X/TikTok/Instagram/LinkedIn)
    carried over unchanged.

### Hero loop

No real footage exists for any current or new UI (existing recordings are
against the old six-tile-picker UI and are being treated as fully
placeholder — see §8). Build the hero as a live composed animation from the
actual `CapturePillMock` and `DailyNoteOverlayMock` components rather than a
static frame or a video file: it can't drift from what the product actually
looks like, and it unblocks the site from the app build entirely. Swappable
for real screen-captured footage later without a layout change.

Sequence, under 8 seconds total, one idea only ("press key, it's in your
day" — no search step, that's block 6's job):

1. Static frame: a Slack-like message containing a time ("tour at 4?")
2. Hotkey glyph appears briefly (`Ctrl+Shift+Space`)
3. `CapturePillMock` fades in bottom-center, time-bound chip showing
   "4:00 PM ·"
4. Pill fades out
5. Cut to `DailyNoteOverlayMock` (note mode), new entry landing at the top
6. Hold ~1s, then loop

On mobile, or when `prefers-reduced-motion: reduce`, show the loop's first
frame only (per the spec's original "static frame on mobile unless wifi"
intent, reinterpreted here as: no video file to conditionally load, so this
becomes "don't run the animation loop" instead).

## 5. Mocked UI specs

Placeholder UI, not real screenshots — but built to the real app's intended
dimensions so swapping in actual captures later doesn't reflow anything.
Dark UI family throughout (`#1F1F1F` base), matching the real (dark) app
against the light marketing page.

### Capture pill
- Compact floating pill, ~44-48px tall, min-width 280px, max 420px
- Fully rounded (radius = height/2), single soft shadow
  `0 8px 24px rgba(0,0,0,0.24)`, no border, no title bar, no buttons
- Layout: `[16px icon] [inline text field, flex-1] [subtle hint glyph]`
- Background `#1F1F1F` at 96% opacity, slight backdrop blur
- Placeholder text: "add a note (optional)"
- Sits bottom-center of the screen mock, ~80px from the bottom edge
- Time-bound variant: an inline chip precedes the text field, e.g.
  `"4:00 PM ·"`
- Deliberately minimal — visually similar to Claude's inline-edit affordance

### Daily note overlay (all four modes share this chrome)
- Centered overlay panel, not a full window, doesn't take over the screen
- Same width/chrome across all modes
- Dark UI, `#1F1F1F` family

**`note` mode** (default, opened via `Ctrl+Shift+N`):
- Search field at top, focused on open, `#2A2A2A` background, 8px radius,
  no border
- Below: today's entries, reverse-chronological
- Each row: timestamp, 3-8 word summary, user annotation if present, small
  thumbnail
- Consecutive captures from the same app within ~20 min collapse into one
  group row (e.g. "10:15-10:40 · 8 from Slack"), expandable
- Toggle between `note` (text) and `strip` (raw screenshots) views

**`strip` mode:** same entries, raw screenshot thumbnails instead of text
summaries.

**`closeout` mode** (5pm): same overlay, open items pinned at top, each with
Done / Snooze / Dismiss. Short list — two or three items, not twelve.

**`search` mode** (= the Ask feature block): search field pinned at top,
focused, ~44px tall, full panel width minus padding, `#2A2A2A` background,
8px radius, no border, placeholder "search or ask." Results below in the
same row format as `note` mode, plus a muted (`#6B6B6B`) date on the left
of each row since results span multiple days. Demo interaction: query types
character-by-character (~40ms/char), results filter live as it types,
lands on 2-3 results (not one) — retrieval, not a chatbot answering a
question. Example query: "the address tyler sent," resolving to 2-3 rows
from different days. Copy avoids "ask anything," "AI-powered," and chat
framing; header direction is about finding (final copy to follow).

## 6. Copy

User supplies final copy for all headlines/subheads/body text. Until then,
every string is clearly-marked placeholder copy following the rules below,
flagged for replacement:

- Never: "AI-powered," "supercharge," "10x," "revolutionize," "seamlessly"
- No description of the model or pipeline — the AI stays invisible in copy
- Headlines describe outcomes, not mechanisms
- Subheads: one sentence
- Ask-block copy specifically avoids "ask anything" / chat framing (§5)
- Privacy retention column: non-numeric placeholder only, no invented
  numbers (§4, item 8)

## 7. Scope beyond the homepage

Product state: nothing.ai is **actually downloadable now** (real Windows
installer, 3-day trial then $9.99/mo). Download is the homepage's single
primary action. The waitlist is **not** being dropped — its 127 existing
signups are the primary launch audience for the first send. The waitlist
form moves off the homepage and becomes a secondary "macOS coming soon"
capture on `/download`.

- **`/download`** — rebuilt in the light system; keeps its existing 3-step
  install `StatGrid` content, restyled; gains the secondary Mac waitlist
  capture, reusing `/api/waitlist` as-is
- **`/privacy`** — restyled to the light palette/type; legal content
  unchanged
- **`/confirmed`, `/subscribed`** — app sign-in/subscription callback
  pages (not waitlist-related) — restyled to light palette since real users
  land on them
- **`/reset`** — untouched; unrelated Supabase password-recovery flow
- **`/api/waitlist`** — code untouched, stays fully functional. Signups are
  stored as Resend Audience contacts (`RESEND_AUDIENCE_ID`), not a
  database — no delete/migration path exists in this route. Do not modify
  or migrate this data. Export to CSV, if/when needed, is via the Resend
  dashboard (user's choice — a read-only export script was offered and
  declined for now).
- PostHog `capture()` calls carry over 1:1 onto the new components so
  existing funnel events keep working.

## 8. Asset inventory (delivered as a checklist at build completion)

Every current video/screenshot in the codebase (`desktop-calendar-site.mp4`,
`email-demo.mp4` + poster, `collections-demo.mp4` + poster) was recorded
against the old six-tile-picker UI and is **not used** in the rebuild — the
new feature blocks and hero use the mocked components from §5 instead. The
completion checklist will list every mock that needs a real screen
recording/screenshot before launch:

- Hero loop (capture → daily note sequence)
- Capture pill — idle and time-bound states
- Daily note overlay — note, strip, and close-out states
- Ask/search — query + results state
- OG image (`app/opengraph-image.tsx`) — currently references old-UI copy,
  needs regeneration to match the new visual system and story

## 9. Testing / verification

No existing automated test suite to extend. Manual verification before
calling the rebuild done:

- Viewports: 375px, 768px, 1440px
- `prefers-reduced-motion: reduce`: reveals render in final state
  immediately, no transforms, hero loop shows first frame only, no pill/
  overlay animation plays
- Lighthouse: performance >90, accessibility >95 on the homepage
- PostHog events fire correctly from the new components (spot-check in
  browser network tab / PostHog live events)
- Waitlist form on `/download` still submits successfully end-to-end
  (existing `/api/waitlist` route, unmodified)
