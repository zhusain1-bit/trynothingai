import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ResetClient } from './ResetClient'

export const metadata: Metadata = {
  title: 'Reset password — nothing.ai',
  description: 'Set a new password for your nothing.ai account.',
  robots: { index: false, follow: false },
}

export default function ResetPage() {
  return (
    <>
      <Nav />
      <main
        className="w-full max-w-[560px] mx-auto px-6 pt-[140px] pb-[100px] flex flex-col items-center text-center gap-[20px]"
        id="main-content"
      >
        <ResetClient />
      </main>
      <Footer />
    </>
  )
}
