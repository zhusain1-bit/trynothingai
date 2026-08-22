import { Reveal } from '@/components/apple/Reveal'

const FEATURES = [
  { title: 'Projects', body: 'Organize captures by client or topic. A capture filed to a project lives only there — filing is a move, not a tag.' },
  { title: 'Future', body: "Anything with a date gets surfaced separately, soonest first — what's coming up, without you having to ask." },
  { title: 'Notes overlay', body: 'Alt+D jumps straight to your most recent capture, Ctrl+D opens today from the top — a fast glance without opening the app.' },
  { title: 'My notes vs Enhanced', body: 'Your own typed words are always kept exactly as you wrote them. A manual edit is never silently overwritten by AI again.' },
]

export function MoreFeaturesGrid() {
  return (
    <section style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#FAF8F5' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <Reveal variant="light">
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
            more under the hood
          </span>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginTop: 20 }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} variant="light" panel index={i}>
              <div className="card-warm" style={{ background: '#F2EFE9', border: '1px solid #E5E0D8', borderRadius: 12, padding: 22, height: '100%' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: '#6B6B6B', marginTop: 8, lineHeight: 1.6 }}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
