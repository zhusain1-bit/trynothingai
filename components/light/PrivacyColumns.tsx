import { Reveal } from '@/components/apple/Reveal'

const COLUMNS = [
  { title: 'stays on your machine', body: 'it sees your screen, so it runs locally. nothing is sent to a server unless you choose to.' },
  { title: 'never trained on', body: "what you capture is yours. we don't see it, we don't use it, we don't improve our model with it." },
  {
    title: 'you control retention',
    body: '[Placeholder — non-numeric retention language pending final policy copy. Do not state a specific day count (e.g. "90 days") until real policy language is supplied.]',
  },
]

export function PrivacyColumns() {
  return (
    <section id="privacy" style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#F2EFE9' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Reveal variant="light">
          <h2 className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
            privacy
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ marginTop: 24 }}>
          {COLUMNS.map((c, i) => (
            <Reveal key={c.title} variant="light" index={i}>
              <div className="card-warm" style={{ background: '#FAF8F5', border: '1px solid #E5E0D8', borderRadius: 12, padding: 24, height: '100%' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 8, lineHeight: 1.6 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
