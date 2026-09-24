import type { Metadata } from 'next'
import { WarmPage } from '@/components/light/WarmPage'
import { NavPill } from '@/components/light/NavPill'
import { Footer } from '@/components/light/Footer'
import { Reveal } from '@/components/apple/Reveal'
import { PLANS } from '@/lib/pricing'
import { PricingHero } from '@/components/pricing/PricingHero'
import { PricingCard } from '@/components/pricing/PricingCard'
import { PlanPhilosophy } from '@/components/pricing/PlanPhilosophy'
import { WorkflowDiagram } from '@/components/pricing/WorkflowDiagram'
import { PlanComparison } from '@/components/pricing/PlanComparison'
import { EnterpriseValueSection } from '@/components/pricing/EnterpriseValueSection'
import { PricingFaq } from '@/components/pricing/PricingFaq'
import { FinalPricingCTA } from '@/components/pricing/FinalPricingCTA'
import { PricingPageView } from '@/components/pricing/PricingPageView'

const title = 'nothing.ai Pricing — Individual & Enterprise'
const description =
  'Turn screenshots, PDFs, images and files into structured projects with Nothing. Choose Individual for your personal workspace or Enterprise for your team.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/pricing' },
  openGraph: { title, description, url: 'https://trynothingai.com/pricing', siteName: 'nothing.ai', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function PricingPage() {
  return (
    <WarmPage>
      <PricingPageView />
      <NavPill />
      <main id="main-content">
        <PricingHero />

        <section aria-label="Plans" style={{ padding: '0 24px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: 980, margin: '0 auto' }}>
            <Reveal variant="light" panel index={0}>
              <PricingCard plan={PLANS.individual} emphasis note="Subscribe inside the app · cancel anytime" />
            </Reveal>
            <Reveal variant="light" panel index={1}>
              <PricingCard plan={PLANS.enterprise} note="Rolling out with early teams · billed per user" />
            </Reveal>
          </div>
        </section>

        <PlanPhilosophy />
        <WorkflowDiagram />
        <PlanComparison />
        <EnterpriseValueSection />
        <PricingFaq />
        <FinalPricingCTA />
      </main>
      <Footer />
    </WarmPage>
  )
}
