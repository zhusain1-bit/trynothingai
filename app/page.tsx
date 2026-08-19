import { WarmPage }           from '@/components/light/WarmPage'
import { Nav }                from '@/components/light/Nav'
import { Hero }               from '@/components/light/Hero'
import { ProblemStatement }   from '@/components/light/ProblemStatement'
import { CaptureBlock, DailyNoteBlock, AskBlock } from '@/components/light/FeatureBlocks'
import { HighlightsRailMock }  from '@/components/light/HighlightsRailMock'
import { PrivacyColumns } from '@/components/light/PrivacyColumns'
import { DownloadCta }        from '@/components/light/DownloadCta'
import { Footer }             from '@/components/light/Footer'

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

        {/* Social proof — intentionally empty. The previous 14 testimonials
            here were fabricated quotes attributed to people who don't exist
            and have been removed sitewide (design spec §4, item 9). Fill
            with real quotes/logos once available — do not invent content. */}

        {/* Download CTA */}
        <DownloadCta />

        <Footer />
      </main>
    </WarmPage>
  )
}
