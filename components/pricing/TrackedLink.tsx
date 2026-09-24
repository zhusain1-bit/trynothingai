'use client'

import { capture } from '@/lib/posthog'

// A plain <a> that fires one PostHog event on click. Used for CTAs whose
// target is a mailto: or a route, so no Next <Link> prefetch semantics needed.
export function TrackedLink({
  href,
  event,
  props,
  className,
  style,
  children,
}: {
  href: string
  event: string
  props?: Record<string, unknown>
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <a href={href} className={className} style={style} onClick={() => capture(event, props)}>
      {children}
    </a>
  )
}
