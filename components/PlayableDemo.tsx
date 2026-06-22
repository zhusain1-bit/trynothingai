'use client'

import { AutoHeroDemo } from '@/components/demo/AutoHeroDemo'

export function PlayableDemo() {
  return (
    <div style={{ maxWidth: 860, width: '100%', margin: '0 auto', position: 'relative' }}>
      <div
        style={{
          aspectRatio: '16/10',
          borderRadius: 22,
          background: '#0A0B0D',
          border: '1px solid rgba(255,255,255,.07)',
          boxShadow: '0 40px 120px -30px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.04)',
          overflow: 'hidden',
          position: 'relative',
          userSelect: 'none',
        }}
      >
        <AutoHeroDemo />
      </div>
    </div>
  )
}
