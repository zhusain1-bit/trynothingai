'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/components/features/useInView'

// Shared wrapper for the 3 pre-rendered product-motion clips (hero loop +
// the setup/extraction feature-block demos). Each clip is already a fully
// composed scene (see NothingAI/Animations/README.md) — no MockFrame
// title-bar chrome on top, just the site's standard 12px radius + shadow.
//
// `priority` (hero only) autoplays immediately; the other two are
// below-the-fold and only play once scrolled into view (paused otherwise),
// matching the reduced-motion + useInView pattern already used by
// CaptureDemo/HeroAnimation elsewhere in this component set.
export function ProductVideo({
  src,
  poster,
  alt,
  priority = false,
}: {
  src: string
  poster: string
  alt: string
  priority?: boolean
}) {
  const { ref, inView } = useInView({ threshold: 0.3, once: false })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const t = setTimeout(() => setReducedMotion(mq.matches), 0)
    const handler = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => { clearTimeout(t); mq.removeEventListener('change', handler) }
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el || reducedMotion) return
    if (inView || priority) el.play().catch(() => {})
    else el.pause()
  }, [inView, reducedMotion, priority])

  return (
    <div
      ref={ref}
      className="w-full"
      style={{
        aspectRatio: '16 / 9',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)',
        background: '#E9E5DC',
      }}
    >
      {reducedMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay={priority}
          preload={priority ? 'auto' : 'metadata'}
          poster={poster}
          aria-label={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
