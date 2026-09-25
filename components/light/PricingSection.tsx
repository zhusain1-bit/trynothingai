'use client'

import { useEffect } from 'react'
import { Reveal } from '@/components/apple/Reveal'
import { useInView } from '@/components/features/useInView'
import { capture } from '@/lib/posthog'
import { FEATURES, PLANS, formatPrice, isLive } from '@/lib/pricing'
import { TrackedLink } from '@/components/pricing/TrackedLink'
import { IconCheck } from '@/components/pricing/icons'
import { SectionHead } from '@/components/home/SectionHead'

// Homepage pricing: two simple cards with 5 highlights each. The full
// comparison lives on /pricing — visitors shouldn't read 30 checkboxes to
// pick a plan.
export function PricingSection() {
  const { ref, inView } = useInView(0.3)
  useEffect(() => {
    if (inView) capture('pricing_viewed', { location: 'home' })
  }, [inView])

  const plans = [PLANS.individual, PLANS.enterprise]
  return (
    <section id="pricing" className="home-section" style={{ background: '#F2EFE9' }}>
      <div ref={ref} style={{ maxWidth: 920, margin: '0 auto' }}>
        <SectionHead eyebrow="pricing" title="Pick the plan that fits." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginTop: 'clamp(32px,5vw,48px)' }}>
          {plans.map((p, i) => (
            <Reveal key={p.id} variant="light" panel index={i + 1}>
              <article
                aria-labelledby={`home-plan-${p.id}`}
                className="card-warm flex flex-col"
                style={{ height: '100%', background: i === 0 ? '#FFFFFF' : '#FAF8F5', border: '1px solid #E5E0D8', borderRadius: 16, padding: 'clamp(24px,3.5vw,32px)' }}
              >
                <span className="font-mono" style={{ fontSize: 11.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                  {p.perUser ? 'for your organization' : 'for you'}
                </span>
                <h3 id={`home-plan-${p.id}`} style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A', marginTop: 6 }}>{p.name}</h3>
                <p style={{ fontSize: 14.5, color: '#6B6B6B', marginTop: 2 }}>{p.descriptor}</p>
                {/* Price is the dominant element: number, unit, intro terms, then what it becomes. */}
                <div style={{ marginTop: 24 }}>
                  <div className="flex items-baseline" style={{ gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 'clamp(60px,7vw,76px)', lineHeight: 0.95, color: '#1A1A1A', letterSpacing: '-.02em' }}>
                      {formatPrice(p.introPrice)}
                    </span>
                    <span style={{ fontSize: 17, color: '#1A1A1A' }}>{p.perUser ? '/user/month' : '/month'}</span>
                  </div>
                  <p style={{ fontSize: 15, color: '#1A1A1A', marginTop: 10 }}>for your first {p.introMonths} months</p>
                  <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 2 }}>
                    {formatPrice(p.standardPrice)}{p.perUser ? '/user/month' : '/month'} after
                  </p>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 22, paddingTop: 18, borderTop: '1px solid #EFEBE4', flex: 1 }}>
                  {p.highlights.map(k => (
                    <li key={k} className="flex items-center" style={{ gap: 10, fontSize: 13.5, color: '#6B6B6B' }}>
                      <span style={{ color: '#6B6B6B', display: 'flex' }}><IconCheck /></span>
                      {FEATURES[k].label}
                      {!isLive(k) && <span className="soon-tag">soon</span>}
                    </li>
                  ))}
                </ul>
                <TrackedLink
                  href={p.cta.href}
                  event={p.id === 'individual' ? 'individual_cta_clicked' : 'enterprise_cta_clicked'}
                  props={{ location: 'home_pricing' }}
                  className={i === 0 ? 'btn-warm' : 'btn-warm-outline'}
                  style={{ display: 'flex', width: '100%', marginTop: 24, padding: '14px 22px', fontSize: 15 }}
                >
                  {p.cta.label}
                </TrackedLink>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal variant="light">
          <p style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="/pricing#compare" className="link-warm" style={{ fontSize: 15 }}>Compare every feature →</a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
