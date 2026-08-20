import { ImageResponse } from 'next/og'

// Social share card (1200×630), rendered at build time. Placeholder copy —
// final copy pending, matches the new capture/daily-note/ask narrative
// (design spec §8).

export const alt = 'nothing.ai — capture, and it finds its way into your day'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#FAF8F5',
          color: '#1A1A1A',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', fontSize: 30, letterSpacing: 4 }}>
            <span style={{ color: '#1A1A1A' }}>nothing</span>
            <span style={{ color: '#C2410C' }}>.ai</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ fontSize: 68, fontWeight: 600, letterSpacing: -2, lineHeight: 1.08, color: '#1A1A1A', maxWidth: 940 }}>
            [Placeholder headline — final copy pending]
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: '#6B6B6B', maxWidth: 880 }}>
            [Placeholder subline — capture, daily note, ask across every day. Final copy pending.]
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 1, color: '#C2410C' }}>
            trynothingai.com
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#6B6B6B' }}>
            3-day free trial · $9.99/mo
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
