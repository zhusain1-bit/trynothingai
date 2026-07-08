import { MacWindow } from '@/components/apple/MacWindow'
import { Reveal } from '@/components/apple/Reveal'
import { HeroStage } from '@/components/apple/HeroStage'
import { DemoVideo } from '@/components/apple/DemoVideo'

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
              <a href="/download" className="cta-link">Download for Windows</a>
              <a href="#highlights" className="link-ghost" style={{ fontSize: 13, textDecoration: 'none' }}>
                see how it works
              </a>
            </div>
            <p className="font-mono" style={{ fontSize: 12, color: 'var(--ghost2)', marginTop: 10 }}>
              free with your own API key · or nothing.ai hosted for $9.99/mo
            </p>
          </div>
        }
        stage={
          <div className="w-full mx-auto" style={{ maxWidth: 980, marginTop: 'clamp(40px, 6vw, 72px)', paddingBottom: 'clamp(64px, 9vw, 128px)' }}>
            <Reveal>
              <MacWindow aspect="1728 / 1012" glow>
                <DemoVideo
                  src="/videos/hero-demo.mp4"
                  poster="/videos/hero-demo-poster.webp"
                  label="product demo"
                  loop={false}
                />
              </MacWindow>
            </Reveal>
          </div>
        }
      />
    </section>
  )
}
