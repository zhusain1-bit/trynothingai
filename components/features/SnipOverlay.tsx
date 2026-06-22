'use client'

import type { CSSProperties } from 'react'

const SNIP_TOOL_SVG = `
<span style="width:27px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#3a3a3a">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" fill="currentColor" stroke="none"/></svg>
</span>
<span style="width:27px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#3a3a3a">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 7h14M5 12h14M5 17h14"/></svg>
</span>
<span style="width:1px;height:16px;background:#d3d3d1;margin:0 3px"></span>
<span style="width:27px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#1a4fd0;background:#d9e4ff">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2"/></svg>
</span>
<span style="width:27px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#3a3a3a">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 4.6v8.8L12 21l-8-4.6V7.6z"/></svg>
</span>
<span style="width:27px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#3a3a3a">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="4"/></svg>
</span>
<span style="width:1px;height:16px;background:#d3d3d1;margin:0 3px"></span>
<span style="width:27px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#3a3a3a">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
</span>`

export interface SnipState {
  dimShow: boolean
  toolShow: boolean
  selShow: boolean
  selStyle: CSSProperties
  scrimShow: boolean
  flashKey: number
}

export const SNIP_INITIAL: SnipState = {
  dimShow: false, toolShow: false,
  selShow: false, selStyle: { left: 0, top: 0, width: 0, height: 0 },
  scrimShow: false, flashKey: 0,
}

export function SnipOverlay({ dimShow, toolShow, selShow, selStyle, scrimShow, flashKey }: SnipState) {
  return (
    <>
      {/* Dark scrim over page after capture */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,9,12,.58)',
          opacity: scrimShow ? 1 : 0,
          zIndex: 14,
          transition: '.4s',
          pointerEvents: 'none',
        }}
      />

      {/* Lighter dim while snipping */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,.22)',
          opacity: dimShow ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 20,
          transition: '.2s',
        }}
      />

      {/* Windows snip toolbar */}
      <div
        style={{
          position: 'absolute',
          top: 38, left: '50%',
          transform: `translateX(-50%) translateY(${toolShow ? 0 : -16}px)`,
          zIndex: 40,
          opacity: toolShow ? 1 : 0,
          transition: '.3s var(--ease)',
          display: 'flex', alignItems: 'center', gap: 2,
          background: '#f1f1f0',
          border: '1px solid #d6d6d4',
          borderRadius: 10,
          padding: '5px 7px',
          boxShadow: '0 14px 36px -12px rgba(0,0,0,.6)',
        }}
        dangerouslySetInnerHTML={{ __html: SNIP_TOOL_SVG }}
      />

      {/* Selection rectangle */}
      <div
        style={{
          position: 'absolute',
          zIndex: 30,
          border: '1.5px dashed rgba(255,255,255,.96)',
          outline: '1px dashed rgba(0,0,0,.5)',
          boxShadow: selShow ? '0 0 0 9999px rgba(0,0,0,.42)' : 'none',
          borderRadius: 3,
          opacity: selShow ? 1 : 0,
          transition: 'left .12s linear, top .12s linear, width .64s var(--ease), height .64s var(--ease), opacity .2s',
          pointerEvents: 'none',
          ...selStyle,
        }}
      >
        <span style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: '#fff', border: '1px solid #aaa', right: -4, bottom: -4 }} />
      </div>

      {/* White flash on capture */}
      <div
        key={flashKey}
        style={{
          position: 'absolute', inset: 0,
          background: '#fff',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 45,
          animation: flashKey > 0 ? 'snipFlash .4s var(--ease)' : 'none',
        }}
      />
    </>
  )
}
