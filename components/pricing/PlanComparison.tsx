'use client'

import { useEffect } from 'react'
import { useInView } from '@/components/features/useInView'
import { capture } from '@/lib/posthog'
import { COMPARISON, FEATURES, PLANS, formatPrice, perUnit, type Cell, type FeatureKey } from '@/lib/pricing'
import { IconCheck } from './icons'

function CellValue({ value, feature }: { value: Cell; feature: FeatureKey }) {
  if (value === false) {
    return (
      <span style={{ color: '#B5AFA6' }} aria-label="Not included">
        —
      </span>
    )
  }
  const soon = FEATURES[feature].status === 'soon'
  return (
    <span className="inline-flex items-center justify-center flex-wrap" style={{ gap: 2 }}>
      {value === true ? (
        <span style={{ color: '#1A1A1A', display: 'flex' }} role="img" aria-label="Included">
          <IconCheck />
        </span>
      ) : (
        <span style={{ color: '#1A1A1A' }}>{value}</span>
      )}
      {soon && <span className="soon-tag">soon</span>}
    </span>
  )
}

export function PlanComparison() {
  const { ref, inView } = useInView(0.2)
  useEffect(() => {
    if (inView) capture('pricing_comparison_viewed')
  }, [inView])

  return (
    <section id="compare" style={{ padding: 'clamp(80px, 12vw, 140px) 24px 0' }}>
      <div ref={ref} style={{ maxWidth: 880, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(30px, 4.2vw, 44px)',
            color: '#1A1A1A',
            textAlign: 'center',
          }}
        >
          Compare plans
        </h2>
        <p className="font-mono sm:hidden" style={{ fontSize: 11, letterSpacing: '.08em', color: '#6B6B6B', textAlign: 'right', marginTop: 20 }}>
          swipe to compare →
        </p>
        <div
          className="table-scroll"
          role="region"
          aria-label="Plan comparison"
          tabIndex={0}
          style={{ overflowX: 'auto', marginTop: 'clamp(28px, 4vw, 44px)' }}
        >
          <table className="pricing-table">
            <caption className="sr-only">Features included in Individual and Enterprise</caption>
            <thead>
              <tr>
                <th scope="col" style={{ fontSize: 13, fontWeight: 400, color: '#6B6B6B' }}>
                  Feature
                </th>
                {[PLANS.individual, PLANS.enterprise].map(p => (
                  <th key={p.id} scope="col" style={{ verticalAlign: 'bottom' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{p.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 400, color: '#6B6B6B', marginTop: 2, lineHeight: 1.4 }}>
                      {formatPrice(p.introPrice)}
                      {perUnit(p)}
                      <br />
                      first {p.introMonths} months
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {COMPARISON.map(g => (
              <tbody key={g.group}>
                <tr className="group-row">
                  <th scope="rowgroup" colSpan={3}>
                    {g.group}
                  </th>
                </tr>
                {g.rows.map(r => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    <td>
                      <CellValue value={r.individual} feature={r.feature} />
                    </td>
                    <td>
                      <CellValue value={r.enterprise} feature={r.enterpriseFeature ?? r.feature} />
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginTop: 16 }}>
          <span className="soon-tag" style={{ marginLeft: 0, marginRight: 6 }}>
            soon
          </span>
          on the roadmap and rolling out — not in the app yet.
        </p>
      </div>
    </section>
  )
}
