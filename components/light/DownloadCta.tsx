'use client'

import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'
import { capture } from '@/lib/posthog'
import { MagneticButton } from './MagneticButton'

export function DownloadCta() {
  return (
    <section className="home-section" style={{ background: '#F2EFE9', textAlign: 'center', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(72px,10vw,128px)' }}>
      <Reveal variant="light" panel>
        <h2 style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 'clamp(36px,5.4vw,60px)', lineHeight: 1.05, color: '#1A1A1A', textWrap: 'balance' }}>
          Capture anything. Track what matters.
        </h2>
        <div className="flex flex-wrap items-center justify-center" style={{ gap: '14px 24px', marginTop: 32 }}>
          <MagneticButton>
            <a
              href="/download"
              className="btn-warm"
              style={{ display: 'inline-flex', padding: '16px 34px', fontSize: 16 }}
              onClick={() => capture('final_download_clicked')}
            >
              Download for Windows
            </a>
          </MagneticButton>
          <Link href="/#templates" className="link-warm" style={{ fontSize: 15 }} onClick={() => capture('template_clicked', { location: 'final_cta' })}>
            Browse templates
          </Link>
        </div>
        <p className="font-mono" style={{ fontSize: 12, color: '#6B6B6B', marginTop: 18 }}>
          Windows 10/11 · auto-updates · macOS coming soon
        </p>
      </Reveal>
    </section>
  )
}
