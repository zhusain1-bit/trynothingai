import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'
import { HeroLoop } from './HeroLoop'

export function Hero() {
  return (
    <section
      className="flex flex-col items-center text-center px-6"
      style={{ paddingTop: 'clamp(64px,10vw,120px)', paddingBottom: 'clamp(48px,8vw,96px)', background: '#FAF8F5' }}
    >
      <Reveal variant="light" index={0}>
        <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
          [placeholder eyebrow — final copy pending]
        </span>
      </Reveal>
      <Reveal variant="light" index={1}>
        <h1
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(40px,7vw,64px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#1A1A1A',
            marginTop: 16,
            maxWidth: 820,
          }}
        >
          [Placeholder headline — describes the outcome, not the mechanism. Final copy pending.]
        </h1>
      </Reveal>
      <Reveal variant="light" index={2}>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: '#6B6B6B', marginTop: 18, maxWidth: 560 }}>
          [Placeholder one-line subhead — final copy pending.]
        </p>
      </Reveal>
      <Reveal variant="light" index={3}>
        <div className="flex flex-col items-center gap-3" style={{ marginTop: 28 }}>
          <Link href="/download" className="btn-warm" style={{ padding: '14px 28px', fontSize: 15 }}>
            Download for Windows
          </Link>
          <a href="#capture" className="link-warm" style={{ fontSize: 13, color: '#6B6B6B' }}>
            see how it works
          </a>
        </div>
      </Reveal>
      <Reveal variant="light" index={4}>
        <div
          className="w-full"
          style={{ marginTop: 40, maxWidth: 640, borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)' }}
        >
          <HeroLoop />
        </div>
      </Reveal>
    </section>
  )
}
