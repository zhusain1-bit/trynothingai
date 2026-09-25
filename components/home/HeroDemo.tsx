'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { DemoSlot } from './DemoSlot'

// The `hero` demo slot (lib/demoSlots.ts): HeroCaptureToRow — a professional
// profile is screenshotted and becomes a new row in a nothing.ai project.
// Desktop and phone renders each have their own camera; the loop is seamless.

export type HeroDemoHandle = { restart: () => void }

export const HeroDemo = forwardRef<HeroDemoHandle>(function HeroDemo(_, handle) {
  useImperativeHandle(handle, () => ({
    restart: () => {
      window.dispatchEvent(new CustomEvent('demo-restart', { detail: 'hero' }))
    },
  }))

  return (
    <figure>
      <DemoSlot
        id="hero"
        label="A professional profile for Jordan Ellis is screenshotted, and a new row — Jordan Ellis, Senior Product Manager, Northwind Analytics, Austin, TX, and the profile link — appears in a nothing.ai project table."
      />
      <figcaption className="flex items-center justify-center" style={{ gap: 10, marginTop: 16, fontSize: 13, color: '#6B6B6B' }}>
        A profile <span aria-hidden="true" style={{ color: '#C9C3B9' }}>→</span> One screenshot{' '}
        <span aria-hidden="true" style={{ color: '#C9C3B9' }}>→</span> <span style={{ color: '#1A1A1A', fontWeight: 600 }}>A new row</span>
      </figcaption>
    </figure>
  )
})
