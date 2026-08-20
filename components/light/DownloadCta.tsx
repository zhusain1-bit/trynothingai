import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'

// Placeholder copy — final copy pending.
export function DownloadCta() {
  return (
    <section style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#FAF8F5', textAlign: 'center' }}>
      <Reveal variant="light" panel>
        <h2 style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 'clamp(32px,4.5vw,48px)', color: '#1A1A1A' }}>
          [Placeholder — download CTA headline]
        </h2>
        <p style={{ fontSize: 16, color: '#6B6B6B', marginTop: 12 }}>
          Windows · 3-day free trial, then $9.99/mo
        </p>
        <Link href="/download" className="btn-warm" style={{ display: 'inline-flex', marginTop: 24, padding: '16px 36px', fontSize: 16 }}>
          Download for Windows
        </Link>
        <p className="font-mono" style={{ fontSize: 12, color: '#6B6B6B', marginTop: 14 }}>
          macOS coming soon
        </p>
      </Reveal>
    </section>
  )
}
