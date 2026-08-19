import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Email confirmed — nothing.ai',
  description: 'Your email is confirmed. Head back to the app to sign in.',
  robots: { index: false, follow: false },
}

export default function ConfirmedPage() {
  return (
    <>
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
            border: '1.5px solid var(--phosphor)',
            color: 'var(--phosphor)',
            boxShadow: '0 0 20px var(--phosphor-glow)',
            fontSize: 18,
          }}
        >
          ✓
        </div>

        <span className="font-mono uppercase tracking-[.2em]" style={{ fontSize: 11, color: 'var(--phosphor)' }}>
          email confirmed
        </span>

        <h1 className="font-semibold tracking-tight" style={{ fontSize: 'clamp(26px,4vw,38px)', color: 'var(--mist)' }}>
          You&rsquo;re confirmed.
        </h1>

        <p style={{ fontSize: 15, color: 'var(--ghost)', lineHeight: 1.65, maxWidth: 400 }}>
          Your email is verified. Head back to the <strong style={{ color: 'var(--mist)' }}>nothing.ai</strong> app,
          open Settings, and sign in with your email and password to start using nothing.ai.
        </p>

        <Link href="/" className="btn-phosphor" style={{ fontSize: 13, marginTop: 4, minHeight: 44 }}>
          back to nothing.ai
        </Link>

        <p className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)', marginTop: 4 }}>
          questions? hi@trynothingai.com
        </p>
      </main>
      <Footer />
    </>
  )
}
