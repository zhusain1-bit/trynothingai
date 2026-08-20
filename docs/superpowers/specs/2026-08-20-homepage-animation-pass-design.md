# Homepage animation pass — design

Status: draft, pending user review
Date: 2026-08-20
Builds on: `docs/superpowers/specs/2026-08-19-landing-page-rebuild-design.md` (still binding for color/type/section-order rules not superseded below), branch `rebuild/light-theme`

## Goal

Two rounds of feedback after the initial rebuild landed and was visually reviewed by the user:

1. **"Pass 2"** — the structure and color system are right, but the page felt static next to granola.ai/wisprflow.ai. Needed: a signature hero animation, an asymmetric hero layout, populated (not empty) mock frames, and final real copy replacing every placeholder.
2. **"Full animation pass"** — a complete, detailed motion system across the whole page (page-load sequence, hero animation additions, scroll-triggered reveals, a sticky step rail, sticky media, per-block demo animations, nav treatment, micro-interactions, page transitions), with an explicit build order and a hard performance budget.

This spec covers both together, since they're inseparable in practice — the in-block demo animations (round 2, §6 below) require the mock frames to already be populated with realistic content (round 1's mock-content requirement), and the hero animation section is one continuous thread across both messages (base spec approved in round 1, two additions layered on in round 2).

Content constraints are lifted for this pass: copy, privacy language, and any placeholder social proof can be written freely rather than using only the exact strings from the original design spec. Invented content gets an `<!-- PLACEHOLDER -->` HTML comment so it's greppable before launch.

Two scoping calls made without stopping to ask (both flagged to the user, open to correction):
- **Placeholder social proof** is generic, non-attributed filler (a stat-style line, or a blurred/generic-avatar row) — not fabricated named testimonials. The project already went through a deliberate, emphatic decision to remove exactly that kind of content once; this pass doesn't reverse it under a blanket "write whatever reads well."
- **Removing the $9.99/mo line** is scoped to the homepage's Download CTA section copy only (replaced with "Free while in early access," per the user's own copy). `/download`'s stated pricing, the OG image, and actual billing are untouched — this is homepage marketing copy, not a real pricing change.

## Non-goals (unchanged from the original spec, still apply)

No blog/docs/pricing page, no popups, no dark mode toggle, no cookie banner beyond required, no new npm dependencies unless explicitly noted below (`view-transition-name` and `animation-timeline: scroll()` are native CSS, not dependencies).

## 1. Global motion rules

- Animate `transform` and `opacity` only. Shadow changes use a layered pseudo-element (`::after` at `opacity: 0`, faded in) rather than animating `box-shadow` directly.
- All scroll triggers via `IntersectionObserver` — the codebase's existing pattern (`useInView`), extended, never a second observer system, never scroll event listeners.
- `will-change` applied only while an element is actively animating (set on animation start, removed on completion/settle) — not left on permanently.
- Standard easing: `cubic-bezier(.16, 1, .3, 1)`. Entrance easing: `cubic-bezier(.22, 1, .36, 1)`. (Both close to the existing `--ease-warm` token; `--ease-warm` gets redefined to the standard value below rather than introducing a third easing token — see §3.)
- Nothing exceeds 800ms except the hero loop (16s) and the in-block demo animations (each several seconds, since they're demos, not entrances).
- Every animation in this spec is disabled under `prefers-reduced-motion: reduce`, rendering the final/settled state — same discipline as the existing `.reveal-light` and `HeroLoop` code.

## 2. Component architecture

New components, all under `components/light/`:

- `HeroAnimation.tsx` — replaces `HeroLoop.tsx` as the hero's animated centerpiece (the composed capture-pill/daily-note-overlay sequence moves out of the hero; `CapturePillMock`/`DailyNoteOverlayMock` stay in use inside the feature blocks). Renders the 8-10 scattered/converging cards, cursor parallax, and timestamp typing (§4).
- `StepRail.tsx` — the sticky capture/daily-note/ask progress indicator beside the feature blocks (§7).
- `NavPill.tsx` — replaces `Nav.tsx`'s current full-width bar with the floating pill treatment, scroll-progress line, and scroll-state background change (§10). (Old `components/light/Nav.tsx` is retired the same way `WhyNothingSection` etc. were — this is a full replacement, not a parallel component, so it's deleted, not archived; nothing about its current implementation is worth preserving as source material.)

Modified, not replaced:

- `Reveal` (`components/apple/Reveal.tsx`) — gains the "rounded panel" scale variant (§6) via a new boolean prop, and its `variant="light"` timing gets retuned to match §1's standard easing exactly (currently close but not identical — see §3).
- `Hero.tsx` — restructured for the asymmetric layout (§5) and the page-load sequence (§4a).
- `FeatureBlock.tsx` / `FeatureBlocks.tsx` — gains the sticky-media behavior (§8) and each block's in-block demo animation (§9); mock content gets populated per §11.
- `CapturePillMock.tsx`, `DailyNoteOverlayMock.tsx` — content gets populated (§11); `DailyNoteOverlayMock` gains the collapsed-group expand/re-collapse micro-beat needed for the daily-note in-block demo (§9).
- `MockFrame.tsx` — actually gets used (currently orphaned, per the final review's minor findings) for the overlap/rotate layering (§11) and gains a minimal window-chrome title bar.
- `DownloadCta.tsx`, `PrivacyColumns.tsx`, `ProblemStatement.tsx` — get the rounded-panel scale-reveal treatment (§6) and real copy (§12).
- `globals.css` — new keyframes/utility classes for: line-mask reveal, card drift, magnetic-button lerp support, mock-frame 3D tilt, nav progress line, section-reveal panel-scale variant.

## 3. Timing/easing consolidation

The existing `--ease-warm` token (`cubic-bezier(0.16, 1, 0.3, 1)`) already equals this spec's "standard easing" — no change needed there. A new `--ease-entrance: cubic-bezier(.22, 1, .36, 1)` token is added alongside it for the page-load sequence and section-reveal entrances specifically. Existing `.reveal-light` (currently 400ms) and this spec's "section reveals" (600ms, §6) are different durations for conceptually different things — `.reveal-light` stays as the general-purpose reveal utility already used by several components; `.reveal-light`'s duration changes from 400ms to 600ms to match §6 exactly, since every current consumer of `variant="light"` reveals IS one of the "every section" reveals this spec is now formalizing. No component needs a new prop for this — it's a single CSS value change.

## 4. Hero animation

### 4a. Page-load sequence (fires once, on mount)

Sequential, choreographed, total under 1.2s, no layout shift (final dimensions reserved from first paint — this replaces the current unwrapped-from-Reveal hero content added in the final-review fix wave, which rendered instantly with no entrance at all; that fix was correct for its goal — LCP — and this sequence doesn't reintroduce the LCP regression, see the performance note below):

1. Nav pill: fade + slide down from -12px, 500ms, 100ms delay
2. Eyebrow pill: fade + rise 8px, 400ms, 200ms delay
3. Headline: line-by-line mask reveal — each line in an `overflow: hidden` wrapper, line translates Y `100% → 0`, 700ms/line, 90ms stagger, starting at 300ms
4. Subhead: fade + rise 10px, 500ms, at 600ms
5. CTA + secondary link: fade + rise 8px, 450ms, at 700ms, 60ms apart
6. "macOS coming soon": fade only, 400ms, at 850ms
7. Hero animation: fades in at 500ms, begins its loop

**Performance note, resolving the tension with the final-review LCP fix:** the headline text itself (the actual DOM content search engines/LCP measurement see) is present and laid out from first paint — only its *visual* reveal is animated (the `overflow: hidden` wrapper clips it, CSS `transform` slides it into view). This is different in kind from the old `Reveal`-wrapped hero, which held content at `opacity: 0` gated behind JS/IntersectionObserver firing. The load sequence here is a `useEffect`-driven, guaranteed-to-fire-once-on-mount animation with no IntersectionObserver dependency (the hero is always in view at load) and no `opacity: 0` on the underlying text — LCP timing is unaffected. Verify this against Lighthouse in the performance pass (build-order phase 7).

### 4b. Hero animation (base spec, approved; two additions)

4-phase, 16s loop: `scattered` (8s, drift running) → `converging` (3s, drift paused) → `held` (3s, static) → `dispersing` (2s, drift paused, resumes on loop wrap). Nested structure per card — outer wrapper transitions `transform` between scattered/converged position, inner wrapper runs the independent `@keyframes` drift (6-10s period, per-card `animation-delay`, `animation-play-state: paused` outside the `scattered` phase). `useAnimationLoop` drives the phase state, same as the rest of this codebase. `prefers-reduced-motion: reduce` renders the **converged** state statically (the ordered timeline is the point, per the user's original framing) with no drift and no cursor parallax.

8-10 cards: simple vector-suggestion shapes (message bubble, table fragment, chart line, paragraph-of-blurred-text) in muted grays on white rounded cards with soft shadows — not real screenshots, and not a placeholder-pending-real-assets situation (this is the permanent supporting graphic language for the hero, confirmed with the user).

**4b-i. Cursor parallax:** while pointer is inside the hero and phase is `scattered` or `dispersing`, each card's outer wrapper gets an additional `translate` opposite the cursor, per-card factor 4-14px, lerped toward target at ~0.08/frame via `requestAnimationFrame` (not a CSS transition — needs per-frame lerping to trail rather than snap). Disabled during `converging`/`held`, and on touch devices (`matchMedia('(pointer: coarse)')` gate, checked once on mount).

**4b-ii. Timestamp typing:** each card's timestamp label, revealed when that card lands in `converging`, types character-by-character (~50ms/char) starting 200ms after the card's landing transition completes — reuses the exact `useTypedQuery`-style pattern already built for `DailyNoteOverlayMock`'s search mode (character-interval `setTimeout` chain, cleared on unmount/phase change), not a new mechanism.

## 5. Hero layout (asymmetric)

Left column ~45%: eyebrow pill (rounded-full, `rgba(194,65,12,.08)` background tint, secondary-text-colored label — not amber-on-amber, keeping the accent restrained per the original spec's rule), `h1`, subhead, CTA + secondary link, "macOS coming soon" line — all left-aligned. Right column ~55%: `HeroAnimation`, `overflow: visible` on the section so the animation's card positions can extend past the container's right edge for the bleed effect. Below 768px: single column, text first, animation second, full-width (bleed naturally absent).

## 6. Section reveals

Every section (not just some): `opacity 0→1`, `translateY 16px→0`, 600ms, standard easing, 15% intersection threshold, fires once, children stagger 60ms in DOM order. This is `.reveal-light`'s existing behavior with the duration bumped from 400ms to 600ms (§3) — no new component needed for the base case.

**Rounded panels** (problem statement, privacy, download CTA — the three sections with a distinct card/panel visual treatment) additionally scale `0.98 → 1` over the same 600ms. New `Reveal` prop: `panel?: boolean`, applying a `.reveal-light.panel` CSS variant that adds the scale transform alongside the existing opacity/translateY.

## 7. Step rail

`StepRail.tsx`, `position: sticky; top: 6rem`, rendered as a left column beside the three feature blocks (requires `FeatureBlock`'s wrapping layout to gain a rail slot — see §2's architecture note; this changes `FeatureBlocks.tsx`'s top-level JSX to wrap the three blocks in a shared grid with the rail as a sibling column, rather than three independent `<FeatureBlock>` sections in a row like today).

IntersectionObserver via `useInView`, extended (not duplicated) to accept a `rootMargin` override — currently `useInView(threshold)` hardcodes threshold-only; needs a second optional param or an options object. `rootMargin: '-45% 0px -45% 0px'` on each feature block's own `useInView` call determines "active" (the block crossing the vertical center band of the viewport). Hidden below 1024px (rail unmounts or `display: none` — unmounting is simpler given it's sticky-positioned and non-critical content, no SEO/reveal concern).

**Sliding indicator:** one absolutely-positioned accent bar (3px wide, `#C2410C`), `translateY` and `height` animated to match the active item's rail-item bounding box — measured via `getBoundingClientRect()` on the active item (read) and applied via `transform`/`height` on the indicator (write), batched to avoid layout thrash per the performance budget. 350ms, standard easing. Active item text `#1A1A1A` weight 500, inactive `#6B6B6B` weight 400, 200ms cross-fade. Items are clickable, smooth-scrolling to their section (native `scrollIntoView({ behavior: 'smooth' })` is sufficient — no need for a custom scroll implementation).

## 8. Sticky media

Each feature block's media column (the `MockFrame`-wrapped mock) becomes `position: sticky` within a taller parent — the parent needs real height beyond the sticky element's own height for sticky to have room to "stick" (verified via `getBoundingClientRect()`/computed height logged during implementation, not assumed from the CSS alone — this is explicitly called out because sticky silently no-ops when the parent isn't tall enough, and that failure mode is easy to ship unnoticed). Disabled below 768px (falls back to normal in-flow position — sticky on a stacked single-column mobile layout would just pin awkwardly).

**Scale-on-pin:** as the section centers in the viewport, the mock scales `0.96 → 1`, driven by `IntersectionObserver`'s `intersectionRatio` (not a scroll listener) — the observer's callback maps ratio to a CSS custom property (`--pin-scale`) consumed by the mock's `transform: scale(var(--pin-scale))`.

## 9. In-block demo animations

One per feature block, triggered on scroll-in via `useInView`, and — unlike every other animation in this spec — these **replay** if the user scrolls away and back (they're product demos, not one-time entrances; `useInView`'s existing "fires once" behavior needs a per-consumer opt-out, likely a `once?: boolean` param defaulting to the current `true` behavior so nothing else in the codebase changes behavior).

- **Capture:** static Slack-style conversation behind the pill (content per §11) → `Ctrl ⇧ Space` glyph fades in center, scale `1→0.94→1` (400ms, a "press") → pill rises 12px + fades in (350ms) → "4:00 PM ·" chip slides in from the left inside the pill (250ms, 150ms delay) → hold 1.5s → pill fades out (200ms) → wait 2s → replay.
- **Daily note:** entry rows land top to bottom, each fade + rise 10px, 300ms, 80ms stagger; the collapsed group row lands last and briefly expands (revealing its contained rows) then re-collapses → hold 2s → replay. (`DailyNoteOverlayMock` needs a new `expanded` transient state for the group row, distinct from its existing `note`/`strip`/`closeout`/`search` mode system — this is animation-only state, not a new mode.)
- **Ask:** search field shows a blinking cursor → query types in (~45ms/char, reusing the existing typed-query mechanism) → as typing progresses, non-matching rows fade to 0 + collapse height (250ms each, staggered) narrowing from 8 rows to 2 (this changes the existing "empty until done, then all results pop in" behavior — the Ask block's demo now needs 8 seed rows narrowing live during typing, not 2 rows appearing after) → matching rows get a brief accent-tinted background flash (400ms) → hold 2s → clear field → replay.

## 10. Nav

`NavPill.tsx`: floating pill, `inset: 12px 12px auto`, `border-radius: 999px`, `background: rgba(250,248,245,.72)`, `backdrop-filter: blur(12px)`, 1px `#E5E0D8` hairline border, faint shadow. Past 80px scroll: background opacity → `.88`, shadow deepens, 250ms transition.

**Scroll progress line:** 2px accent bar along the pill's bottom edge, width tracking scroll depth. `animation-timeline: scroll()` (native CSS scroll-driven animation) where supported — this codebase already has one progressive-enhancement precedent for this exact API (`.settle`/`.glow-drift` in the current dark-theme CSS, gated behind `@supports (animation-timeline: view())`), so this follows established convention rather than introducing a new pattern. `IntersectionObserver`-based fallback (approximating scroll depth from a set of position markers) for browsers without support.

Nav links: accent underline wipe-in from left on hover, 200ms — this is `.link-warm`'s existing behavior, no change needed. Nav CTA: background darkens 8%, lifts 1px, 150ms — new, since the current nav CTA is a plain `.btn-warm` link with no nav-specific hover state.

## 11. Mock content population

- **Capture block:** the pill's backing "screen" becomes a static Slack-style conversation — a channel-name title bar, 3-4 message rows with avatar circles, the "tour at 4?" message visually highlighted (matching the hero's own scattered-card content for a consistent through-line). New content lives in `CapturePillMock.tsx` or a small sibling component it composes.
- **Daily note mock:** 6-8 `NoteEntry` rows (up from today's 3), including the existing collapsed-group row, varied timestamps across the day, two entries with `annotation` set, and thumbnails already exist per-row (the placeholder color-swatch thumbnails built in the original rebuild) — this is a data-only change to `FeatureBlocks.tsx`'s `DAILY_ENTRIES`, no component code changes needed beyond what §9 already requires for the expand/re-collapse beat.
- **Ask mock:** 6+ `NoteEntry` rows spanning multiple days (up from today's 2), with the live-filter narrowing behavior now handled by §9's Ask demo animation rather than the current instant done/not-done toggle.
- **Layering:** every mock frame gets a second element behind it — an offset, accent-tinted card rotated 1-2°, using `MockFrame`'s existing (currently unused) `rotate` prop — the overlap effect the original design spec called for and that got skipped when every mock shipped as a single flat rectangle.
- **Window chrome:** each `MockFrame` gains a minimal title bar (three small dots + a text label, macOS-style, matching the "reads as a window" requirement) — new markup inside `MockFrame.tsx`, applied to every consumer automatically once `MockFrame` actually wraps the mocks (today several mocks render without `MockFrame` at all, per the final review's orphaned-component finding — this pass is also what finally puts `MockFrame` to use).

## 12. Copy

Real, final copy replaces every bracketed placeholder across the homepage — hero, problem statement, all three feature blocks, the rail, privacy columns (plus a new below-columns processing-disclosure line), download CTA. Exact strings are in the user's pass-2 message and carry over verbatim into the implementation plan's task briefs; not repeated here since they're not a design decision, just content to transcribe. Anything invented beyond those exact strings (mock Slack message content, daily-note entry summaries, ask-result content, the placeholder social-proof line) gets `<!-- PLACEHOLDER -->`.

## 13. Micro-interactions

- Primary CTAs: lift 2px + shadow-fade-in (via the pseudo-element pattern from §1, not a `box-shadow` transition), 150ms; on press, scale `0.98`, 80ms. This extends `.btn-warm`'s existing hover state, doesn't replace it.
- **Magnetic download button** (the full-width Download CTA only, not every button): within 80px of cursor, translates toward it up to 6px, lerped at 0.12/frame via `requestAnimationFrame`. Disabled on touch.
- **Mock frame 3D tilt on hover:** `rotateX`/`rotateY` up to 3°, `perspective: 1200px`, lerped. Disabled on touch and under reduced motion.
- Links: underline wipe, 200ms — existing `.link-warm` behavior.
- Rail items on hover: text color shifts toward `#1A1A1A`, 150ms — new, on `StepRail.tsx`'s items specifically (separate from their active/inactive state color, which is scroll-driven not hover-driven).

## 14. Page transitions

`view-transition-name` applied to navigation into `/download` and `/privacy`, with a shared transition name on the nav pill specifically so it persists across the transition rather than cross-fading/re-animating. Native View Transitions API (`document.startViewTransition`, or Next.js's built-in support if the installed Next 16 version exposes it directly — verify during implementation) — no new dependency. Browsers without support get a normal instant navigation (progressive enhancement, not a broken experience).

## 15. Performance budget (non-negotiable, per the user)

- 60fps on the hero with cursor parallax active
- No layout thrash — batched reads/writes, no layout reads inside `requestAnimationFrame` callbacks that follow a write in the same frame
- Hero loop and every in-block demo pause when off-screen (already true for the hero via `useInView`; the in-block demos need the same gate, which `useInView`'s replay-capable mode from §9 already provides)
- Lighthouse performance ≥ 90 with everything running

If any single item can't hit this budget during implementation, the build-order phase that hits the problem stops and reports which item and a cheaper alternative, rather than shipping something janky — this is the user's explicit instruction, carried into the implementation plan's task-level acceptance criteria.

## 16. Build order (maps directly onto implementation-plan tasks)

Matches the user's own phasing exactly, one commit + report per phase, none batched:

1. Nav (pill, scroll state, progress line) + rounded panels
2. Page-load sequence + headline mask reveal
3. Step rail (sliding indicator) + sticky media + scale-on-pin
4. Hero additions (cursor parallax, timestamp typing) — the hero animation's *base* 4-phase loop and mock-content population (§11) are prerequisites that land in earlier phases of the implementation plan (they're needed by phase 1-3's work and by the in-block demos in phase 5), not folded into this phase, which is specifically the two hero *additions* on top of the already-approved base loop
5. In-block demo animations (capture, daily note, ask)
6. Micro-interactions + page transitions
7. Reduced-motion pass + performance pass

Each phase's implementation-plan task requires, per the user's instruction: files changed, and for anything scroll-driven, the actual values used (rootMargin, thresholds, computed sticky-parent heights) rather than a bare confirmation it's implemented.
