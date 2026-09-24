import { type Plan } from '@/lib/pricing'
import { PriceDisplay } from './PriceDisplay'
import { FeatureList } from './FeatureList'
import { TrackedLink } from './TrackedLink'

export function PricingCard({ plan, emphasis = false, note }: { plan: Plan; emphasis?: boolean; note: string }) {
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className="card-warm flex flex-col"
      style={{
        height: '100%',
        background: emphasis ? '#FFFFFF' : '#F2EFE9',
        border: '1px solid #E5E0D8',
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 'clamp(24px, 4vw, 36px)' }}>
        <h2 id={`plan-${plan.id}`} style={{ fontSize: 22, fontWeight: 600, color: '#1A1A1A', letterSpacing: '-.01em' }}>
          {plan.name}
        </h2>
        <p style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 21, color: '#1A1A1A', marginTop: 4 }}>
          {plan.descriptor}
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: '#6B6B6B', marginTop: 8, maxWidth: 400 }}>{plan.description}</p>

        <div style={{ marginTop: 28 }}>
          <PriceDisplay plan={plan} />
        </div>

        <TrackedLink
          href={plan.cta.href}
          event={plan.id === 'individual' ? 'individual_cta_clicked' : 'enterprise_cta_clicked'}
          props={{ location: 'card' }}
          className={emphasis ? 'btn-warm' : 'btn-warm-outline'}
          style={{ display: 'flex', width: '100%', marginTop: 28, padding: '14px 22px', fontSize: 15 }}
        >
          {plan.cta.label}
        </TrackedLink>
        <p style={{ fontSize: 12.5, color: '#6B6B6B', textAlign: 'center', marginTop: 10 }}>{note}</p>
      </div>

      <div style={{ borderTop: '1px solid #E5E0D8', padding: 'clamp(24px, 4vw, 36px)', flex: 1 }}>
        <FeatureList features={plan.features} intro={plan.featuresIntro} />
      </div>
    </article>
  )
}
