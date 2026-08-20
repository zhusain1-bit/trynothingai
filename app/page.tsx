import { WarmPage }           from '@/components/light/WarmPage'
import { NavPill }            from '@/components/light/NavPill'
import { Hero }               from '@/components/light/Hero'
import { ProblemStatement }   from '@/components/light/ProblemStatement'
import { CaptureBlock, DailyNoteBlock, AskBlock } from '@/components/light/FeatureBlocks'
import { HighlightsRailMock }  from '@/components/light/HighlightsRailMock'
import { PrivacyColumns } from '@/components/light/PrivacyColumns'
import { SocialProofPlaceholder } from '@/components/light/SocialProofPlaceholder'
import { DownloadCta }        from '@/components/light/DownloadCta'
import { Footer }             from '@/components/light/Footer'

export default function Home() {
  return (
    <WarmPage>
      <NavPill />
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

        {/* Social proof — placeholder only (<!-- PLACEHOLDER -->), generic and
            non-attributed. The previous 14 testimonials here were fabricated
            quotes attributed to people who don't exist and were removed
            sitewide (design spec §4, item 9) — not reintroducing that. */}
        <SocialProofPlaceholder />

        {/* Download CTA */}
        <DownloadCta />

        <Footer />
      </main>
    </WarmPage>
  )
}
