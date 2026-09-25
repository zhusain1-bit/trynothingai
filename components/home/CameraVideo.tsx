'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useInView } from '@/components/features/useInView'

// A "virtual camera" over a pre-rendered product clip. The clips are wide
// 1920×1080 scenes where the UI that matters (a profile card, a table row)
// fills a third of the frame — readable on a 27" monitor, a smudge on a
// laptop and illegible on a phone. Instead of re-rendering the footage, this
// pans/zooms across it in sync with playback: each keyframe names a point in
// the source video and how much of the source should be visible around it.
//
// Keyframes interpolate with an ease-in-out between them; repeat a keyframe
// to hold a shot. Separate `mobileShots` let narrow containers frame tighter.

export type Shot = {
  /** Video time, seconds. */
  t: number
  /** Focus point in source-video pixels. */
  x: number
  y: number
  /** How many source pixels wide the visible area should be (smaller = closer). */
  w: number
}

export type CameraVideoHandle = { restart: () => void }

const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)

function shotAt(shots: Shot[], t: number): Omit<Shot, 't'> {
  if (t <= shots[0].t) return shots[0]
  for (let i = 0; i < shots.length - 1; i++) {
    const a = shots[i]
    const b = shots[i + 1]
    if (t <= b.t) {
      const p = ease((t - a.t) / Math.max(b.t - a.t, 0.0001))
      return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, w: a.w + (b.w - a.w) * p }
    }
  }
  return shots[shots.length - 1]
}

export const CameraVideo = forwardRef<
  CameraVideoHandle,
  {
    src: string
    poster: string
    /** Shown instead of the video under reduced motion — pick the payoff frame. */
    stillSrc: string
    /** object-position for the still when the frame crops it (e.g. 4:3 on phones). */
    stillPosition?: string
    alt: string
    sourceWidth?: number
    sourceHeight?: number
    shots: Shot[]
    mobileShots?: Shot[]
    /** Container width below which `mobileShots` are used. */
    mobileBelow?: number
    /** Play only this slice of the clip, looping. */
    loopStart?: number
    loopEnd?: number
    priority?: boolean
    className?: string
    style?: React.CSSProperties
    /** Called ~every frame with the current video time (for synced captions). */
    onTime?: (t: number) => void
    onPlayRequested?: () => void
  }
>(function CameraVideo(
  {
    src,
    poster,
    stillSrc,
    stillPosition = 'center',
    alt,
    sourceWidth = 1920,
    sourceHeight = 1080,
    shots,
    mobileShots,
    mobileBelow = 560,
    loopStart = 0,
    loopEnd,
    priority = false,
    className,
    style,
    onTime,
  },
  handle,
) {
  const { ref: viewRef, inView } = useInView({ threshold: 0.25, once: false })
  const boxRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  // A reduced-motion visitor who explicitly asks to watch gets the video.
  const [forcePlay, setForcePlay] = useState(false)
  const onTimeRef = useRef(onTime)
  onTimeRef.current = onTime

  useImperativeHandle(handle, () => ({
    restart: () => {
      setForcePlay(true)
      const v = videoRef.current
      if (v) {
        v.currentTime = loopStart
        v.play().catch(() => {})
      }
    },
  }))

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const h = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  const showVideo = !reducedMotion || forcePlay

  // Play while visible (hero plays regardless); pause offscreen to save CPU.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !showVideo) return
    if (inView || priority || forcePlay) v.play().catch(() => {})
    else v.pause()
  }, [inView, priority, showVideo, forcePlay])

  // Camera loop — direct style writes, no React state per frame.
  useEffect(() => {
    const v = videoRef.current
    const box = boxRef.current
    if (!v || !box || !showVideo) return
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const end = loopEnd ?? v.duration
      if (end && v.currentTime >= end - 0.03) v.currentTime = loopStart
      if (v.currentTime < loopStart - 0.05) v.currentTime = loopStart

      const cw = box.clientWidth
      const ch = box.clientHeight
      if (!cw || !ch) return
      const set = mobileShots && cw < mobileBelow ? mobileShots : shots
      const s = shotAt(set, v.currentTime)
      // Base "cover" fit of the source into the box, then zoom so `s.w`
      // source pixels span the box width, centred on (x, y) and clamped so
      // the camera never shows past the edge of the footage.
      const scale = cw / s.w
      const vw = sourceWidth * scale
      const vh = sourceHeight * scale
      const tx = Math.min(0, Math.max(cw - vw, cw / 2 - s.x * scale))
      const ty = Math.min(0, Math.max(ch - vh, ch / 2 - s.y * scale))
      v.style.width = `${vw}px`
      v.style.height = `${vh}px`
      v.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      onTimeRef.current?.(v.currentTime)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [shots, mobileShots, mobileBelow, loopStart, loopEnd, sourceWidth, sourceHeight, showVideo])

  return (
    <div
      ref={el => {
        boxRef.current = el
        ;(viewRef as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', background: '#DCDFE6', ...style }}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay={priority}
          preload={priority ? 'auto' : 'metadata'}
          poster={poster}
          aria-label={alt}
          style={{ position: 'absolute', left: 0, top: 0, maxWidth: 'none', willChange: 'transform' }}
          onLoadedMetadata={e => {
            if (loopStart) e.currentTarget.currentTime = loopStart
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={stillSrc} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: stillPosition, display: 'block' }} />
      )}
    </div>
  )
})
