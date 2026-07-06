'use client'

import { useState, useEffect, useRef, type RefObject } from 'react'
import { useInView } from '@/components/features/useInView'

const WORDS = [
  'a window',
  'an app to switch to',
  'a tab to leave',
  'a face to talk to',
  'one more interruption',
]

export function WhyNothingSection() {
  const { ref: sectionRef, inView } = useInView(0.2)
  const played = useRef(false)

  const [wordsIn,     setWordsIn]    = useState<boolean[]>(Array(WORDS.length).fill(false))
  const [wordsStruck, setWordsStruck] = useState<boolean[]>(Array(WORDS.length).fill(false))
  const [listGone,    setListGone]   = useState(false)
  const [revealShow,  setRevealShow] = useState(false)
  const [closeShow,   setCloseShow]  = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  function clear() { timers.current.forEach(clearTimeout); timers.current = [] }
  function at(t: number, fn: () => void) { timers.current.push(setTimeout(fn, t)) }

  useEffect(() => {
    if (!inView || played.current) return
    played.current = true

    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setWordsIn(Array(WORDS.length).fill(true))
      setWordsStruck(Array(WORDS.length).fill(true))
      setListGone(false); setRevealShow(true); setCloseShow(true)
      return
    }

    // words fade in
    WORDS.forEach((_, i) => at(300 + i * 230, () => setWordsIn(prev => { const n = [...prev]; n[i] = true; return n })))

    // strikethrough
    const strikeStart = 300 + WORDS.length * 230 + 450  // 1900ms
    WORDS.forEach((_, i) => at(strikeStart + i * 520, () => setWordsStruck(prev => { const n = [...prev]; n[i] = true; return n })))

    // collapse → reveal → close — then STOP (no loop)
    const collapse = strikeStart + WORDS.length * 520 + 500  // 5000ms
    at(collapse,        () => setListGone(true))
    at(collapse + 450,  () => setRevealShow(true))  // 5450ms
    at(collapse + 1100, () => setCloseShow(true))   // 6100ms
    // stays visible permanently — no reset

    return clear
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef as RefObject<HTMLElement>}
      className="w-full flex flex-col items-center text-center"
      style={{ background: '#000', padding: 'clamp(80px, 12vw, 160px) 24px' }}
      aria-labelledby="why-heading"
    >
      <div className="eyebrow">why &ldquo;nothing&rdquo;</div>
      <h2
        id="why-heading"
        className="headline-xl headline-dim"
        style={{ marginTop: 16, maxWidth: 820 }}
      >
        Because that&rsquo;s what it adds <span className="em">to your screen.</span>
      </h2>
      <p className="copy-l" style={{ marginTop: 18, maxWidth: 620 }}>
        Every other AI wants a <strong style={{ color: 'var(--mist)', fontWeight: 500 }}>window</strong>, a <strong style={{ color: 'var(--mist)', fontWeight: 500 }}>tab</strong>, a <strong style={{ color: 'var(--mist)', fontWeight: 500 }}>chat</strong>, a <strong style={{ color: 'var(--mist)', fontWeight: 500 }}>face</strong>. nothing.ai wants none of it. it lives in the screenshot you already take and the keystroke you already press — and the moment it's done, it's gone.
      </p>

      {/* Animated stage */}
      <div style={{ position: 'relative', height: 300, width: '100%', marginTop: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Word list */}
        <div
          style={{
            position: 'absolute',
            display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center',
            opacity: listGone ? 0 : 1,
            transform: listGone ? 'scale(.96) translateY(-6px)' : 'none',
            transition: 'opacity .6s var(--ease), transform .6s var(--ease)',
          }}
        >
          {WORDS.map((word, i) => (
            <div
              key={word}
              style={{
                position: 'relative',
                fontSize: 'clamp(22px,4vw,32px)',
                fontWeight: 500,
                color: wordsStruck[i] ? 'var(--ghost2)' : 'var(--mist)',
                opacity: wordsIn[i] ? 1 : 0,
                transform: wordsIn[i] ? 'none' : 'translateY(8px)',
                transition: 'opacity .5s var(--ease), transform .5s var(--ease), color .45s var(--ease)',
              }}
            >
              {word}
              {/* Phosphor strikethrough */}
              <span
                style={{
                  position: 'absolute',
                  left: -6, right: -6, top: '50%',
                  height: 2,
                  background: 'var(--phosphor)',
                  boxShadow: '0 0 10px var(--phosphor-glow)',
                  transform: wordsStruck[i] ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  borderRadius: 2,
                  transition: 'transform .42s var(--ease)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Reveal: "nothing." + wordmark */}
        <div
          style={{
            position: 'absolute',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
            opacity: revealShow ? 1 : 0,
            transform: revealShow ? 'none' : 'translateY(10px) scale(.98)',
            transition: 'opacity .7s var(--ease), transform .7s var(--ease)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: 'clamp(40px,8vw,68px)', fontWeight: 600, letterSpacing: '-.03em', color: 'var(--mist)' }}>
            nothing<span style={{ color: 'var(--phosphor)', textShadow: '0 0 18px var(--phosphor-glow)' }}>.</span>
          </div>
          <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 13, letterSpacing: '.3em', color: 'var(--ghost)', textTransform: 'lowercase' }}>
            — <strong style={{ color: 'var(--mist)', fontWeight: 500 }}>nothing</strong>.ai —
          </div>
        </div>
      </div>

      {/* Closing line */}
      <div
        className="font-mono"
        style={{
          marginTop: 30, fontSize: 13, color: 'var(--ghost2)', letterSpacing: '.03em', lineHeight: 1.6,
          opacity: closeShow ? 1 : 0,
          transition: 'opacity .6s var(--ease)',
        }}
      >
        just the answer, <strong style={{ color: 'var(--phosphor)', fontWeight: 400 }}>exactly when you ask for it.</strong><br />
        that's the whole point. that's the name.
      </div>
    </section>
  )
}
