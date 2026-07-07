'use client'

// Single shared scroll manager: one passive scroll listener + one rAF loop
// for every scroll-linked effect on the page (text brightening, pinned
// sequences, parallax). Components subscribe instead of adding their own
// listeners, so scroll work stays on one frame budget.

type FrameCallback = () => void

const subscribers = new Set<FrameCallback>()
let listening = false
let ticking = false

function onScrollOrResize() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    subscribers.forEach(cb => cb())
    ticking = false
  })
}

export function onScrollFrame(cb: FrameCallback): () => void {
  subscribers.add(cb)
  if (!listening && typeof window !== 'undefined') {
    listening = true
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
  }
  // Fire once so late-mounting components sync to the current position
  requestAnimationFrame(cb)
  return () => {
    subscribers.delete(cb)
    // Listener stays armed for the page's lifetime — it's one no-op callback
    // when the set is empty, cheaper than add/remove churn.
  }
}

/**
 * Progress (0..1) of an element's top edge travelling through a viewport band.
 * fromVh/toVh are viewport-height fractions: with (0.75, 0.35) progress is 0
 * while the top sits below 75% of the viewport and 1 once it passes 35%.
 */
export function bandProgress(el: HTMLElement, fromVh = 0.75, toVh = 0.35): number {
  const vh = window.innerHeight
  const top = el.getBoundingClientRect().top
  const from = vh * fromVh
  const to = vh * toVh
  return Math.min(1, Math.max(0, (from - top) / (from - to)))
}
