'use client'
import { useEffect, useRef } from 'react'

// Real screen recording of the calendar-capture flow, replacing the synthetic
// CalendarHero animation. Fills the FeaturesReel stage the same way (absolute
// inset-0, object-cover). Silent by design: the file has no audio track and the
// element is muted. muted is set via ref because React does not reliably reflect
// the `muted` attribute onto the DOM property, and browsers block un-muted autoplay.
export function CalendarVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {}) // loop/autoplay still apply if a browser rejects the call
  }, [])
  return (
    <video
      ref={ref}
      // cover on desktop (card aspect ≈ the video's 16:9, so no meaningful crop);
      // contain on mobile, where the card is portrait and cover would slice off
      // the "Add to Calendar" popup. Letterbox bars fall back to the dark stage bg.
      className="absolute inset-0 w-full h-full object-cover max-sm:object-contain"
      src="/videos/desktop-calendar-site.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  )
}
