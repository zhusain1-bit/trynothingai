import Link from 'next/link'
import { ProductVideo } from './ProductVideo'

export function Hero() {
  return (
    <section
      className="flex flex-col items-center text-center px-6"
      style={{ paddingTop: 'clamp(64px,10vw,120px)', paddingBottom: 'clamp(48px,8vw,96px)', background: '#FAF8F5' }}
    >
      <span className="font-mono load-eyebrow" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
        Windows · 10 free captures
      </span>
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
        <span className="load-line-mask"><span style={{ '--i': 0 } as React.CSSProperties}>Screenshot it.</span></span>
        <span className="load-line-mask"><span style={{ '--i': 1 } as React.CSSProperties}>It&rsquo;s a row now.</span></span>
      </h1>
      <p className="load-subhead" style={{ fontSize: 18, lineHeight: 1.6, color: '#6B6B6B', marginTop: 18, maxWidth: 560 }}>
        One key captures anything on your screen. AI reads it, matches it to a project you define, and adds or updates a row — instantly searchable, never duplicated.
      </p>
      <div className="flex flex-col items-center gap-3" style={{ marginTop: 28 }}>
        <Link href="/download" className="btn-warm load-cta" style={{ padding: '14px 28px', fontSize: 15 }}>
          Download for Windows
        </Link>
        <a href="#setup" className="link-warm load-secondary" style={{ fontSize: 13, color: '#6B6B6B' }}>
          see how it works
        </a>
        <span className="font-mono load-macos" style={{ fontSize: 12, color: '#6B6B6B' }}>macOS coming soon</span>
      </div>
      <div className="w-full load-hero-anim" style={{ marginTop: 40, maxWidth: 980 }}>
        <ProductVideo
          src="/videos/capture-to-row.mp4"
          poster="/videos/capture-to-row-poster.webp"
          alt="A captured LinkedIn profile screenshot being read by AI and turned into a new row in a CRM project table, with a confirmation notification"
          priority
        />
      </div>
    </section>
  )
}
