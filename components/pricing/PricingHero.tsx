import { Reveal } from '@/components/apple/Reveal'

export function PricingHero() {
  return (
    <section className="flex flex-col items-center text-center" style={{ padding: 'clamp(56px, 8vw, 104px) 24px clamp(40px, 5vw, 64px)' }}>
      <Reveal variant="light" index={0}>
        <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6B6B6B' }}>
          pricing
        </span>
      </Reveal>
      <Reveal variant="light" index={1}>
        <h1
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(38px, 6vw, 64px)',
            lineHeight: 1.05,
            color: '#1A1A1A',
            marginTop: 14,
            maxWidth: 760,
          }}
        >
          Simple pricing for everything you capture.
        </h1>
      </Reveal>
      <Reveal variant="light" index={2}>
        <p style={{ fontSize: 17, lineHeight: 1.5, color: '#6B6B6B', marginTop: 18, maxWidth: 560, textWrap: 'balance' }}>
          Start with your own projects. Bring your whole team when you&rsquo;re ready.
        </p>
      </Reveal>
    </section>
  )
}
