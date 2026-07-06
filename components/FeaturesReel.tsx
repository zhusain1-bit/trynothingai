import { CalendarVideo }    from '@/components/features/CalendarVideo'
import { EmailHero }        from '@/components/features/EmailHero'
import { CollectionsHero }  from '@/components/features/CollectionsHero'
import { AskHero }          from '@/components/features/AskHero'
import { StripCard }        from '@/components/strip/StripCard'
import { SongCard }         from '@/components/illustrations/SongCard'
import { TrialCard }        from '@/components/illustrations/TrialCard'
import { BoardingPass }     from '@/components/illustrations/BoardingPass'
import { LoginCard }        from '@/components/illustrations/LoginCard'
import { OrderCard }        from '@/components/illustrations/OrderCard'

const HEROES: {
  id: string; n: string; headline: string; desc: string; tagline?: string
  height: number; component: React.ReactNode
}[] = [
  {
    id: 'calendar', n: '01 · calendar',
    headline: "Screenshot an event. It's on your calendar.",
    desc: "Snip the event page — the date, time, and place are on it — and nothing.ai reads them and books it.",
    height: 460,
    component: <CalendarVideo />,
  },
  {
    id: 'email', n: '02 · email → clipboard',
    headline: "Screenshot an email. The reply's in your clipboard.",
    desc: "Snip the message, add a line of your own intent, and the reply gets copied. Paste. Done.",
    tagline: '"answer copied to clipboard." · because i don\'t wanna stop the flow state.',
    height: 486,
    component: <EmailHero />,
  },
  {
    id: 'collections', n: '03 · collections',
    headline: "Snip a product. File it. It's a list you can read.",
    desc: "Capture from any shop — the price is on the page — pick a collection, then flip the images into sorted text.",
    height: 474,
    component: <CollectionsHero />,
  },
  {
    id: 'ask', n: '04 · ask',
    headline: "Ask your captured screenshots anything.",
    desc: '"Which is cheapest?" One line back, with a tap to go buy it. Not a chat — an answer.',
    height: 470,
    component: <AskHero />,
  },
]

export function FeaturesReel() {
  return (
    <section className="w-full max-w-[864px] mx-auto px-4" aria-label="Features">
      {/* 4 heroes — single-column, text above, stage below */}
      <div className="flex flex-col gap-[26px] mb-[40px]">
        {HEROES.map(hero => (
          <article
            key={hero.id}
            style={{
              border: '1px solid var(--hairline)',
              borderRadius: 20,
              padding: 30,
              background: 'linear-gradient(180deg,rgba(20,22,28,.55),rgba(12,13,18,.55))',
            }}
          >
            {/* Caption */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 12, color: 'var(--phosphor)', letterSpacing: '.1em' }}>{hero.n}</div>
              <h2 style={{ marginTop: 9, fontSize: 'clamp(18px,2.6vw,23px)', fontWeight: 600, letterSpacing: '-.01em', color: 'var(--mist)' }}>
                {hero.headline}
              </h2>
              <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--ghost)', lineHeight: 1.5, maxWidth: 600 }}>{hero.desc}</p>
              {hero.tagline && (
                <div style={{ marginTop: 9, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 11, color: 'var(--ghost2)', lineHeight: 1.55 }}>{hero.tagline}</div>
              )}
            </div>

            {/* Stage — fixed height on desktop, capped at 360px on mobile */}
            <div
              className="max-sm:!h-[360px]"
              style={{
                position: 'relative',
                height: hero.height,
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid var(--hairline)',
                background: '#08090c',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.04)',
              }}
            >
              {hero.component}
            </div>
          </article>
        ))}
      </div>

      {/* Strip */}
      <div>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 11, letterSpacing: '.14em', textTransform: 'lowercase', color: 'var(--ghost2)', marginBottom: 16 }}>
          and a dozen small things, the same way
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }} className="max-lg:!grid-cols-3 max-sm:!grid-cols-2 max-xs:!grid-cols-1">
          <StripCard
            name="Save a song"
            toastText="Added to · Songs"
            desc="screenshot a track → it's in your list"
            delayMs={0}
            thumbnail={<div style={{ position: 'absolute', inset: 0 }}><SongCard className="w-full h-full" /></div>}
          />
          <StripCard
            name="Free-trial reminder"
            toastText="Reminder · cancel Apr 9"
            desc="screenshot it → pinged before you're charged"
            delayMs={500}
            thumbnail={<div style={{ position: 'absolute', inset: 0 }}><TrialCard className="w-full h-full" /></div>}
          />
          <StripCard
            name="Custom rules"
            toastText="Auto-filed by rule · Mexico"
            desc="&ldquo;any trip to Mexico → Mexico collection&rdquo;"
            ruleFlag="flight to MX → Mexico"
            delayMs={1000}
            thumbnail={<BoardingPass className="absolute inset-0" />}
          />
          <StripCard
            name="Save a password"
            toastText="Saved to autofill"
            desc="screenshot a login → ready to autofill"
            soon
            delayMs={1500}
            thumbnail={<div style={{ position: 'absolute', inset: 0 }}><LoginCard className="w-full h-full" /></div>}
          />
          <StripCard
            name="Log an order"
            toastText="Arriving Thu · return Apr 9"
            desc="screenshot the confirmation → arrival + returns"
            delayMs={2000}
            thumbnail={<div style={{ position: 'absolute', inset: 0 }}><OrderCard className="w-full h-full" /></div>}
          />
        </div>
      </div>
    </section>
  )
}
