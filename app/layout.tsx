import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { PostHogProvider } from '@/components/PostHogProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  // Resolves relative metadata URLs (incl. the generated OG/Twitter images) to absolute.
  metadataBase: new URL('https://trynothingai.com'),
  title: 'nothing.ai — make your screenshots smarter',
  description: 'the ai that lives in your copy and paste. your life happens in pictures, not words.',
  openGraph: {
    title: 'nothing.ai — make your screenshots smarter',
    description: 'the ai that lives in your copy and paste. your life happens in pictures, not words.',
    url: 'https://trynothingai.com',
    siteName: 'nothing.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nothing.ai — make your screenshots smarter',
    description: 'the ai that lives in your copy and paste.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-void focus:text-mist focus:border focus:border-phosphor"
        >
          skip to content
        </a>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
