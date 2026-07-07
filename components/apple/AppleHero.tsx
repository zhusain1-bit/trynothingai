import { AutoHeroDemo } from '@/components/demo/AutoHeroDemo'
import { MacWindow } from '@/components/apple/MacWindow'
import { Reveal } from '@/components/apple/Reveal'
import { DepositCtaLink } from '@/components/apple/DepositCtaLink'
import { HeroStage } from '@/components/apple/HeroStage'
import { WAITLIST_COUNT } from '@/lib/constants'
import { Fn } from '@/components/apple/Footnote'

export function AppleHero() {
  return (
    <section aria-label="Nothing AI" style={{ padding: 'clamp(56px, 9vw, 120px) 24px 0' }}>
      <HeroStage
        copy={
          <div className="flex flex-col items-center gap-[18px] text-center" style={{ maxWidth: 900 }}>
            <div className="eyebrow">the faceless desktop ai</div>
            <h1 className="display-hero">Make your screenshots smarter.</h1>
            <p className="copy-l" style={{ maxWidth: 620 }}>
              the screenshots you forget become reminders, events, and collections you
              actually use. it lives in a keystroke. it never opens a window.
            </p>
            <div id="hero-cta" className="flex flex-wrap items-center justify-center gap-x-[28px] gap-y-[8px] mt-[6px]">
              <a href="#waitlist" className="cta-link">join the waitlist</a>
              <span>
                <DepositCtaLink location="hero">skip the line — $5</DepositCtaLink>
                <Fn n={1} refId="fnref-1" />
              </span>
            </div>
            <p className="font-mono tnum" style={{ fontSize: 12, color: 'var(--ghost2)', marginTop: 10 }}>
              {WAITLIST_COUNT} on the founding list · founding users get 50% off<Fn n={2} refId="fnref-2" />
            </p>
          </div>
        }
        stage={
          /* Capped below MacWindow's 1080px default — the demo was art-directed for ≤860px */
          <div className="w-full mx-auto" style={{ maxWidth: 980, marginTop: 'clamp(40px, 6vw, 72px)', paddingBottom: 'clamp(64px, 9vw, 128px)' }}>
            <Reveal>
              <MacWindow height="clamp(360px, 46vw, 560px)" glow>
                <AutoHeroDemo />
              </MacWindow>
            </Reveal>
          </div>
        }
      />
    </section>
  )
}
