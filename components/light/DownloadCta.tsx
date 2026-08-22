import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'
import { MagneticButton } from './MagneticButton'

export function DownloadCta() {
  return (
    <section style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#FAF8F5', textAlign: 'center' }}>
      <Reveal variant="light" panel>
        <h2 style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 'clamp(32px,4.5vw,48px)', color: '#1A1A1A' }}>
          Stop losing the things you meant to come back to.
        </h2>
        <p style={{ fontSize: 16, color: '#6B6B6B', marginTop: 12 }}>
          40 free captures, then $9.99/mo — cancel anytime.
        </p>
        <div style={{ marginTop: 24 }}>
          <MagneticButton>
            <Link href="/download" className="btn-warm" style={{ display: 'inline-flex', padding: '16px 36px', fontSize: 16 }}>
              Download for Windows
            </Link>
          </MagneticButton>
        </div>
        <p className="font-mono" style={{ fontSize: 12, color: '#6B6B6B', marginTop: 14 }}>
          macOS coming soon
        </p>
      </Reveal>
    </section>
  )
}
