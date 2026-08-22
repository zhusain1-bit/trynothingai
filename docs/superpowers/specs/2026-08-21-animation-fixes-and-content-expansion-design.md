# Animation fixes and content expansion — design

Status: draft, pending user review
Date: 2026-08-21
Builds on: `docs/superpowers/specs/2026-08-19-landing-page-rebuild-design.md` and
`docs/superpowers/specs/2026-08-20-homepage-animation-pass-design.md` (both still binding except
where explicitly superseded below), branch `rebuild/light-theme`

## Goal

Two rounds of user feedback after the full animation pass landed and was visually reviewed
(screenshots) by the user:

1. **Animations are the right idea, badly executed.** The user likes the concept of every
   in-page demo animation (capture pill, hero convergence, daily-note stagger) except the
   "email → clipboard" highlight, which is being removed outright — it describes a feature
   (`HighlightsRailMock.tsx`) that isn't part of the shipped product per the v0.1.10 product
   brief ("Auto-drafting an email/message reply from a capture" is explicitly listed as NOT part
   of the current product). The remaining animations need to actually look right: three concrete
   rendering bugs were found from screenshots (§1), not a vague "needs more polish."
2. **Site content has drifted from the shipped product.** Verified against the v0.1.10 product
   brief: the privacy page still describes a Google Calendar integration that no longer exists,
   and pricing copy across the site describes an "early access"/"3-day trial" model that isn't
   the real one anymore. Separately, several real, shipped differentiators (Projects, Future tab,
   Notes overlay, My notes vs Enhanced) don't appear on the site at all.

## Supersedes

- The 2026-08-20 spec's decision to remove the `$9.99/mo` line from the Download CTA and replace
  it with "Free while in early access" — **reversed**. Confirmed with the user: pricing is real
  and live now — 40 free captures, then $9.99/mo, cancel anytime. Bring-your-own-key exists as a
  real option but is **deliberately not surfaced anywhere in marketing copy** (explicit user
  call — "looks bad to the consumer"); it stays exactly where the product brief puts it —
  Settings → Account, inside the app only. Nothing in this spec adds BYOK language to the
  marketing site.
- The 2026-08-20 spec's "no blog/docs/pricing page" non-goal, specifically for pricing — a
  homepage pricing **section** is now in scope (not a separate `/pricing` route; see §5a).

## Non-goals

No dark-mode toggle, no blog, no docs site, no BYOK marketing copy, no new top-level nav
restructuring beyond adding in-page anchor links for new sections, no changelog page (real gap,
explicitly deferred — lowest priority, not specified further here), no new npm dependencies
beyond the one scoped addition in §2.

---

## Part 1 — Animation bug fixes

Three concrete bugs, each traced to specific code, from three screenshots reviewed with the user
during brainstorming.

### 1a. `HeroAnimation.tsx` — text clipped mid-character

`DetailCard`'s `listing` case renders `543 East 6th · $2.4M` with `whiteSpace: 'nowrap'` inside a
card whose outer wrapper is `overflow: hidden` at a fixed `c.width` (96px for this card) — the
string is wider than the card, so it clips mid-character with no ellipsis. Fix: either widen the
`listing` card definition to fit its actual copy, or add `textOverflow: 'ellipsis'` alongside the
existing `overflow: hidden` so any future copy change degrades gracefully instead of clipping
mid-glyph. Prefer the ellipsis fix — it's the general-purpose one and protects every other card's
copy too, not just this one string.

### 1b. `HeroAnimation.tsx` — cards pile up instead of landing cleanly

During the `converging` phase, all 8 cards animate toward hand-computed pixel targets
(`rowTargetPx`, built from `COLUMN_LEFT_PX`/`COLUMN_TOP_PX`/`SCALE`) on a shared 3000ms transform
transition, staggered only 60ms apart per card (`ms: 8000 + 3000 + i * 60`). Cards of visibly
different original sizes (widths 70–118px) converge toward the same small target zone across
nearly the same time window, so several are visibly overlapping mid-flight before they fade out
— this is what the "overlapping pile" screenshot shows. This is the one animation surface with
real per-object position math, and it's the source of the bug — see §2 for the fix (scoped
Motion adoption), not a hand-tuned timing fix. Hand-tuning the stagger/duration further would
likely just move the bug rather than remove its cause.

### 1c. `CapturePillMock.tsx` — pill overlaps content above it

The pill is positioned `position: absolute`, `bottom: 80` (a fixed pixel value) inside
`CaptureDemo.tsx`'s `aspect-ratio: 16/10` box. At the box's actual rendered size in the feature
block, `bottom: 80` lands the pill on top of `CaptureContextMock`'s third (highlighted) message
row instead of clearly below all four rows — this is the "dark pill overlapping text" screenshot.
Fix: give the pill guaranteed clearance below the message content — either reserve bottom space
in `CaptureContextMock` (e.g. cap visible rows so the last row never extends into the pill's
vertical band) or switch the pill's vertical anchor to a percentage of the container height tuned
to this specific aspect-ratio box, whichever reads better once tried in the browser. Acceptance
criterion either way: at no point in the capture-demo loop does the pill visually overlap any
message row, checked in the browser, not just by reading the math.

### 1d. Remove the "email → clipboard" section

`HighlightsRailMock.tsx` and its usage in `app/page.tsx` are deleted outright — not disabled,
not kept as dead code. It describes an auto-drafted email reply, which the product brief lists
as explicitly not part of the shipped product.

---

## Part 2 — Scoped Motion adoption (Hero convergence only)

Add the `motion` package (npm; the maintained successor to Framer Motion — import from
`motion/react`), scoped to `HeroAnimation.tsx`'s converging/held/dispersing card
choreography (§1b). Replace the hand-computed `rowTargetPx`/`COLUMN_*` transform math with
`layout` animations (and `AnimatePresence` for the detail-card → `EntryRow` handoff), so the
library computes each card's from/to transform via FLIP instead of the current manual pixel math
— this removes the entire class of bug in §1b rather than re-tuning numbers that will drift again
at the next breakpoint or copy change.

**Amendment (post-implementation, final review):** giving `EntryRow` (in `DailyNoteOverlayMock.tsx`)
its own `layoutId`-sharing `motion.li` root — rather than wrapping it externally in a separate
`motion.li`, which produces invalid `<li><li>` markup — means `motion/react` is imported by two
files, not one: `HeroAnimation.tsx` and `DailyNoteOverlayMock.tsx`. `EntryRow`'s new `layoutId`/
`transition` props are optional and no-op when absent, so its only other call site (inside
`DailyNoteOverlayMock` itself) is behaviorally unaffected — confirmed by task review. The original
"scoped only to `HeroAnimation.tsx`" framing below no longer holds literally; the *behavioral*
scope (only the hero's convergence choreography actually animates) is unchanged.

Explicitly **not** touched: `CaptureDemo.tsx`, `StepRail.tsx`,
`Reveal.tsx`, or any scroll-triggered reveal. Those work correctly today on the existing
`useAnimationLoop`/CSS-transition system and don't have this bug's root cause (they don't do
multi-object position math) — converting them would be scope creep with no bug to justify it.

`prefers-reduced-motion` handling for the hero must remain intact: the existing `reducedMotion`
check that renders the settled/converged state directly (no animation) carries over unchanged:
Motion's `useReducedMotion` or the existing `matchMedia` check both work — pick whichever composes
more simply with Motion's `layout` prop once implementation starts.

---

## Part 3 — Content corrections

Independent of Part 1/2 — can be done in parallel, touches different files.

### 3a. `app/privacy/page.tsx` — remove the Google Calendar section

Delete the "Google Calendar" `SECTIONS` entry (the `calendar.events` scope explainer) and the
"Limited Use" entry that exists solely to satisfy Google's API disclosure requirement for that
scope, if nothing else on the page still requires it. Confirmed with the user: this integration
is gone, not merely unlaunched.

### 3b. Pricing copy correction, sitewide

Replace every instance of the "early access"/"free while in early access"/"3-day free trial"
framing with the real, live model: **40 free captures, then $9.99/mo — cancel anytime.** No BYOK
mention anywhere in this copy (see Supersedes). Specific locations to update:

- `Hero.tsx` — eyebrow currently reads "Windows · early access"
- `DownloadCta.tsx` — currently "Free while in early access."
- `app/download/page.tsx` — currently "3-day free trial, then $9.99/mo — sign in inside the app"
  and the page's `metadata.description`
- Any other occurrence found by grepping for "early access" or "3-day" during implementation

---

## Part 4 — New sections

Homepage additions, in priority order. All are homepage **sections** (not new routes) per the
user's agreement — keeps this a single-page marketing site rather than spawning a docs-site-style
page tree for content that's each only a few lines.

### 4a. Pricing section

A real section (not a buried mono line) stating the model plainly: 40 free captures, then
$9.99/mo, cancel anytime. Placement: after the feature blocks, before or merged with the existing
Download CTA — exact placement decided at implementation time by what reads best, not fixed here.

### 4b. Trust-signals strip

A compact, scannable row (icon/glyph + short label each) surfacing claims currently buried in
privacy-page prose: signed & notarized installer, auto-updates, captures stored on-device,
never used for training. Apple-style trust strip — small, not another full animated feature
block.

### 4c. "More under the hood" grid

3–4 small static cards (icon + one line each, no animated demo) covering real shipped features
absent from the site entirely: **Projects** (organize captures by client/topic), **Future tab**
(auto-surfaced deadlines), **Notes overlay** (Alt+D/Ctrl+D fast glance), **My notes vs Enhanced**
(your own words are never silently overwritten by AI). Deliberately lightweight — these are depth
proof points for someone already sold on the 3-step core loop, not a second round of hero-grade
animated demos.

### 4d. FAQ section

Short Q&A addressing likely objections right before the download CTA: Windows-only today?, what
happens after the 40 free captures?, is my data used to train anything?, what does "faceless"
mean in practice? Content written at implementation time; keep each answer to 1–2 sentences,
consistent with the brief's own terse style.

### 4e. Changelog page — deferred

Real gap (current version is v0.1.10, no changelog exists), but lowest priority and not
conversion-critical. Not specified further in this spec — pick up as its own pass later if
wanted.

---

## Component/file summary

| File | Change |
|---|---|
| `components/light/HeroAnimation.tsx` | Ellipsis fix (§1a); convergence rebuilt on `motion/react` `layout`/`AnimatePresence` (§2) |
| `components/light/CapturePillMock.tsx` | Positioning fix so it never overlaps content above it (§1c) |
| `components/light/CaptureContextMock.tsx` | Possibly reworked alongside §1c, depending which fix direction is taken |
| `components/light/HighlightsRailMock.tsx` | Deleted (§1d) |
| `app/page.tsx` | Remove `HighlightsRailMock` usage; add new §4 sections in chosen order |
| `app/privacy/page.tsx` | Remove Google Calendar / Limited Use sections (§3a) |
| `Hero.tsx`, `DownloadCta.tsx`, `app/download/page.tsx` | Pricing copy corrections (§3b) |
| New: pricing section, trust strip, "more under the hood" grid, FAQ section components under `components/light/` | §4a–4d |
| `package.json` | Add `motion` dependency (§2) |

## Real-asset placeholders

Per the asset list agreed with the user (app icon in both themes, real pill/Daily-tab/Ask
screenshots, a short capture-sequence recording, Future-tab and Project-view screenshots) — none
of this is required to start Part 1–4 above. Wherever a component still uses fabricated
placeholder content that a real asset would eventually replace, keep or add an
`<!-- PLACEHOLDER -->` comment (existing convention from the 2026-08-20 spec) so it stays
greppable. Swapping in real assets is a follow-up pass once the user provides them, not part of
this spec's implementation.

## Testing / verification

- `npm run typecheck`, `npm run build`, `npm run dev` all pass, per existing project convention.
- Every animation change verified visually in the browser at at least two viewport widths (the
  hero's convergence bug and the pill's overlap bug were both only visible as rendered output,
  not from reading the code) — screenshots or a live check before calling any §1/§2 item done.
- `prefers-reduced-motion: reduce` checked explicitly for the hero after the Motion rewrite —
  must still render the settled state with no animation, matching current behavior.
- Content corrections (§3) verified by grep for the removed/replaced strings to confirm no
  leftover occurrence.
