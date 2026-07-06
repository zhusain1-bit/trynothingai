import { AutoHeroDemo } from '@/components/demo/AutoHeroDemo'
import { MacWindow } from '@/components/apple/MacWindow'
import { Reveal } from '@/components/apple/Reveal'
import { DepositCtaLink } from '@/components/apple/DepositCtaLink'

export function AppleHero() {
  return (
    <section
      className="flex flex-col items-center text-center"
      style={{ padding: 'clamp(56px, 9vw, 120px) 24px 0' }}
      aria-label="Nothing AI"
    >
      <div className="flex flex-col items-center gap-[18px]" style={{ maxWidth: 900 }}>
        <div className="eyebrow">the faceless desktop ai</div>
        <h1 className="display-hero">Make your screenshots smarter.</h1>
        <p className="copy-l" style={{ maxWidth: 620 }}>
          the screenshots you forget become reminders, events, and collections you
          actually use. it lives in a keystroke. it never opens a window.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-[28px] gap-y-[8px] mt-[6px]">
          <a href="#waitlist" className="cta-link">join the waitlist</a>
          <DepositCtaLink location="hero">skip the line — $5</DepositCtaLink>
        </div>
      </div>

      <div className="w-full" style={{ marginTop: 'clamp(40px, 6vw, 72px)', paddingBottom: 'clamp(64px, 9vw, 128px)' }}>
        <Reveal>
          <MacWindow height="clamp(360px, 46vw, 560px)" glow>
            <AutoHeroDemo />
          </MacWindow>
        </Reveal>
      </div>
    </section>
  )
}
