'use client'

import posthog from 'posthog-js'

let initialised = false

export function initPostHog() {
  if (typeof window === 'undefined') return
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key || initialised) return
  initialised = true

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    persistence: 'localStorage',  // no cookies → GDPR-friendly, no banner needed
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,           // explicit events only — no auto-clicking
    capture_performance: { web_vitals: true }, // field INP/CLS/LCP — scroll-linked work is where regressions hide
  })
}

/** Map a referrer hostname to a readable source bucket (falls back to the cleaned host). */
function mapReferrer(host: string): string {
  const h = host.replace(/^www\./, '')
  if (/(^|\.)(x\.com|twitter\.com|t\.co)$/.test(h)) return 'x'
  if (/(^|\.)(linkedin\.com|lnkd\.in)$/.test(h)) return 'linkedin'
  if (/(^|\.)(youtube\.com|youtu\.be)$/.test(h)) return 'youtube'
  if (/(^|\.)(instagram\.com)$/.test(h)) return 'instagram'
  if (/(^|\.)(tiktok\.com)$/.test(h)) return 'tiktok'
  return h
}

/** Resolve traffic source from: localStorage → cookie → utm_source param → referrer → 'direct' */
export function getSource(): string {
  if (typeof window === 'undefined') return 'direct'

  // 1. Already resolved this session
  const stored = localStorage.getItem('traffic_source')
  if (stored) return stored

  // 2. Cookie set by middleware (vanity routes)
  const cookieMatch = document.cookie.split(';').find(c => c.trim().startsWith('traffic_source='))
  if (cookieMatch) {
    const val = decodeURIComponent(cookieMatch.split('=').slice(1).join('=').trim())
    if (val) { localStorage.setItem('traffic_source', val); return val }
  }

  // 3. utm_source query param
  const utm = new URLSearchParams(window.location.search).get('utm_source')
  if (utm) { localStorage.setItem('traffic_source', utm); return utm }

  // 4. Referrer hostname → mapped to a readable source bucket
  if (document.referrer) {
    try {
      const source = mapReferrer(new URL(document.referrer).hostname)
      localStorage.setItem('traffic_source', source)
      return source
    } catch { /* ignore malformed referrer */ }
  }

  // 5. Default
  localStorage.setItem('traffic_source', 'direct')
  return 'direct'
}

/** Register source as a PostHog super-property so every event carries it */
export function registerSource() {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  const source = getSource()
  posthog.register({ source })
  // Also forward any UTM params PostHog didn't already catch
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const v = params.get(k)
    if (v) utm[k] = v
  }
  if (Object.keys(utm).length) posthog.register(utm)
}

/** Safe capture — no-ops if PostHog isn't initialised */
export function capture(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  posthog.capture(event, props)
}
