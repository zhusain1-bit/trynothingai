'use client'

import { useEffect, useRef } from 'react'
import { capture, getSource } from '@/lib/posthog'

export function ThanksClient() {
  const fired = useRef(false)

  // Fire deposit_completed exactly once on mount (guard against StrictMode double-invoke).
  // No-ops if PostHog isn't configured. Stripe is the source of truth for payments —
  // this event is secondary and may be ad-blocked.
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    capture('deposit_completed', { source: getSource() })
  }, [])

  return null
}
