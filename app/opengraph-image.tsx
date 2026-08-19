import { ImageResponse } from 'next/og'

// Social share card (1200×630) rendered at build time by next/og.
// No custom font is loaded — next/og's bundled sans default keeps the bundle
// small and the build deterministic. Satori rule: every div with >1 child sets
// display:flex explicitly.

export const alt = 'nothing.ai — make your screenshots smarter'
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
          background: 'linear-gradient(135deg, #0A0B0D 0%, #101218 100%)',
          color: '#E9EBEF',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: '3px solid #E9EBEF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 999,
                background: '#AEC2FF',
                boxShadow: '0 0 22px 4px rgba(174,194,255,0.85)',
              }}
            />
          </div>
          <div style={{ display: 'flex', fontSize: 30, letterSpacing: 4 }}>
            <span style={{ color: '#E9EBEF' }}>nothing</span>
            <span style={{ color: '#AEC2FF' }}>.ai</span>
          </div>
        </div>

        {/* Headline + subline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.04,
              color: '#E9EBEF',
              maxWidth: 940,
            }}
          >
            Make your screenshots smarter.
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: '#878C96',
              maxWidth: 880,
            }}
          >
            the faceless desktop ai that turns the screenshots you forget into
            reminders, events, and collections you actually use.
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 1, color: '#AEC2FF' }}>
            trynothingai.com
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: '#878C96' }}>
            3-day free trial · $9.99/mo
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
