import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { StatGrid } from '@/components/apple/StatGrid'
import { Reveal } from '@/components/apple/Reveal'
import { DownloadKick } from './DownloadKick'

export const metadata: Metadata = {
  title: 'Download — nothing.ai',
  description:
    'Download nothing.ai for Windows — the faceless desktop AI that makes your screenshots smarter. 3-day free trial, then $9.99/mo.',
}

export default function DownloadPage() {
  return (
    <>
      <Nav />
      <main id="main-content" style={{ background: 'var(--void)' }}>
        <section
          className="flex flex-col items-center text-center"
          style={{ padding: 'clamp(64px, 10vw, 140px) 24px clamp(80px, 12vw, 160px)' }}
          aria-label="Download nothing.ai"
        >
          <div className="flex flex-col items-center gap-[18px]" style={{ maxWidth: 820 }}>
            <Reveal index={0}>
              <div className="eyebrow">download</div>
            </Reveal>
            <Reveal index={1} blur>
              <h1 className="headline-xl" style={{ color: 'var(--mist)' }}>Almost there.</h1>
            </Reveal>
            <Reveal index={2}>
              <p className="copy-l" style={{ maxWidth: 560 }}>
                nothing.ai for Windows is on its way. it lives in{' '}
                <span className="font-mono" style={{ color: 'var(--mist)' }}>⊞ ⇧ S</span> —
                here&rsquo;s how to wake it up.
              </p>
            </Reveal>
            <Reveal index={3}>
              <DownloadKick />
            </Reveal>
          </div>

          <div className="w-full" style={{ marginTop: 'clamp(48px, 7vw, 88px)' }}>
            <Reveal>
              <StatGrid
                items={[
                  {
                    label: '01 · run',
                    stat: 'Open the installer.',
                    body: 'NothingAI-Setup.exe — from your downloads bar or folder.',
                  },
                  {
                    label: '02 · smartscreen',
                    stat: '“More info” → “Run anyway.”',
                    body: 'Windows warns about apps it hasn’t seen before. nothing.ai is safe — it runs entirely on your machine.',
                  },
                  {
                    label: '03 · summon',
                    stat: 'Press ⊞ ⇧ S.',
                    body: 'that’s it. snip anything — it reads it and acts. no window to find.',
                  },
                ]}
              />
            </Reveal>
          </div>

          <Reveal>
            <div
              className="font-mono flex flex-wrap items-center justify-center gap-x-[18px] gap-y-[6px]"
              style={{ fontSize: 12, color: 'var(--ghost2)', marginTop: 'clamp(36px, 5vw, 56px)' }}
            >
              <span>Windows 10/11 · 64-bit</span>
              <span aria-hidden="true">·</span>
              <span className="tnum">3-day free trial, then $9.99/mo — sign in inside the app</span>
            </div>
          </Reveal>

          <Reveal>
            <Link href="/" className="link-ghost" style={{ fontSize: 13, textDecoration: 'none', marginTop: 28, display: 'inline-block', padding: '6px 0' }}>
              back to nothing.ai ›
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
