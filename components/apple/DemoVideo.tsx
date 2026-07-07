'use client'

import { useEffect, useRef, useState } from 'react'

type PlayState = 'playing' | 'paused' | 'ended'

/**
 * Apple-style product video: fills a MacWindow stage (absolute inset-0),
 * autoplays muted when ≥50% in view, pauses off-screen, and carries the
 * translucent corner play/pause/replay chip (also the WCAG 2.2.2 control
 * for >5s auto-motion). Reduced motion: no autoplay — poster + play chip.
 *
 * muted is set via ref because React does not reliably reflect the attribute
 * onto the DOM property, and browsers block un-muted autoplay.
 */
export function DemoVideo({
  src,
  poster,
  label,
  loop = true,
  fit = 'cover',
}: {
  src: string
  poster?: string
  label: string
  loop?: boolean
  fit?: 'cover' | 'contain'
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<PlayState>('paused')
  const userPaused = useRef(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return // poster + chip in play state; user opts in manually

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5 && !userPaused.current && !v.ended) {
          v.play().catch(() => {})
        } else if (entry.intersectionRatio < 0.5) {
          v.pause()
        }
      },
      { threshold: [0, 0.5] },
    )
    obs.observe(v)
    return () => obs.disconnect()
  }, [])

  function toggle() {
    const v = videoRef.current
    if (!v) return
    if (state === 'ended') {
      v.currentTime = 0
      userPaused.current = false
      v.play().catch(() => {})
    } else if (state === 'playing') {
      userPaused.current = true
      v.pause()
    } else {
      userPaused.current = false
      v.play().catch(() => {})
    }
  }

  const action = state === 'playing' ? 'Pause' : state === 'ended' ? 'Replay' : 'Play'

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full ${fit === 'cover' ? 'object-cover max-sm:object-contain' : 'object-contain'}`}
        style={{ background: '#08090c' }}
        src={src}
        poster={poster}
        loop={loop}
        muted
        playsInline
        preload={poster ? 'metadata' : 'none'}
        aria-hidden="true"
        onPlay={() => setState('playing')}
        onPause={() => { if (!videoRef.current?.ended) setState('paused') }}
        onEnded={() => setState('ended')}
      />
      {/* Apple's translucent corner chip */}
      <button
        type="button"
        onClick={toggle}
        aria-label={`${action} ${label} video`}
        className="absolute flex items-center justify-center rounded-full"
        style={{
          bottom: 18,
          right: 18,
          width: 36,
          height: 36,
          background: 'rgba(60,60,64,.64)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: 'none',
          color: '#f5f5f7',
          transition: 'transform .2s var(--ease-apple-ui)',
        }}
        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {state === 'playing' ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <rect x="1.5" y="1" width="3.2" height="10" rx="1" />
            <rect x="7.3" y="1" width="3.2" height="10" rx="1" />
          </svg>
        ) : state === 'ended' ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M12.3 7a5.3 5.3 0 1 1-1.6-3.8" strokeLinecap="round" />
            <path d="M12.6 1.6v2.6h-2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M3 1.6v8.8a.6.6 0 0 0 .92.5l6.9-4.4a.6.6 0 0 0 0-1L3.92 1.1a.6.6 0 0 0-.92.5z" />
          </svg>
        )}
      </button>
    </div>
  )
}
