import { Reveal } from '@/components/apple/Reveal'

const FEATURES = [
  { title: 'Column management', body: "Add, rename, or delete columns anytime. Can't delete the key column without picking a new one first — matching never breaks silently." },
  { title: 'Cross-project search', body: 'Alt+D or Ctrl+D opens a search across every project — type a name, get matches from every table.' },
  { title: 'Ask this project', body: 'Natural-language questions from the Ask bar — inside one project, or across all of them from your project list. Always grounded in real records, never an invented answer.' },
  { title: 'Manual rows', body: "No screenshot? Hit + Add record and log it by hand. The table doesn't care where a record came from." },
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
