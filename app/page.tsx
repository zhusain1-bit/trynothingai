import { Nav }                from '@/components/Nav'
import { HeroSection }        from '@/components/HeroSection'
import { ProblemSection }     from '@/components/ProblemSection'
import { HowItWorksSection }  from '@/components/HowItWorksSection'
import { FeaturesReel }       from '@/components/FeaturesReel'
import { WhyNothingSection }  from '@/components/WhyNothingSection'
import { PrivacySection }     from '@/components/PrivacySection'
import { WhyNotPhoneSection } from '@/components/WhyNotPhoneSection'
import { WaitlistSection }    from '@/components/WaitlistSection'
import { Footer }             from '@/components/Footer'

// Subtle alternating tints — break monotony without changing darkness
const TINT = 'rgba(255,255,255,.028)'

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex flex-col items-center" style={{ background: 'var(--void)' }}>

        {/* 1. Hero — what it does */}
        <div className="w-full flex justify-center" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <HeroSection />
        </div>

        {/* 2. Problem — establish the pain */}
        <div className="w-full flex justify-center py-[56px] px-4" style={{ background: TINT, borderBottom: '1px solid var(--hairline)' }}>
          <ProblemSection />
        </div>

        {/* 3. How it works — the solution */}
        <div className="w-full flex justify-center py-[56px] px-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <HowItWorksSection />
        </div>

        {/* 4. Features reel — proof (light webpages pop against the void) */}
        <div className="w-full flex justify-center py-[64px]" style={{ background: TINT, borderBottom: '1px solid var(--hairline)' }}>
          <FeaturesReel />
        </div>

        {/* 5. Why nothing — brand story (lands better once visitor understands the product) */}
        <div className="w-full flex justify-center py-[64px] px-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <WhyNothingSection />
        </div>

        {/* 6. Privacy — trust signals */}
        <div className="w-full flex justify-center py-[56px] px-4" style={{ background: TINT, borderBottom: '1px solid var(--hairline)' }}>
          <PrivacySection />
        </div>

        {/* 7. Cross-device — differentiation */}
        <div className="w-full flex justify-center py-[56px] px-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <WhyNotPhoneSection />
        </div>

        {/* 8. Waitlist CTA */}
        <div className="w-full flex justify-center py-[80px] px-4" style={{ background: TINT, borderBottom: '1px solid var(--hairline)' }}>
          <WaitlistSection />
        </div>

        <Footer />
      </main>
    </>
  )
}
