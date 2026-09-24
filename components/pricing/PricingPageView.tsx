'use client'

import { useEffect } from 'react'
import { capture } from '@/lib/posthog'

// PostHog already records $pageview; this is the named funnel event the
// pricing dashboard keys on.
export function PricingPageView() {
  useEffect(() => {
    capture('pricing_page_view')
  }, [])
  return null
}
