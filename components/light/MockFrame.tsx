'use client'

import { useEffect, useRef, useState } from 'react'

export function MockFrame({
  children,
  className = '',
  rotate = 0,
  chrome = false,
  chromeTitle,
  layered = false,
  minHeight,
}: {
  children: React.ReactNode
  className?: string
  rotate?: number
  /** minimal macOS-style title-bar dots, so the mock reads as a window */
  chrome?: boolean
  /** optional label shown in the title bar next to the dots (e.g. a channel name) */
  chromeTitle?: string
  /** offset, rotated accent-tinted card behind the frame, for depth */
  layered?: boolean
  minHeight?: number
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [tiltDisabled, setTiltDisabled] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setTiltDisabled(
        window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      )
    }, 0)
    return () => clearTimeout(t)
  }, [])

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (tiltDisabled) return
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -py * 3, y: px * 3 })
  }

  function onPointerLeave() {
    setTilt({ x: 0, y: 0 })
  }

  const baseTransform = rotate ? `rotate(${rotate}deg)` : ''
  const tiltTransform = tiltDisabled ? '' : `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`

  const inner = (
    <div
      ref={frameRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`overflow-hidden rounded-[12px] mock-frame-tilt ${className}`}
      style={{
        boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)',
        transform: [baseTransform, tiltTransform].filter(Boolean).join(' ') || undefined,
        background: '#0F0F0F',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {chrome && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', flexShrink: 0 }}>
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.18)' }} />
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.18)' }} />
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.18)' }} />
          {chromeTitle && (
            <span className="font-mono" style={{ marginLeft: 8, fontSize: 11, color: 'rgba(255,255,255,.4)' }}>
              {chromeTitle}
            </span>
          )}
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight }}>
        {children}
      </div>
    </div>
  )

  if (!layered) return inner

  return (
    <div style={{ position: 'relative' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          background: 'rgba(194,65,12,.10)',
          transform: 'rotate(-2deg) translate(8px, 10px)',
        }}
      />
      <div style={{ position: 'relative' }}>{inner}</div>
    </div>
  )
}
