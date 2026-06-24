'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { initPostHog, registerSource, capture } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const firstRender = useRef(true)

  // Initialise once on mount
  useEffect(() => {
    initPostHog()
    registerSource()
  }, [])

  // Capture $pageview on SPA route changes only. The initial load is already captured by
  // posthog.init({ capture_pageview: true }), which reliably attaches referrer + UTMs —
  // so we skip the first render here to avoid double-counting.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    capture('$pageview', { path: pathname })
  }, [pathname])

  return <>{children}</>
}
