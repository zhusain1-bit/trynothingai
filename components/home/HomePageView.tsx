'use client'

import { useEffect } from 'react'
import { capture } from '@/lib/posthog'

// Named funnel event alongside PostHog's automatic $pageview.
export function HomePageView() {
  useEffect(() => {
    capture('homepage_view')
  }, [])
  return null
}
