import { WarmPage }           from '@/components/light/WarmPage'
import { Nav }                from '@/components/light/Nav'
import { Hero }               from '@/components/light/Hero'
import { ProblemStatement }   from '@/components/light/ProblemStatement'
import { Fn }                 from '@/components/apple/Footnote'
import { Chapter }            from '@/components/apple/Chapter'
import { Reveal }             from '@/components/apple/Reveal'
import { StatGrid }           from '@/components/apple/StatGrid'
import { CaptureBlock, DailyNoteBlock, AskBlock } from '@/components/light/FeatureBlocks'
import { HighlightsRailMock }  from '@/components/light/HighlightsRailMock'
import { PrivacyColumns } from '@/components/light/PrivacyColumns'
import { ReviewsSection }     from '@/components/ReviewsSection'
import { WaitlistSection }    from '@/components/WaitlistSection'
import { Footer }             from '@/components/Footer'

export default function Home() {
  return (
    <WarmPage>
      <Nav />
      <main id="main-content">

        {/* Hero */}
        <Hero />

        {/* Problem statement — absorbs the cross-device point (design spec §4) */}
        <ProblemStatement />

        {/* Feature blocks — capture, daily note, ask (design spec §4) */}
        <CaptureBlock />
        <DailyNoteBlock />
        <AskBlock />
        <HighlightsRailMock />

        {/* Privacy */}
        <PrivacyColumns />

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
                { label: 'processing', stat: <>On-device.<Fn n={1} refId="fnref-1" /></>, body: 'your screenshots never leave your machine.' },
                { label: 'pricing', stat: '3 days free.', body: 'then $9.99/mo. cancel anytime.' },
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
    </WarmPage>
  )
}
