import { Nav }                from '@/components/Nav'
import { Fn }                 from '@/components/apple/Footnote'
import { BrightenText }       from '@/components/apple/BrightenText'
import { LocalNav }           from '@/components/apple/LocalNav'
import { AppleHero }          from '@/components/apple/AppleHero'
import { Chapter }            from '@/components/apple/Chapter'
import { MacWindow }          from '@/components/apple/MacWindow'
import { Reveal }             from '@/components/apple/Reveal'
import { StatGrid }           from '@/components/apple/StatGrid'
import { HighlightsRail }     from '@/components/apple/HighlightsRail'
import { DemoVideo }          from '@/components/apple/DemoVideo'
import { AskHero }            from '@/components/features/AskHero'
import { WhyNothingSection }  from '@/components/WhyNothingSection'
import { PrivacySection }     from '@/components/PrivacySection'
import { ReviewsSection }     from '@/components/ReviewsSection'
import { WhyNotPhoneSection } from '@/components/WhyNotPhoneSection'
import { WaitlistSection }    from '@/components/WaitlistSection'
import { Footer }             from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <LocalNav />
      <main id="main-content" style={{ background: 'var(--void)' }}>

        {/* Hero */}
        <AppleHero />

        {/* Statement — the problem (scroll-linked word brightening) */}
        <Chapter
          tone="black"
          headline={<BrightenText text="People screenshot things for a reason. And then they forget that reason." />}
          sub="Everyone has thousands of dead screenshots — the show they meant to get tickets to, the jacket they meant to buy, the address they meant to save. The intent was real. It just got buried."
        />

        {/* Highlights rail */}
        <Chapter
          id="highlights"
          headline={<>Get the <span className="em">highlights.</span></>}
          sub="and a dozen small things, the same way."
        >
          <Reveal>
            <HighlightsRail />
          </Reveal>
        </Chapter>

        {/* How it works — giant dimmed hotkey glyph as the one permitted decoration */}
        <div className="relative overflow-hidden">
        <Chapter
          tone="black"
          eyebrow="how it works"
          headline={<>The AI <span className="em">without a face.</span></>}
        >
          <Reveal>
            <StatGrid
              items={[
                {
                  label: '01 · capture',
                  stat: 'Take a screenshot.',
                  body: 'nothing.ai lives in a global hotkey. press it, and it wakes up just long enough to see what you captured. then it disappears.',
                },
                {
                  label: '02 · understand',
                  stat: 'It reads it.',
                  body: "on-device. no cloud. it recognizes what's in the shot — an event, a price, a login, a reminder — and decides what to do with it.",
                },
                {
                  label: '03 · act',
                  stat: 'It does something useful.',
                  body: 'files it into a smart collection. adds a calendar event. sets a reminder. drafts a reply. routes into the apps you already use. or just saves it quietly for later.',
                },
              ]}
            />
          </Reveal>
        </Chapter>
          {/* 3% white over pure black reads as a watermark behind the content */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-mono"
            style={{ fontSize: 'clamp(120px, 20vw, 320px)', color: 'rgba(255,255,255,.03)', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}
          >
            ⊞ ⇧ S
          </div>
        </div>

        {/* Feature chapter — calendar (the one real recording) */}
        <Chapter
          id="calendar"
          eyebrow="calendar"
          headline={<>Screenshot an event. <span className="em">It&rsquo;s on your calendar.</span></>}
          sub="Snip the event page — the date, time, and place are on it — and nothing.ai reads them and books it."
          cta={{ label: 'get it on your calendar', href: '#waitlist' }}
        >
          <Reveal>
            <MacWindow aspect="1920 / 1080" glow>
              <DemoVideo src="/videos/desktop-calendar-site.mp4" label="calendar demo" />
            </MacWindow>
          </Reveal>
        </Chapter>

        {/* Feature chapter — email → clipboard */}
        <Chapter
          id="email"
          tone="black"
          layout="split"
          eyebrow="email → clipboard"
          headline={<>Screenshot an email. <span className="em">The reply&rsquo;s in your clipboard.</span></>}
          sub="Snip the message, add a line of your own intent, and the reply gets copied. Paste. Done."
        >
          <Reveal>
            <MacWindow aspect="1706 / 930">
              <DemoVideo
                src="/videos/email-demo.mp4"
                poster="/videos/email-demo-poster.webp"
                label="email demo"
                loop={false}
              />
            </MacWindow>
          </Reveal>
        </Chapter>

        {/* Feature chapter — collections */}
        <Chapter
          id="collections"
          eyebrow="collections"
          headline={<>Snip a product. <span className="em">It&rsquo;s a list you can read.</span></>}
          sub="Capture from any shop — the price is on the page — pick a collection, then flip the images into sorted text."
        >
          <Reveal>
            <MacWindow aspect="1728 / 1008" glow>
              <DemoVideo
                src="/videos/collections-demo.mp4"
                poster="/videos/collections-demo-poster.webp"
                label="collections demo"
                loop={false}
              />
            </MacWindow>
          </Reveal>
        </Chapter>

        {/* Feature chapter — ask */}
        <Chapter
          id="ask"
          tone="black"
          layout="split"
          eyebrow="ask"
          headline={<>Ask your screenshots <span className="em">anything.</span></>}
          sub={<>&ldquo;Which is cheapest?&rdquo; One line back, with a tap to go buy it. Not a chat — an answer.</>}
        >
          <Reveal>
            <MacWindow height="clamp(360px, 48vw, 470px)">
              <AskHero />
            </MacWindow>
          </Reveal>
        </Chapter>

        {/* Cross-device */}
        <WhyNotPhoneSection />

        {/* Brand manifesto */}
        <WhyNothingSection />

        {/* Privacy */}
        <PrivacySection />

        {/* Wall of love */}
        <ReviewsSection />

        {/* At-a-glance specs — Apple product pages close with one */}
        <Chapter
          defer
          eyebrow="at a glance"
          headline={<>Nothing to it. <span className="em">Literally.</span></>}
        >
          <Reveal>
            <StatGrid
              cols={4}
              items={[
                { label: 'platform', stat: 'Windows first.', body: 'mac is next.' },
                { label: 'summon', stat: '⊞ ⇧ S', body: 'one keystroke. no window, no app to open.' },
                { label: 'processing', stat: <>On-device.<Fn n={3} refId="fnref-3" /></>, body: 'your screenshots never leave your machine.' },
                { label: 'models', stat: 'Bring your own.', body: 'one memory, answered by whichever AI you prefer.' },
              ]}
            />
          </Reveal>
        </Chapter>

        {/* Waitlist */}
        <div className="w-full flex justify-center" style={{ padding: 'clamp(80px, 12vw, 160px) 16px' }}>
          <WaitlistSection />
        </div>

        <Footer />
      </main>
    </>
  )
}
