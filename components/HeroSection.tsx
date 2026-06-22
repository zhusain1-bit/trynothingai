import { PlayableDemo }       from '@/components/PlayableDemo'
import { HeroWaitlistInline } from '@/components/HeroWaitlistInline'

export function HeroSection() {
  return (
    <section
      className="w-full px-6 pt-[88px] pb-[56px]"
      style={{ maxWidth: 1160, margin: '0 auto' }}
      aria-labelledby="hero-heading"
    >
      {/* Two-column on desktop: text left, demo right.
          Stacked on mobile: text top, demo below. */}
      <div className="flex flex-col lg:flex-row lg:gap-[60px] lg:items-center gap-[40px]">

        {/* ── Left column: copy + CTA ── */}
        <div
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
          style={{ flexShrink: 0, maxWidth: 440 }}
        >
          <h1
            id="hero-heading"
            className="font-semibold tracking-tight leading-[1.1] mb-[14px]"
            style={{ fontSize: 'clamp(30px,5vw,52px)', color: 'var(--mist)' }}
          >
            Make your screenshots smarter.
          </h1>

          <p
            className="font-mono mb-[10px]"
            style={{ fontSize: 'clamp(11px,1.2vw,12.5px)', color: 'var(--ghost)', letterSpacing: '0.04em' }}
          >
            never have to leave your screen.
          </p>

          <p
            className="leading-relaxed mb-[28px]"
            style={{ fontSize: 'clamp(14px,1.5vw,15px)', color: 'var(--ghost)', maxWidth: 400 }}
          >
            the faceless desktop ai that turns the screenshots you forget into reminders, events, and collections you actually use. it lives in a keystroke. it never opens a window.
          </p>

          <HeroWaitlistInline />
        </div>

        {/* ── Right column: demo ── */}
        <div className="flex-1 min-w-0 w-full">
          <PlayableDemo />
        </div>
      </div>
    </section>
  )
}
