import { Reveal } from '@/components/apple/Reveal'

const COLUMNS = [
  {
    label: 'Individual',
    lines: ['You capture it.', 'Nothing remembers it.'],
    body: 'Build your own living database from screenshots, documents, images and files.',
  },
  {
    label: 'Enterprise',
    lines: ['Your team captures it.', 'Nothing connects it.'],
    body: 'Turn information spread across your organization into shared, structured knowledge.',
  },
]

export function PlanPhilosophy() {
  return (
    <section style={{ padding: 'clamp(80px, 12vw, 140px) 24px 0' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <Reveal variant="light">
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(30px, 4.2vw, 44px)',
              color: '#1A1A1A',
              textAlign: 'center',
            }}
          >
            Same magic. Different scale.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginTop: 'clamp(36px, 5vw, 56px)', borderTop: '1px solid #E5E0D8' }}>
          {COLUMNS.map((c, i) => (
            <Reveal key={c.label} variant="light" index={i}>
              <div
                className={i === 1 ? 'border-t md:border-t-0 md:border-l' : ''}
                style={{ padding: 'clamp(28px, 4vw, 44px) clamp(0px, 3vw, 40px)', borderColor: '#E5E0D8', height: '100%' }}
              >
                <span className="font-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                  {c.label}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-instrument-serif), Georgia, serif',
                    fontSize: 'clamp(24px, 3vw, 30px)',
                    lineHeight: 1.2,
                    color: '#1A1A1A',
                    marginTop: 12,
                  }}
                >
                  {c.lines[0]}
                  <br />
                  {c.lines[1]}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#6B6B6B', marginTop: 14, maxWidth: 380 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
