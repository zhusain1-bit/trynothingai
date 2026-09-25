import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'
import { SectionHead } from '@/components/home/SectionHead'

// Only claims the desktop app (0.2.0) actually supports: capture is
// hotkey/explicit-add only, projects + sources live in a local database on
// the PC, records and sources can be deleted. Anything stronger (retention,
// training, certifications) belongs in the privacy policy, not marketing.
const POINTS = [
  { title: 'Captured on your command', body: 'Nothing only captures when you press the shortcut or add a file. There’s no background recording.' },
  { title: 'Kept with your projects', body: 'Your projects and their sources are saved on your PC, each record tied to the source it came from.' },
  { title: 'Yours to remove', body: 'Delete any record or remove any source whenever you want.' },
]

export function PrivacyColumns() {
  return (
    <section id="privacy" className="home-section">
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionHead eyebrow="privacy" title="Nothing only sees what you choose to capture." />
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ marginTop: 'clamp(28px,4vw,44px)', borderTop: '1px solid #E5E0D8' }}>
          {POINTS.map((c, i) => (
            <Reveal key={c.title} variant="light" index={i}>
              <div className={i ? 'sm:border-l border-t sm:border-t-0' : ''} style={{ padding: '24px clamp(0px,2.4vw,28px)', borderColor: '#E5E0D8', height: '100%' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, color: '#6B6B6B', marginTop: 8, lineHeight: 1.6 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal variant="light">
          <p style={{ fontSize: 13.5, color: '#6B6B6B', marginTop: 20, textAlign: 'center' }}>
            To read a capture, Nothing sends it to its AI provider for processing.{' '}
            <Link href="/privacy" className="link-warm" style={{ color: '#1A1A1A' }}>Read the privacy policy</Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
