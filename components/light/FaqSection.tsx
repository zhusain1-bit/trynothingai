import { Reveal } from '@/components/apple/Reveal'

const FAQS = [
  { q: 'Is it Windows-only?', a: 'Yes, today. macOS is coming — you can join the waitlist from the download page.' },
  { q: 'What happens after my 40 free captures?', a: "You'll need to subscribe ($9.99/mo, cancel anytime) to keep capturing. Everything you've already saved stays yours." },
  { q: 'Is my data used to train anything?', a: 'No. Screenshots are never used to train any model, ours or anyone else\'s.' },
  { q: 'What does "faceless" actually mean?', a: 'No app window to manage, no taskbar entry, no dock icon. It lives in a hotkey and the tray — nothing to open unless you want to look back.' },
]

export function FaqSection() {
  return (
    <section id="faq" style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#F2EFE9' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Reveal variant="light">
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(26px,3.2vw,34px)',
              color: '#1A1A1A',
              textAlign: 'center',
            }}
          >
            Questions
          </h2>
        </Reveal>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {FAQS.map((item, i) => (
            <Reveal key={item.q} variant="light" index={i}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{item.q}</h3>
                <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 6, lineHeight: 1.6 }}>{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
