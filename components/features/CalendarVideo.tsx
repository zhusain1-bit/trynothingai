'use client'
import { useEffect, useRef } from 'react'

// Real screen recording of the calendar-capture flow. Fills the MacWindow stage
// (absolute inset-0, object-cover). Silent by design: the file has no audio track
// and the element is muted. muted is set via ref because React does not reliably
// reflect the `muted` attribute onto the DOM property, and browsers block
// un-muted autoplay.
//
// The 4.8MB file only starts downloading/playing when scrolled into view
// (preload="none" + IntersectionObserver), and pauses off-screen to save
// battery/CPU. The dark stage background stands in for a poster frame.
export function CalendarVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.25 },
    )
    obs.observe(v)
    return () => obs.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      // cover on desktop (card aspect ≈ the video's 16:9, so no meaningful crop);
      // contain on mobile, where the card is portrait and cover would slice off
      // the "Add to Calendar" popup. Letterbox bars fall back to the dark stage bg.
      className="absolute inset-0 w-full h-full object-cover max-sm:object-contain"
      style={{ background: '#08090c' }}
      src="/videos/desktop-calendar-site.mp4"
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
    />
  )
}
