import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { WarmPage } from '@/components/light/WarmPage'
import { NavPill } from '@/components/light/NavPill'
import { Footer } from '@/components/light/Footer'

export const metadata: Metadata = {
  title: 'Privacy — nothing.ai',
  description: 'How nothing.ai handles your data.',
}

const SECTIONS: { title: string; body: ReactNode }[] = [
  {
    title: 'What we collect',
    body: "When you join the waitlist, we store your email address and — if you choose to share it — a one-line note about what you would use the product for. If you create a nothing.ai account, we store your email address for sign-in and billing. That is it.",
  },
  {
    title: 'What we do with it',
    body: "We use your email to confirm sign-ups, deliver receipts, and reach out about your access. We don't sell it, share it with third parties, or add you to any other lists.",
  },
  {
    title: 'The desktop app',
    body: "nothing.ai runs on your device, and your captures are stored on your device. When you analyze a capture, it passes through our server solely to reach Anthropic. Your screenshots are never used to train any model.",
  },
  {
    title: 'Third-party services',
    body: "We use Supabase for accounts, Stripe for payments (we never see your card number), Resend to deliver transactional emails, and Anthropic to analyze the captures you ask the app to read. Each holds only what it needs for that job, subject to its own privacy policy.",
  },
  {
    title: 'Analytics',
    body: "We use PostHog to measure anonymous usage — page visits, which link or platform sent you here, and whether you joined the waitlist. It runs without cookies and we don't track you across other sites. This data is never sold or shared, and is only used to understand what's working.",
  },
  {
    title: 'Deleting your data',
    body: "Email hi@trynothingai.com at any time and we will remove you from the waitlist, or delete your account and everything attached to it.",
  },
  {
    title: 'Contact',
    body: "Questions? hi@trynothingai.com",
  },
]

export default function PrivacyPage() {
  return (
    <WarmPage>
      <NavPill />
      <main
        className="w-full max-w-[640px] mx-auto px-6 pt-[120px] pb-[80px] flex flex-col gap-[40px]"
        id="main-content"
      >
        <div>
          <span
            className="font-mono uppercase tracking-[.18em]"
            style={{ fontSize: 11, color: '#6B6B6B' }}
          >
            privacy
          </span>
          <h1
            className="mt-[12px] font-semibold tracking-tight"
            style={{ fontSize: 'clamp(28px,4vw,40px)', color: '#1A1A1A' }}
          >
            How we handle your data.
          </h1>
          <p className="mt-[14px]" style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.65 }}>
            Short version: we collect as little as possible and keep it simple.
          </p>
        </div>

        {SECTIONS.map(section => (
          <div key={section.title}>
            <h2
              className="font-semibold"
              style={{ fontSize: 17, color: '#1A1A1A', marginBottom: 8 }}
            >
              {section.title}
            </h2>
            <p style={{ fontSize: 14.5, color: '#6B6B6B', lineHeight: 1.65 }}>
              {section.body}
            </p>
          </div>
        ))}

        <p className="font-mono" style={{ fontSize: 11, color: '#6B6B6B', marginTop: 8 }}>
          Last updated August 2026
        </p>
      </main>
      <Footer />
    </WarmPage>
  )
}
