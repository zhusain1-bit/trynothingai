import type { Metadata } from 'next'
import Link from 'next/link'
import { WarmPage } from '@/components/light/WarmPage'
import { Nav } from '@/components/light/Nav'
import { Footer } from '@/components/light/Footer'

export const metadata: Metadata = {
  title: 'Email confirmed — nothing.ai',
  description: 'Your email is confirmed. Head back to the app to sign in.',
  robots: { index: false, follow: false },
}

export default function ConfirmedPage() {
  return (
    <WarmPage>
      <Nav />
      <main
        className="w-full max-w-[560px] mx-auto px-6 pt-[140px] pb-[100px] flex flex-col items-center text-center gap-[20px]"
        id="main-content"
      >
        <div
          className="rounded-full flex items-center justify-center font-mono"
          style={{
            width: 40,
            height: 40,
            border: '1.5px solid #1A1A1A',
            color: '#1A1A1A',
            fontSize: 18,
          }}
        >
          ✓
        </div>

        <span className="font-mono uppercase tracking-[.2em]" style={{ fontSize: 11, color: '#6B6B6B' }}>
          email confirmed
        </span>

        <h1 className="font-semibold tracking-tight" style={{ fontSize: 'clamp(26px,4vw,38px)', color: '#1A1A1A' }}>
          You&rsquo;re confirmed.
        </h1>

        <p style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.65, maxWidth: 400 }}>
          Your email is verified. Head back to the <strong style={{ color: '#1A1A1A' }}>nothing.ai</strong> app,
          open Settings, and sign in with your email and password to start using nothing.ai.
        </p>

        <Link href="/" className="btn-warm" style={{ fontSize: 13, marginTop: 4, minHeight: 44 }}>
          back to nothing.ai
        </Link>

        <p className="font-mono" style={{ fontSize: 11, color: '#6B6B6B', marginTop: 4 }}>
          questions? hi@trynothingai.com
        </p>
      </main>
      <Footer />
    </WarmPage>
  )
}
