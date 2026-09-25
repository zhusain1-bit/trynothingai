import { WarmPage } from '@/components/light/WarmPage'
import { NavPill } from '@/components/light/NavPill'
import { Hero } from '@/components/light/Hero'
import { PricingSection } from '@/components/light/PricingSection'
import { PrivacyColumns } from '@/components/light/PrivacyColumns'
import { DownloadCta } from '@/components/light/DownloadCta'
import { Footer } from '@/components/light/Footer'
import { HomePageView } from '@/components/home/HomePageView'
import { UseCases } from '@/components/home/UseCases'
import { HowItWorks } from '@/components/home/HowItWorks'
import { SourcesSection } from '@/components/home/SourcesSection'
import { ProvenanceSection } from '@/components/home/ProvenanceSection'
import { AskSection } from '@/components/home/AskSection'
import { TemplatesSection } from '@/components/home/TemplatesSection'
import { EnterpriseSection } from '@/components/home/EnterpriseSection'

// Order follows the visitor's questions: why do I want this → show me →
// my use case → can I trust it → what does it cost → let me start.
export default function Home() {
  return (
    <WarmPage>
      <HomePageView />
      <NavPill />
      <main id="main-content">
        <Hero />
        <UseCases />
        <HowItWorks />
        <SourcesSection />
        <ProvenanceSection />
        <AskSection />
        <TemplatesSection />
        <EnterpriseSection />
        <PricingSection />
        <PrivacyColumns />
        <DownloadCta />
      </main>
      <Footer />
    </WarmPage>
  )
}
