import { type Plan, formatPrice, afterLine } from '@/lib/pricing'

// Intro price large, the standard price struck through beside it, and the
// "then $X after" terms stated plainly underneath — the discount reads as a
// founding price, not a sale banner.
export function PriceDisplay({ plan }: { plan: Plan }) {
  return (
    <div>
      <div className="flex items-end flex-wrap" style={{ gap: '4px 14px' }}>
        <div className="flex items-baseline" style={{ gap: 10 }}>
          <s style={{ fontSize: 20, color: '#9A958D' }} aria-label={`was ${formatPrice(plan.standardPrice)}`}>
            {formatPrice(plan.standardPrice)}
          </s>
          <span
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(48px, 6vw, 60px)',
              lineHeight: 1,
              color: '#1A1A1A',
              letterSpacing: '-.01em',
            }}
          >
            {formatPrice(plan.introPrice)}
          </span>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.4, color: '#6B6B6B', paddingBottom: 4 }}>
          <div>USD {plan.perUser ? '/ user / month' : '/ month'}</div>
          <div>for your first {plan.introMonths} months</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#6B6B6B', marginTop: 12 }}>
        <span className="font-mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>
          Founding access
        </span>
        <span aria-hidden="true"> · </span>
        {afterLine(plan)}
      </p>
    </div>
  )
}
