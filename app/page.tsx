import { Nav }                from '@/components/Nav'
import { HeroSection }        from '@/components/HeroSection'
import { WhyNothingSection }  from '@/components/WhyNothingSection'
import { ProblemSection }     from '@/components/ProblemSection'
import { HowItWorksSection }  from '@/components/HowItWorksSection'
import { FeaturesReel }       from '@/components/FeaturesReel'
import { PrivacySection }     from '@/components/PrivacySection'
import { WhyNotPhoneSection } from '@/components/WhyNotPhoneSection'
import { WaitlistSection }    from '@/components/WaitlistSection'
import { Footer }             from '@/components/Footer'

// Subtle alternating tints — break monotony without changing darkness
const TINT = 'rgba(255,255,255,.014)'

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex flex-col items-center" style={{ background: 'var(--void)' }}>

        {/* Hero — plain void */}
        <div className="w-full flex justify-center" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <HeroSection />
        </div>

        {/* Why nothing — slight tint */}
        <div className="w-full flex justify-center py-[60px] px-4" style={{ background: TINT, borderBottom: '1px solid var(--hairline)' }}>
          <WhyNothingSection />
        </div>

        {/* Problem — plain void */}
        <div className="w-full flex justify-center py-[56px] px-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <ProblemSection />
        </div>

        {/* How it works — slight tint */}
        <div className="w-full flex justify-center py-[56px] px-4" style={{ background: TINT, borderBottom: '1px solid var(--hairline)' }}>
          <HowItWorksSection />
        </div>

        {/* Features reel — plain void (light webpages pop against it) */}
        <div className="w-full flex justify-center py-[64px]" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <FeaturesReel />
        </div>

        {/* Privacy — slight tint */}
        <div className="w-full flex justify-center py-[56px] px-4" style={{ background: TINT, borderBottom: '1px solid var(--hairline)' }}>
          <PrivacySection />
        </div>

        {/* Cross-device — plain void */}
        <div className="w-full flex justify-center py-[56px] px-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <WhyNotPhoneSection />
        </div>

        {/* Waitlist — slight tint */}
        <div className="w-full flex justify-center py-[80px] px-4" style={{ background: TINT, borderBottom: '1px solid var(--hairline)' }}>
          <WaitlistSection />
        </div>

        <Footer />
      </main>
    </>
  )
}
