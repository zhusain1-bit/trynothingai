import { FEATURES, type FeatureKey, isLive } from '@/lib/pricing'
import { IconCheck } from './icons'

// Shipped features first; anything still on the roadmap is grouped under its
// own quiet heading instead of being mixed in as if it already exists.
export function FeatureList({ features, intro }: { features: FeatureKey[]; intro?: string }) {
  const live = features.filter(isLive)
  const soon = features.filter(k => !isLive(k))

  return (
    <div>
      {intro && <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>{intro}</p>}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {live.map(k => (
          <li key={k} className="flex items-start" style={{ gap: 10, fontSize: 14, lineHeight: 1.45, color: '#1A1A1A' }}>
            <span style={{ color: '#6B6B6B', marginTop: 1 }}><IconCheck /></span>
            {FEATURES[k].label}
          </li>
        ))}
      </ul>
      {soon.length > 0 && (
        <>
          <p className="font-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B', marginTop: 24, marginBottom: 10 }}>
            Rolling out next
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {soon.map(k => (
              <li key={k} className="flex items-start" style={{ gap: 10, fontSize: 14, lineHeight: 1.45, color: '#6B6B6B' }}>
                <span aria-hidden="true" style={{ width: 16, flex: 'none', textAlign: 'center' }}>·</span>
                {FEATURES[k].label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
