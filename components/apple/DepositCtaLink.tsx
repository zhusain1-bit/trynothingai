'use client'

import { useEffect, useState } from 'react'
import { capture, getSource, buildDepositUrl } from '@/lib/posthog'

const STRIPE_URL = process.env.NEXT_PUBLIC_STRIPE_DEPOSIT_URL ?? null

// Apple-style chevron link to the $5 founding deposit.
// Server renders the bare STRIPE_URL; the source-attributed URL is built
// client-side after mount to avoid a hydration mismatch on href.
export function DepositCtaLink({
  location,
  children,
}: {
  location: string
  children: React.ReactNode
}) {
  const [href, setHref] = useState<string | null>(STRIPE_URL)

  useEffect(() => {
    if (STRIPE_URL) setHref(buildDepositUrl(STRIPE_URL))
  }, [])

  if (!STRIPE_URL) return null

  return (
    <a
      href={href ?? STRIPE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="cta-link"
      onClick={() => {
        capture('deposit_click', { source: getSource(), location })
        capture('deposit_started', { source: getSource(), location })
      }}
    >
      {children}
    </a>
  )
}
