import { Reveal } from '@/components/apple/Reveal'

// <!-- PLACEHOLDER --> Generic, non-attributed filler — no invented names or
// quotes (see design spec §4, item 9: the previous 14 fabricated testimonials
// were removed sitewide and are not being reintroduced). Swap for real
// quotes/logos once available.
export function SocialProofPlaceholder() {
  return (
    <section style={{ padding: 'clamp(48px,8vw,80px) 24px', textAlign: 'center' }}>
      <Reveal variant="light">
        <p className="font-mono" style={{ fontSize: 13, color: '#6B6B6B', letterSpacing: '.02em' }}>
          {/* PLACEHOLDER */}
          early testers are already turning screenshots into rows instead of losing them.
        </p>
      </Reveal>
    </section>
  )
}
