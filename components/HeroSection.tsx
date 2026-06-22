import { PlayableDemo }       from '@/components/PlayableDemo'
import { HeroWaitlistInline } from '@/components/HeroWaitlistInline'

export function HeroSection() {
  return (
    <section
      className="w-full flex flex-col items-center px-4 pt-[96px] pb-[64px]"
      style={{ maxWidth: 860, margin: '0 auto' }}
      aria-labelledby="hero-heading"
    >
      {/* H1 */}
      <h1
        id="hero-heading"
        className="text-center font-semibold tracking-tight leading-[1.1] mb-[16px]"
        style={{ fontSize: 'clamp(32px,6.5vw,60px)', color: 'var(--mist)' }}
      >
        Make your screenshots smarter.
      </h1>

      {/* Kicker */}
      <p
        className="font-mono text-center mb-[12px]"
        style={{ fontSize: 'clamp(11px,1.4vw,13px)', color: 'var(--ghost)', letterSpacing: '0.04em' }}
      >
        never have to leave your screen.
      </p>

      {/* Subhead */}
      <p
        className="text-center leading-relaxed mb-[32px]"
        style={{ fontSize: 'clamp(14px,1.8vw,16px)', color: 'var(--ghost)', maxWidth: 520 }}
      >
        the faceless desktop ai that turns the screenshots you forget into reminders, events, and collections you actually use. it lives in a keystroke. it never opens a window.
      </p>

      {/* CTA */}
      <HeroWaitlistInline />

      {/* Demo */}
      <div className="w-full mt-[48px]">
        <PlayableDemo />
      </div>
    </section>
  )
}
