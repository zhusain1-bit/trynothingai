import type { Metadata } from 'next'
import Link from 'next/link'
import { WarmPage } from '@/components/light/WarmPage'
import { NavPill } from '@/components/light/NavPill'
import { Footer } from '@/components/light/Footer'
import { Reveal } from '@/components/apple/Reveal'
import { InstallSteps } from '@/components/light/InstallSteps'
import { MacWaitlistCapture } from '@/components/light/MacWaitlistCapture'
import { DownloadKick } from './DownloadKick'

export const metadata: Metadata = {
  title: 'Download — nothing.ai',
  description:
    'Download nothing.ai for Windows — the desktop AI that turns your screenshots into the table you already know how to use. 10 free captures, then $9.99/mo.',
}

export default function DownloadPage() {
  return (
    <WarmPage>
      <NavPill />
      <main id="main-content">
        <section
          className="flex flex-col items-center text-center"
          style={{ padding: 'clamp(64px, 10vw, 140px) 24px clamp(80px, 12vw, 160px)' }}
          aria-label="Download nothing.ai"
        >
          <div className="flex flex-col items-center gap-[18px]" style={{ maxWidth: 820 }}>
            <Reveal variant="light" index={0}>
              <div className="font-mono" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                download
              </div>
            </Reveal>
            <Reveal variant="light" index={1}>
              <h1 style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 'clamp(32px,5vw,52px)', color: '#1A1A1A' }}>
                Almost there.
              </h1>
            </Reveal>
            <Reveal variant="light" index={2}>
              <p style={{ fontSize: 17, lineHeight: 1.5, color: '#6B6B6B', maxWidth: 560 }}>
                nothing.ai for Windows is on its way. it lives in{' '}
                <span className="font-mono" style={{ color: '#1A1A1A' }}>Alt+N</span> and{' '}
                <span className="font-mono" style={{ color: '#1A1A1A' }}>Alt+S</span> — here&rsquo;s how to wake it up.
              </p>
            </Reveal>
            <Reveal variant="light" index={3}>
              <DownloadKick />
            </Reveal>
          </div>

          <div className="w-full" style={{ marginTop: 'clamp(48px, 7vw, 88px)' }}>
            <InstallSteps />
          </div>

          <Reveal variant="light">
            <div className="font-mono flex flex-wrap items-center justify-center gap-x-[18px] gap-y-[6px]" style={{ fontSize: 12, color: '#6B6B6B', marginTop: 'clamp(36px, 5vw, 56px)' }}>
              <span>Windows 10/11 · 64-bit</span>
              <span aria-hidden="true">·</span>
              <span>10 free captures, then $9.99/mo — sign in inside the app</span>
            </div>
          </Reveal>

          <Reveal variant="light">
            <div style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid #E5E0D8', width: '100%', maxWidth: 420 }}>
              <p className="font-mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 14 }}>
                macOS coming soon
              </p>
              <MacWaitlistCapture />
            </div>
          </Reveal>

          <Reveal variant="light">
            <Link href="/" className="link-warm" style={{ fontSize: 13, marginTop: 28, display: 'inline-block', padding: '6px 0' }}>
              back to nothing.ai ›
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </WarmPage>
  )
}
