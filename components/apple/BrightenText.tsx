'use client'

import { useEffect, useRef } from 'react'
import { onScrollFrame, bandProgress } from '@/lib/scroll'

/**
 * Apple's scroll-linked statement text: words start dim and light up one by
 * one as the block travels from 75% to 35% of the viewport — scrubbable in
 * both directions. Use on 2-3 statement headlines max; it's punctuation,
 * not a default. Reduced motion / no-JS: text renders fully lit.
 */
export function BrightenText({
  text,
  className = '',
  dim = 'var(--headline-dim)',
  lit = 'var(--mist)',
}: {
  text: string
  className?: string
  dim?: string
  lit?: string
}) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const litCount = useRef(-1)
  const words = text.split(' ')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const spans = Array.from(root.children) as HTMLElement[]
    // Start dim only once JS is live — SSR/no-JS ships fully lit text
    spans.forEach(s => { s.style.color = dim })

    return onScrollFrame(() => {
      const progress = bandProgress(root, 0.75, 0.35)
      const target = Math.floor(progress * spans.length + 0.0001)
      if (target === litCount.current) return
      litCount.current = target
      spans.forEach((s, i) => { s.style.color = i < target ? lit : dim })
    })
  }, [dim, lit])

  return (
    <span ref={rootRef} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ color: lit, transition: 'color .25s var(--ease-apple-ui)' }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
