import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy — nothing.ai',
  description: 'How nothing.ai handles your data.',
}

const SECTIONS = [
  {
    title: 'What we collect',
    body: "When you join the waitlist, we store your email address and — if you choose to share it — a one-line note about what you would use the product for. That is it.",
  },
  {
    title: 'What we do with it',
    body: "We use your email to send you one confirmation and to reach out when founding access opens. We don't sell it, share it with third parties, or add you to any other lists.",
  },
  {
    title: 'When the product launches',
    body: "nothing.ai processes screenshots on your device. Nothing is sent to our servers unless you explicitly trigger an action (like adding a calendar event). Your screenshots are never used to train any model.",
  },
  {
    title: 'Third-party services',
    body: "We use Resend to deliver transactional emails. Your email address is stored with them for delivery purposes, subject to Resend's privacy policy.",
  },
  {
    title: 'Deleting your data',
    body: "Email hi@trynothingai.com at any time and we will remove you from the waitlist immediately.",
  },
  {
    title: 'Contact',
    body: "Questions? hi@trynothingai.com",
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main
        className="w-full max-w-[640px] mx-auto px-6 pt-[120px] pb-[80px] flex flex-col gap-[40px]"
        id="main-content"
      >
        <div>
          <span
            className="font-mono uppercase tracking-[.18em]"
            style={{ fontSize: 11, color: 'var(--ghost2)' }}
          >
            privacy
          </span>
          <h1
            className="mt-[12px] font-semibold tracking-tight"
            style={{ fontSize: 'clamp(28px,4vw,40px)', color: 'var(--mist)' }}
          >
            How we handle your data.
          </h1>
          <p className="mt-[14px]" style={{ fontSize: 15, color: 'var(--ghost)', lineHeight: 1.65 }}>
            Short version: we collect as little as possible and keep it simple.
          </p>
        </div>

        {SECTIONS.map(section => (
          <div key={section.title}>
            <h2
              className="font-semibold"
              style={{ fontSize: 17, color: 'var(--mist)', marginBottom: 8 }}
            >
              {section.title}
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--ghost)', lineHeight: 1.65 }}>
              {section.body}
            </p>
          </div>
        ))}

        <p className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)', marginTop: 8 }}>
          Last updated June 2026
        </p>
      </main>
      <Footer />
    </>
  )
}
