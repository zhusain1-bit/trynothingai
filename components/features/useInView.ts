'use client'

import { useEffect, useRef, useState } from 'react'

type UseInViewOptions = {
  threshold?: number
  rootMargin?: string
  /** true (default): fire once and latch — matches every existing reveal-once
   *  consumer. false: toggle both ways as the element enters/leaves — needed
   *  for anything that tracks current scroll position (the step rail) or
   *  replays on re-entry (in-block demos). */
  once?: boolean
}

export function useInView(options: number | UseInViewOptions = 0.15) {
  const { threshold = 0.15, rootMargin, once = true } =
    typeof options === 'number' ? { threshold: options } : options

  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
        else if (!once) setInView(false)
      },
      { threshold, rootMargin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
