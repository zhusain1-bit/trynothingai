import { Nav }                from '@/components/Nav'
import { LocalNav }           from '@/components/apple/LocalNav'
import { AppleHero }          from '@/components/apple/AppleHero'
import { ProblemSection }     from '@/components/ProblemSection'
import { HowItWorksSection }  from '@/components/HowItWorksSection'
import { FeaturesReel }       from '@/components/FeaturesReel'
import { WhyNothingSection }  from '@/components/WhyNothingSection'
import { PrivacySection }     from '@/components/PrivacySection'
import { WhyNotPhoneSection } from '@/components/WhyNotPhoneSection'
import { WaitlistSection }    from '@/components/WaitlistSection'
import { StickyWaitlistBar }  from '@/components/StickyWaitlistBar'
import { Footer }             from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <LocalNav />
      <main id="main-content" style={{ background: 'var(--void)' }}>

        {/* 1. Hero — what it does */}
        <AppleHero />

        {/* 2. Problem — establish the pain */}
        <div className="w-full flex justify-center py-[56px] px-4" style={{ background: '#000' }}>
          <ProblemSection />
        </div>

        {/* 3. How it works — the solution */}
        <div className="w-full flex justify-center py-[56px] px-4">
          <HowItWorksSection />
        </div>

        {/* 4. Features reel — proof */}
        <div className="w-full flex justify-center py-[64px]">
          <FeaturesReel />
        </div>

        {/* 5. Why nothing — brand story */}
        <div className="w-full flex justify-center py-[64px] px-4">
          <WhyNothingSection />
        </div>

        {/* 6. Privacy — trust signals */}
        <div className="w-full flex justify-center py-[56px] px-4">
          <PrivacySection />
        </div>

        {/* 7. Cross-device — differentiation */}
        <div className="w-full flex justify-center py-[56px] px-4">
          <WhyNotPhoneSection />
        </div>

        {/* 8. Waitlist CTA */}
        <div className="w-full flex justify-center py-[80px] px-4">
          <WaitlistSection />
        </div>

        <Footer />
      </main>
      <StickyWaitlistBar />
    </>
  )
}
