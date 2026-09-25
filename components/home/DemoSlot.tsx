'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/components/features/useInView'
import { DEMO_SLOTS, type DemoSlotId } from '@/lib/demoSlots'
import { useReducedMotion } from './useReducedMotion'

// A fixed-shape frame for one product demo (see lib/demoSlots.ts). Renders
// the final video when the slot has a `src`, otherwise the interim children.
// The frame's aspect ratio is set in CSS before any media loads (no layout
// shift). Videos only start downloading once the slot is near the viewport
// (hero excepted), pause offscreen, and are replaced by the poster under
// reduced motion. Playback per slot (`playback` in demoSlots):
//   loop   — continuous while visible (hero)
//   select — plays from 0 each time the slot is shown, holds the last frame (tabs)
//   once   — plays when it meaningfully enters the viewport, holds, replays on re-entry
export function DemoSlot({
  id,
  children,
  className = '',
  style,
  label,
  active = true,
  instant = false,
  onPlaying,
}: {
  id: DemoSlotId
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Accessible description of what the demo shows. */
  label: string
  /** false: keep the frame on screen but paused (e.g. while cross-fading away). */
  active?: boolean
  /** Show the video the moment it plays (the caller is cross-fading over it). */
  instant?: boolean
  /** Fires when the video's first frames are actually playing. */
  onPlaying?: () => void
}) {
  const slot = DEMO_SLOTS[id]
  const playback = slot.playback ?? 'loop'
  const reduced = useReducedMotion()
  const { ref: nearRef, inView: nearInView } = useInView({ threshold: 0, rootMargin: '400px 0px', once: true })
  // `once` waits until the demo is meaningfully in view; the others start as soon as a quarter shows.
  const { ref: visibleRef, inView: isVisible } = useInView({ threshold: playback === 'once' ? 0.45 : 0.25, once: false })
  const [isPhone, setIsPhone] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${slot.mobileBelow - 1}px)`)
    const h = () => setIsPhone(mq.matches)
    h()
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [slot.mobileBelow])

  const phoneMedia = isPhone && !!slot.mobileSrc
  const src = phoneMedia ? slot.mobileSrc : slot.src
  const webm = phoneMedia ? slot.mobileWebm : slot.webm
  const poster = (isPhone && slot.mobilePoster) || slot.poster
  const load = slot.priority || nearInView

  return (
    <div
      ref={nearRef}
      data-demo-slot={id}
      data-mb={slot.mobileBelow}
      className={`demo-slot ${className}`}
      style={
        {
          '--ar': slot.aspect,
          '--ar-m': slot.mobileAspect ?? slot.aspect,
          ...style,
        } as React.CSSProperties
      }
    >
      <div ref={visibleRef} style={{ position: 'absolute', inset: 0 }}>
        {src ? (
          // Passive, supplementary media: the frame carries the description; the video and its
          // poster are decorative so screen readers don't announce playback internals.
          <div role="img" aria-label={label} style={{ position: 'absolute', inset: 0 }}>
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" aria-hidden="true" className="demo-slot-media" fetchPriority={slot.priority ? 'high' : 'auto'} />
            ) : null}
            {!reduced && load ? (
              <SlotVideo
                key={src}
                id={id}
                src={src}
                webm={webm}
                playback={playback}
                play={active && isVisible}
                priority={!!slot.priority}
                instant={instant}
                onPlaying={onPlaying}
              />
            ) : null}
          </div>
        ) : (
          <div className="demo-slot-interim" role="img" aria-label={label}>
            {load ? children : null}
          </div>
        )}
      </div>
    </div>
  )
}

function SlotVideo({
  id,
  src,
  webm,
  playback,
  play,
  priority,
  instant,
  onPlaying,
}: {
  id: DemoSlotId
  src: string
  webm?: string
  playback: 'loop' | 'select' | 'once'
  play: boolean
  priority: boolean
  instant: boolean
  onPlaying?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [shown, setShown] = useState(false)

  // Play / pause with visibility; `once` replays from the top if it had finished.
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (!play) {
      v.pause()
      return
    }
    if (playback === 'once' && v.ended) v.currentTime = 0
    if (playback === 'select' && v.ended) return // hold the finished state
    v.play().catch(() => {})
  }, [play, playback])

  // "Watch it work" and similar: restart this slot's video from the top.
  useEffect(() => {
    const onRestart = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) return
      const v = ref.current
      if (v) {
        v.currentTime = 0
        v.play().catch(() => {})
      }
    }
    window.addEventListener('demo-restart', onRestart)
    return () => window.removeEventListener('demo-restart', onRestart)
  }, [id])

  return (
    <video
      ref={ref}
      className="demo-slot-media"
      style={{ opacity: shown ? 1 : 0, transition: instant ? 'none' : 'opacity 220ms ease' }}
      muted
      loop={playback === 'loop'}
      playsInline
      autoPlay={priority}
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => {
        setShown(true)
        onPlaying?.()
      }}
    >
      {webm ? <source src={webm} type='video/webm; codecs="vp9"' /> : null}
      <source src={src} type="video/mp4" />
    </video>
  )
}
